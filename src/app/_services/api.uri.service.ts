import { Injectable } from "@angular/core";


@Injectable({ providedIn: 'root' })
export class APIURIService {
  constructor() {}
}
export const LOGIN_URI = "Security/Login";
export const REFRESH_TOKEN_URI = "Security/Refresh"
export const CREATE_DISTRICT_URI = "GeoMaster/CreateDistrict"
export const UPDATE_DISTRICT_URI = "GeoMaster/UpdateDistrict"
export const GET_DISTRICTS_URI = "GeoMaster/GetDistricts"
export const CREATE_DIVISION_URI = "GeoMaster/CreateDivision"
export const UPDATE_DIVISION_URI = "GeoMaster/UpdateDivision"
export const GET_DIVISION_URI = "GeoMaster/GetDivisions"
export const CREATE_STATE_URI = "GeoMaster/CreateState"
export const UPDATE_STATE_URI = "GeoMaster/UpdateState"
export const GET_STATES_URI = "GeoMaster/GetStates"
export const CREATE_CIRCLE_URI = "GeoMaster/CreateCircle"
export const UPDATE_CIRCLE_URI = "GeoMaster/UpdateCircle"
export const GET_CIRCLES_URI = "GeoMaster/GetCircles"
export const CREATE_MANDAL_URI = "GeoMaster/CreateMandal"
export const UPDATE_MANDAL_URI = "GeoMaster/UpdateMandal"
export const GET_MANDALS_URI = "GeoMaster/GetMandals"
export const CREATE_SECTION_URI = "GeoMaster/CreateSection"
export const UPDATE_SECTION_URI = "GeoMaster/UpdateSection"
export const GET_SECTIONS_URI = "GeoMaster/GetSections"

