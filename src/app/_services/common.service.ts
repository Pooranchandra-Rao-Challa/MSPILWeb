import { Injectable } from "@angular/core";
import { ApplicationConstantDto } from "../_models/common";
import { CircleDto, DistrictDto, DivisionDto, MandalDto, SectionDto, StateDto, VillageDto } from "../_models/geomodels";
import { ApiHttpService } from "./api.http.service";
import { GET_CIRCLES_URI, GET_DISTRICTS_URI, GET_DIVISION_URI, GET_MANDALS_URI, GET_SEASON_URI, GET_SECTIONS_URI, GET_STATES_URI, GET_VILLAGES_URI, GET_WAREHOUSE_URI,  GET_SCREEN_DOC_NO_URI, GET_APPLICATION_CONSTANTS_URI, GET_CONSTANTS_URI, UPDATE_CONSTANT } from './api.uri.service';
import { EDocumentNumberScreens } from "src/environments/environment";



@Injectable({ providedIn: 'root' })
export class CommonService extends ApiHttpService {

  GetCirclesForDivision(divisionId: number) {
    return this.getWithId<CircleDto>(GET_CIRCLES_URI, divisionId);
  }

  GetSectionsForCircle(circleId: number) {
    return this.getWithId<SectionDto>(GET_SECTIONS_URI, circleId);
  }

  GetDistrictsForState(stateId?: number) {
    if (stateId != null) return this.getWithId<DistrictDto>(GET_DISTRICTS_URI, stateId);
    else return this.get<DistrictDto>(GET_DISTRICTS_URI);
  }

  GetMandalsForDistrict(districtId: number) {
    return this.getWithId<MandalDto>(GET_MANDALS_URI, districtId);
  }

  GetDivisionForMandal(stateId: number) {
    return this.getWithId<DivisionDto>(GET_DIVISION_URI, stateId);
  }

  GetDivision() {
    return this.get<DivisionDto>(GET_DIVISION_URI);
  }
  GetDistricts() {
    return this.get<DistrictDto>(GET_DISTRICTS_URI);
  }
  GetStates() {
    return this.get<StateDto>(GET_STATES_URI);
  }

  GetSeasons() {
    return this.get<StateDto>(GET_SEASON_URI);
  }
  GetVillages() {
    return this.get<VillageDto>(GET_VILLAGES_URI)
  }

  GetApplicationConstant() {
    return this.get<ApplicationConstantDto>(GET_APPLICATION_CONSTANTS_URI)
  }

  GetConstants() {
    return this.get<ApplicationConstantDto>(GET_CONSTANTS_URI)
  }

  GetDocNo(seasonId: number,screenNumber: EDocumentNumberScreens) {
    return this.getWithParams<number>(GET_SCREEN_DOC_NO_URI,[seasonId,screenNumber]);
  }

  UpdateConstant(data: ApplicationConstantDto) {
    return this.post(UPDATE_CONSTANT,data);
  }
}
