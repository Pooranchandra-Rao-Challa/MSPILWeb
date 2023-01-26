import { AccountService } from 'src/app/_services/account.service';
import { environment } from 'src/environments/environment';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
//import { filter, finalize, switchMap, take } from 'rxjs/operators';


@Injectable()
export class SugarAPIInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(private accountService: AccountService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with ehr user, if user is logged in and request is to the api url
    const isApiUrl = request.url.startsWith(environment.ApiUrl);
    const isLoggedIn = this.accountService.IsLoggedIn;

    console.log("isApiUrl: ",isApiUrl);
    console.log("isLoggedIn: ",isLoggedIn);
    console.log(request.url);


    // if (isLoggedIn && isApiUrl) {
    //   const req = request.clone({
    //     setHeaders: {
    //       Authorization: `Bearer ${this.accountService.JWTToken}`
    //     }
    //   });
    //   return next.handle(req);
    // }
    return next.handle(request)
  };
}

function catchError(arg0: (error: HttpErrorResponse) => any):
  import("rxjs").OperatorFunction<HttpEvent<any>, HttpEvent<any>> {
  throw new Error('Function not implemented.');
}

