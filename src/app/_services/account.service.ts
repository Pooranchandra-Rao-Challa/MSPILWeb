
import { Injectable } from "@angular/core";
import { ApiHttpService } from "./api.http.service";
import { LOGIN_URI ,  } from "./api.uri.service";
import { HttpClient } from '@angular/common/http';
import { LoginModel, ResponseModel } from "../_models/account/account.model";
import { BehaviorSubject, map, Observable, observeOn, throwError } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AccountService extends ApiHttpService{
  private respSubject?: BehaviorSubject<ResponseModel>;
    constructor(http: HttpClient) {
      super(http);
    }

    public Authenticate(data:LoginModel): Observable<any>{
     return this.post<ResponseModel>(LOGIN_URI,data).pipe(
        map(resp =>{
          console.log(resp);
          localStorage.setItem("respModel",JSON.stringify(resp as ResponseModel))
          this.respSubject = new BehaviorSubject<ResponseModel>(resp as ResponseModel);


          //return resp;
          return new Observable((observe) =>{
            observe.next("Valid")
          })
        }),
        // (response: Response) => {
        //   //const data : SomeType = response.json() as SomeType;
        //   // Does something on data.data

        //   // return the modified data:
        //   return data.data; // assuming SomeType has a data properties. Following OP post
        // }

      )
    }

}
