import { Injectable } from "@angular/core";


@Injectable({ providedIn: 'root' })
export class APIURIService {
  constructor() {}
}
export const LOGIN_URI = "Security/Login"
export const CREATE_DISTRICT_URI = "GeoMaster/CreateDistrict"
export const GET_DISTRICTS_URI = "GeoMaster/GetDistricts"
export const GET_STATES_URI = "GeoMaster/GetStates"
export const GET_CIRCLES_URI = "GeoMaster/GetCircles"
