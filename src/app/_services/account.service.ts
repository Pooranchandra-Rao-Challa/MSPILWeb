import { Router } from '@angular/router';

import { Injectable } from "@angular/core";
import { ApiHttpService } from "./api.http.service";
import { LOGIN_URI ,  } from "./api.uri.service";
import { HttpClient } from '@angular/common/http';
import { LoginModel, ResponseModel } from "../_models/account/account.model";
import { BehaviorSubject, map, Observable, observeOn, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AccountService extends ApiHttpService{
  private respSubject?: BehaviorSubject<ResponseModel>;
    constructor(http: HttpClient,router: Router) {
      super(http,router);
    }

    public Authenticate(data:LoginModel): Observable<any>{
      console.log(data);

     return this.post<ResponseModel>(LOGIN_URI,data).pipe(
        map(resp =>{
          console.log(resp);
          localStorage.setItem("respModel",JSON.stringify(resp as ResponseModel))
          this.respSubject = new BehaviorSubject<ResponseModel>(resp as ResponseModel);
          //return resp;
          return this.respSubject.asObservable()
        }),
      )
    }

}
