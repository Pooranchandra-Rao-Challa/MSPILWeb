import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DistrictViewDto } from "../_models/geomodels";
import { ApiHttpService } from "./api.http.service";
import { GET_DISTRICTS_URI } from "./api.uri.service";


@Injectable({ providedIn: 'root' })
export class GeoMasterService extends ApiHttpService {

  public GetDistricts(){
    return this.get<DistrictViewDto>(GET_DISTRICTS_URI);
  }
}
