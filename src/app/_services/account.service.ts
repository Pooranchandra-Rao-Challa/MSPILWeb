import jwt_decode from 'jwt-decode';
import { Injectable } from "@angular/core";
import { ApiHttpService } from "./api.http.service";
import { LOGIN_URI, } from "./api.uri.service";
import { LoginModel, ResponseModel } from "../_models/account/account.model";
import { BehaviorSubject, map, Observable, observeOn, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AccountService extends ApiHttpService {

  private respSubject?: BehaviorSubject<ResponseModel>;
  public Authenticate(data: LoginModel): Observable<any> {
    return this.post<ResponseModel>(LOGIN_URI, data).pipe(
      map(resp => {
        localStorage.setItem("respModel", JSON.stringify(resp as ResponseModel))
        this.respSubject = new BehaviorSubject<ResponseModel>(resp as ResponseModel);
        return this.respSubject.asObservable()
      }),
    )
  }
}
