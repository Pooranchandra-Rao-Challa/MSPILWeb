import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { Injectable } from "@angular/core";
import { ApiHttpService } from "./api.http.service";
import { LOGIN_URI, } from "./api.uri.service";
import { HttpClient } from '@angular/common/http';
import { LoginModel, ResponseModel } from "../_models/account/account.model";
import { BehaviorSubject, map, Observable, observeOn, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AccountService extends ApiHttpService {
  lrouter: Router;
  private respSubject?: BehaviorSubject<ResponseModel>;
  constructor(http: HttpClient,router: Router) {
    super(http, router);
    this.lrouter = router;
  }

  public Authenticate(data: LoginModel): Observable<any> {
    console.log(data);

    return this.post<ResponseModel>(LOGIN_URI, data).pipe(
      map(resp => {
        console.log(resp);
        localStorage.setItem("respModel", JSON.stringify(resp as ResponseModel))
        this.respSubject = new BehaviorSubject<ResponseModel>(resp as ResponseModel);
        //return resp;
        return this.respSubject.asObservable()
      }),
    )
  }
  public get IsLoggedIn():boolean{
    console.log(this.DecodedJWT);

    return true && this.DecodedJWT != undefined;
  }

  private get DecodedJWT(): any{
    if(this.JWTToken != "")
    return jwt_decode(this.JWTToken);
  }

  public get JWTToken(): string{
    if(localStorage.getItem("respModel")){
      const jwtResp: ResponseModel = JSON.parse(localStorage.getItem("respModel")||"")
      return jwtResp.AccessToken ||"";
    }else return ""

  }

  public Logout(){
    localStorage.removeItem("respModel");
    this.lrouter.navigate(["/"])
  }
}
