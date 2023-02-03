import { AccountService } from './../_services/account.service';
import { ResponseModel } from './../_models/account/account.model';
import { JWTService } from './../_services/jwt.service';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, filter, Observable, of, switchMap, take, throwError } from 'rxjs';
const TOKEN_HEADER_KEY = 'Authorization';
@Injectable()
export class SugarAPIInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private jwtService: JWTService,private accountService: AccountService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with ehr user, if user is logged in and request is to the api url
    const isApiUrl = request.url.startsWith(environment.ApiUrl);
    const isLoggedIn = this.jwtService.IsLoggedIn;
    if (isLoggedIn && isApiUrl) {
      // const req = request.clone({
      //   setHeaders: {
      //     TOKEN_HEADER_KEY: `${this.jwtService.JWTToken}`,
      //     'Content-Type': 'application/json'
      //   }
      // });
      let authReq = request;
      const token = this.jwtService.JWTToken;
      if (token != null) {
        authReq = this.addTokenHeader(request, token);
      }
      return next.handle(authReq)
      .pipe(catchError(err => {
        if ([401].includes(err.status) && this.jwtService.IsLoggedIn) {
          // auto logout if 401 or 403 response returned from api
           return this.handle401Error(authReq,next)
        }else if ([403].includes(err.status) && this.jwtService.IsLoggedIn) {
          // auto logout if 401 or 403 response returned from api
          this.jwtService.Logout();
        }

        const error = (err && err.error && err.error.message) || err.statusText;
        console.error(err);
        return throwError(() => error);
      }));
    }
    return next.handle(request)
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
              return throwError(err);
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


