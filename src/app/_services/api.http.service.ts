import { JWTService } from './jwt.service';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { URI_ENDPOINT, URI_ENDPOINT_WITH_ID, URI_ENDPOINT_WITH_IDANDPARAM1, URI_ENDPOINT_WITH_PARAM } from 'src/environments/environment';
import { catchError, throwError } from 'rxjs';
import { ResponseModel } from '../_models/account/account.model';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable()
export class ApiHttpService {

  constructor(
    // Angular Modules
    private http: HttpClient,
    private router: Router,
    private jwtService: JWTService
  ) { }
  public get<T>(uri: string, options?: any) {
    return this.http.get<T>(URI_ENDPOINT(uri), options)
      .pipe(
        catchError(error => {
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message}`;
          } else {
            errorMsg = this.getServerErrorMessage(error);
          }
          // Add Redirect to default page
          return throwError(errorMsg);
        })
      );
  }


  public getWithId<T>(uri: string,id: any, options?: any) {
    return this.http.get<T>(URI_ENDPOINT_WITH_ID(uri,id), options)
      .pipe(
        catchError(error => {
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message}`;
          } else {
            errorMsg = this.getServerErrorMessage(error);
          }
          // Add Redirect to default page
          return throwError(errorMsg);
        })
      );
  }
  public post<T>(uri: string, data: any, options?: any) {
    return this.http.post<T>(URI_ENDPOINT(uri), data, options)
      .pipe(
        catchError(error => {
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message}`;
          } else {
            errorMsg = this.getServerErrorMessage(error);
          }
          // this.router.navigate(["error"])// Add Redirect to default page
          return throwError(error);
        })
      );
  }
  public getWithIdAndParam1<T>(uri: string,id: any,param1: string, options?: any) {
    return this.http.get<T>(URI_ENDPOINT_WITH_IDANDPARAM1(uri,id,param1), options)
      .pipe(
        catchError(error => {
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message}`;
          } else {
            errorMsg = this.getServerErrorMessage(error);
          }
          // Add Redirect to default page
          return throwError(errorMsg);
        })
      );
  }
  public getWithParam<T>(uri: string,param: any, options?: any) {
    return this.http.get<T>(URI_ENDPOINT_WITH_PARAM(uri,param), options)
      .pipe(
        catchError(error => {
          let errorMsg: string;
          if (error.error instanceof ErrorEvent) {
            errorMsg = `Error: ${error.error.message}`;
          } else {
            errorMsg = this.getServerErrorMessage(error);
          }
          // Add Redirect to default page
          return throwError(errorMsg);
        })
      );
  }
  public put<T>(uri: string, data: any, options?: any) {
    return this.http.put(URI_ENDPOINT(uri), data, options);
  }
  public delete(uri: string, options?: any) {
    return this.http.delete(URI_ENDPOINT(uri), options);
  }
  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 404: {
        return `Not Found: ${error.message}`;
      }
      case 403: {
        return `Access Denied: ${error.message}`;
      }
      case 500: {
        return `Internal Server Error: ${error.message}`;
      }
      default: {
        return `Unknown Server Error: ${error.message}`;
      }

    }
  }
  public ClearStorage(){
    localStorage.removeItem("respModel");
    this.router.navigate(["/"])
  }
  saveToken(token: ResponseModel){
    this.jwtService.SaveToken(token);
  }
}

