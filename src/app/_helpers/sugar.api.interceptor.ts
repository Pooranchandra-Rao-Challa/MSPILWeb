import { AccountService } from './../_services/account.service';
import { ResponseModel } from './../_models/account/account.model';
import { JWTService } from './../_services/jwt.service';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, of, switchMap, take, throwError, map, finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import { LoaderService } from '../_services/loader.service';

const TOKEN_HEADER_KEY = 'Authorization';
@Injectable()
export class SugarAPIInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private jwtService: JWTService, private accountService: AccountService, private messageService: MessageService, public loaderService: LoaderService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.loaderService.isLoading.next(true);
    const isApiUrl = request.url.startsWith(environment.ApiUrl);
    const isLoggedIn = this.jwtService.IsLoggedIn;

    //isLogin true block
    if (isLoggedIn && isApiUrl) {
      let authReq = request;
      const token = this.jwtService.JWTToken;
      if (token != null) {
        authReq = this.addTokenHeader(request, token);
      }
      return next.handle(authReq)
        .pipe(
          finalize(
            () => {
              setTimeout(() => {
                this.loaderService.isLoading.next(false);
              }, 500);
            }
          )
        );
    }
    //if not logged in
    return next.handle(request).pipe(
      map(resp => {
        let response = resp as unknown as HttpResponse<any>;
        console.log(response);
        return resp;
      }),
    );
  };


  private addTokenHeader(request: HttpRequest<any>, token: string) {
    /* for Spring Boot back-end */
    // return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });

    /* for Node.js Express back-end */
    return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, token) });
  }
}




