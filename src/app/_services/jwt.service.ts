import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import jwt_decode from 'jwt-decode';
import { ResponseModel } from "../_models/account/account.model";

const TOKEN_KEY = 'auth-token';
const REFRESHTOKEN_KEY = 'auth-refreshtoken';
@Injectable()
export class JWTService {
  /**
   *
   */
  constructor(
    private router: Router) {
  }
  private get DecodedJWT(): any {
    if (this.JWTToken != "")
      return jwt_decode(this.JWTToken);
  }

  public get JWTToken(): string {
    return localStorage.getItem(TOKEN_KEY) || "";
  }

  public get RefreshToken(): string {
    return localStorage.getItem(REFRESHTOKEN_KEY) || "";
  }

  public Logout() {
    localStorage.removeItem("respModel");
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESHTOKEN_KEY);
    localStorage.clear();
    this.router.navigate(["/"]);
  }

  public SaveToken(tokens: ResponseModel) {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.setItem(TOKEN_KEY, tokens.accessToken || "")
    this.saveRefreshToken(tokens);
  }

  public saveRefreshToken(tokens: ResponseModel) {
    localStorage.removeItem(REFRESHTOKEN_KEY)
    localStorage.setItem(REFRESHTOKEN_KEY, tokens.refreshToken || "")
  }

  public get IsLoggedIn(): boolean {
    return true && this.DecodedJWT != undefined;
  }

  public get IsTokenExpired(): boolean {
    const jwt = this.DecodedJWT;
    if (!jwt || jwt == "") return false;
    const expiry = jwt.exp;
    return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  }

  public get Permissions(): any {
    const jwt = this.DecodedJWT;
    if (!jwt || jwt == "") return {};
    return JSON.parse(jwt.Permissions)
  }

  public get GivenName(): string {
    const jwt = this.DecodedJWT;
    return jwt.GivenName;
  }

  public get GetLoginId(): string {
    const jwt = this.DecodedJWT;
    return jwt.userId;
  }

  public get HasQuestions(): boolean {
    const jwt = this.DecodedJWT;
    if (!jwt || jwt == "") return false;
    return jwt.SecureQuestions > 0;
  }

  public get IsFirstTimeLogin(): boolean {
    const jwt = this.DecodedJWT;
    if (!jwt || jwt == "") return false;
    return jwt.IsFirstTimeLogin > 0;
  }

  public get ThemeName(): string {
    const jwt = this.DecodedJWT;
    return jwt.ThemeName;
  }

  // public get ColorScheme(): string{

  //   const jwt = this.DecodedJWT;
  //   return jwt.ColorScheme;
  // }
}
