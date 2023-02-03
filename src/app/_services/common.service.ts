import { Injectable } from "@angular/core";
import { CircleDto, DistrictDto, DivisionDto, MandalDto, SectionDto, StateDto } from "../_models/geomodels";
import { ApiHttpService } from "./api.http.service";
import { GET_CIRCLES_URI, GET_DISTRICTS_URI, GET_DIVISION_URI, GET_MANDALS_URI, GET_SECTIONS_URI, GET_STATES_URI, GET_SEASONS_URI } from "./api.uri.service";


@Injectable({ providedIn: 'root' })
export class CommonService extends ApiHttpService {

  GetCirclesForDivision(divisionId:number) {
    return this.getWithId<CircleDto>(GET_CIRCLES_URI,divisionId);
  }

  GetSectionsForCircle(circleId:number) {
    return this.getWithId<SectionDto>(GET_SECTIONS_URI,circleId);
  }


  GetDistrictsForState(stateId?: number) {
    if(stateId != null) return this.getWithId<DistrictDto>(GET_DISTRICTS_URI,stateId);
    else return this.get<DistrictDto>(GET_DISTRICTS_URI);
  }


  GetMandalsForDistrict(districtId: number){
    return this.getWithId<MandalDto>(GET_MANDALS_URI,districtId);
  }

  GetDivision() {
    return this.get<DivisionDto>(GET_DIVISION_URI);
  }

  GetStates() {
    return this.get<StateDto>(GET_STATES_URI);
  }

  GetSeasons() {
    return this.get<StateDto>(GET_SEASONS_URI);
  }
}
