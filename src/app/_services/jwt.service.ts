import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import jwt_decode from 'jwt-decode';
import { ResponseModel } from "../_models/account/account.model";

@Injectable()
export class JWTService {
  /**
   *
   */
  constructor(
    private router: Router) {
  }
  private get DecodedJWT(): any{
    if(this.JWTToken != "")
      return jwt_decode(this.JWTToken);
  }

  public get JWTToken(): string{
    if(localStorage.getItem("respModel")){
      const jwtResp: ResponseModel = JSON.parse(localStorage.getItem("respModel")||"")
      return jwtResp.accessToken ||"";
    }else return ""
  }

  public Logout(){
    localStorage.removeItem("respModel");
    this.router.navigate(["/"])
  }

  public get IsLoggedIn():boolean{
    return true && this.DecodedJWT != undefined;
  }

  public get IsTokenExpired(): boolean {
    const jwt = this.DecodedJWT;
    if(!jwt || jwt == "") return false;
    const expiry = jwt.exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  public get Permissions():any{
    const jwt = this.DecodedJWT;
    if(!jwt || jwt == "")  return {};
    return JSON.parse(jwt.Permissions)
  }

  public get GivenName(): string{
    const jwt = this.DecodedJWT;
    return jwt.GivenName;
  }
}
