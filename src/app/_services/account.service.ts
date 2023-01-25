
import { Injectable } from "@angular/core";
import { ApiHttpService } from "./api.http.service";
import { LOGIN_URI ,  } from "./api.uri.service";
import { HttpClient } from '@angular/common/http';
import { LoginModel, ResponseModel } from "../_models/account/account.model";

@Injectable({ providedIn: 'root' })
export class AccountService extends ApiHttpService{
    constructor(http: HttpClient) {
      super(http);
    }

    public Authenticate(data:LoginModel){
      this.post<ResponseModel>(LOGIN_URI,data).subscribe(resp =>{
        console.log(resp);
      })
    }

}
