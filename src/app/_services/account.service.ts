import jwt_decode from 'jwt-decode';
import { Injectable } from "@angular/core";
import { ApiHttpService } from "./api.http.service";
import { LOGIN_URI, REFRESH_TOKEN_URI, } from "./api.uri.service";
import { LoginModel, ResponseModel } from "../_models/account/account.model";
import { BehaviorSubject, catchError, map, Observable, observeOn, of, switchMap, throwError } from "rxjs";

export class LogInSuccessModel{
  isFirstTimeLogin: boolean = false;
  isLoginSuccess: boolean = false;
  hasSecureQuestions: boolean = false;
}
@Injectable({ providedIn: 'root' })
export class AccountService extends ApiHttpService {
  private respSubject?: BehaviorSubject<ResponseModel>;


  public Authenticate(data: LoginModel): Observable<LogInSuccessModel> {
    return this.post<ResponseModel>(LOGIN_URI, data).pipe(
      switchMap(resp => {
        this.saveToken((resp as ResponseModel))
        localStorage.setItem("respModel", JSON.stringify(resp as ResponseModel))
        this.respSubject = new BehaviorSubject<ResponseModel>(resp as ResponseModel);
        const model: LogInSuccessModel = {
          isFirstTimeLogin: this.IsFirstTimeLogin,
          isLoginSuccess: true,
          hasSecureQuestions: this.HasQuestions}
        return of<LogInSuccessModel>(model)
      })
    )
  }

  public RefreshToken(data: ResponseModel):Observable<boolean>{
    return this.post<ResponseModel>(REFRESH_TOKEN_URI, data).pipe(
      switchMap(resp => {
        this.saveToken((resp as ResponseModel))
        localStorage.setItem("respModel", JSON.stringify(resp as ResponseModel))
        this.respSubject = new BehaviorSubject<ResponseModel>(resp as ResponseModel);
        return of<boolean>(true)
      }),
    )
  }
}
