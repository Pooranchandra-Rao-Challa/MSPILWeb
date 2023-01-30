import { Injectable } from "@angular/core";
import { CirclesViewDto, DistrictViewDto } from "../_models/geomodels";
import { ApiHttpService } from "./api.http.service";
import { GET_CIRCLES_URI, GET_DISTRICTS_URI } from "./api.uri.service";


@Injectable({ providedIn: 'root' })
export class GeoMasterService extends ApiHttpService {

  public GetDistricts(){
    return this.get<DistrictViewDto[]>(GET_DISTRICTS_URI);
  }
  public GetCircles(){
    return this.get<CirclesViewDto[]>(GET_CIRCLES_URI);
  }


  public CreateDistrict(){

  }
}
