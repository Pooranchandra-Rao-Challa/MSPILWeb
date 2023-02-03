import jwt_decode from 'jwt-decode';
import { Injectable } from "@angular/core";
import { ApiHttpService } from "./api.http.service";
import { LOGIN_URI, REFRESH_TOKEN_URI, } from "./api.uri.service";
import { LoginModel, ResponseModel } from "../_models/account/account.model";
import { BehaviorSubject, map, Observable, observeOn, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AccountService extends ApiHttpService {
  private respSubject?: BehaviorSubject<ResponseModel>;
  /**
   *
   */

  public Authenticate(data: LoginModel): Observable<any> {
    return this.post<ResponseModel>(LOGIN_URI, data).pipe(
      map(resp => {
        this.saveToken((resp as ResponseModel))
        localStorage.setItem("respModel", JSON.stringify(resp as ResponseModel))
        this.respSubject = new BehaviorSubject<ResponseModel>(resp as ResponseModel);
        return this.respSubject.asObservable()
      }),
    )
  }

  public RefreshToken(data: ResponseModel):Observable<any>{
    return this.post<ResponseModel>(REFRESH_TOKEN_URI, data).pipe(
      map(resp => {
        this.saveToken((resp as ResponseModel))
        localStorage.setItem("respModel", JSON.stringify(resp as ResponseModel))
        this.respSubject = new BehaviorSubject<ResponseModel>(resp as ResponseModel);
        return this.respSubject.asObservable()
      }),
    )
  }
}
