import { JWTService } from './../_services/jwt.service';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, throwError } from 'rxjs';
//import { filter, finalize, switchMap, take } from 'rxjs/operators';


@Injectable()
export class SugarAPIInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private jwtService: JWTService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with ehr user, if user is logged in and request is to the api url
    const isApiUrl = request.url.startsWith(environment.ApiUrl);
    const isLoggedIn = this.jwtService.IsLoggedIn;
    if (isLoggedIn && isApiUrl) {
      const req = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.jwtService.JWTToken}`,
          'Content-Type': 'application/json'
        }
      });
      return next.handle(req)
      // .pipe(catchError(err => {
      //   if ([401, 403].includes(err.status) && this.jwtService.IsLoggedIn) {
      //     // auto logout if 401 or 403 response returned from api
      //     this.jwtService.Logout();
      //   }

      //   const error = (err && err.error && err.error.message) || err.statusText;
      //   console.error(err);
      //   return throwError(() => error);
      // }));
    }
    return next.handle(request)
  };
}


