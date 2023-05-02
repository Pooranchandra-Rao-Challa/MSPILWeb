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

          catchError(err => {
            if ([401].includes(err.status) && this.jwtService.IsLoggedIn) {
              // auto logout if 401 or 403 response returned from api
              return this.handle401Error(authReq, next)
            } else if ([403].includes(err.status) && this.jwtService.IsLoggedIn) {
              // auto logout if 401 or 403 response returned from api
              this.jwtService.Logout();
            }
            else if ([400].includes(err.status) && this.jwtService.IsLoggedIn) {
              this.messageService.add({ severity: 'error', key: 'myToast', summary: 'Error' + ' ' + err.status, detail: err.message });
            }
            else if ([404].includes(err.status) && this.jwtService.IsLoggedIn) {
              this.messageService.add({ severity: 'error', key: 'myToast', summary: 'Error' + ' ' + err.status, detail: err.message });
            }
            const error = (err && err.error && err.error.message) || err.statusText;
            console.error(error);
            console.error(JSON.stringify(err.error))
            console.error(err.error)
            return throwError(() => error);
          }),
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
        // if ([200].includes(response.status)) { 
        //   this.messageService.add({ severity: 'success', key: 'myToast', summary: 'Success!', detail: 'Signing in...!' });
        // }
        return resp;
      }),

    //   catchError(err => {
    //     if ([401].includes(err.status)) {
    //       this.messageService.add({ severity: 'error', key: 'myToast', summary: 'Error', detail: "Invalid Credentials!" });
    //       console.log(err);
    //       return throwError(err)
    //     } else if ([400].includes(err.status)) {
    //       this.messageService.add({ severity: 'error', key: 'myToast', summary: 'Error', detail: "User Not found" });
    //       return throwError(err)
    //     }
    //     else {
    //       const error = (err && err.error && err.error.message) || err.statusText;
    //       console.error(err);
    //       return throwError(() => error);
    //     }

    //   })
    );
  };

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);


      const refreshToken = new ResponseModel();
      refreshToken.accessToken = this.jwtService.JWTToken;
      refreshToken.refreshToken = this.jwtService.RefreshToken;

      if (refreshToken)
        return this.accountService.RefreshToken(refreshToken).pipe(
          switchMap((token: any) => {
            this.isRefreshing = false;

            this.jwtService.SaveToken(token);
            this.refreshTokenSubject.next(token.accessToken);

            return next.handle(this.addTokenHeader(request, token.accessToken));
          }),
          catchError((err) => {
            this.isRefreshing = false;

            this.jwtService.Logout();
            return throwError(() => new Error(err));
          })
        );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addTokenHeader(request, token)))
    );
  }
  private addTokenHeader(request: HttpRequest<any>, token: string) {
    /* for Spring Boot back-end */
    // return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });

    /* for Node.js Express back-end */
    return request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, token) });
  }
}




