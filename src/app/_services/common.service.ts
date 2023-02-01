import { Injectable } from "@angular/core";
import { DistrictDto, DivisionDto, StateDto } from "../_models/geomodels";
import { ApiHttpService } from "./api.http.service";
import { GET_DISTRICTS_URI, GET_DIVISION_URI, GET_STATES_URI } from "./api.uri.service";


@Injectable({ providedIn: 'root' })
export class CommonService extends ApiHttpService {
  GetDistricts() {
    return this.get<DistrictDto>(GET_DISTRICTS_URI);
  }
  GetDivision() {
    return this.get<DivisionDto>(GET_DIVISION_URI);
  }

  GetStates() {
    return this.get<StateDto>(GET_STATES_URI);
  }
}
