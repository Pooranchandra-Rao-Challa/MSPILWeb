import { Injectable } from "@angular/core";
import { CirclesViewDto, DistrictDto, DistrictViewDto } from "../_models/geomodels";
import { ApiHttpService } from "./api.http.service";
import { CREATE_DISTRICT_URI, GET_CIRCLES_URI, GET_DISTRICTS_URI, UPDATE_DISTRICT_URI } from "./api.uri.service";


@Injectable({ providedIn: 'root' })
export class GeoMasterService extends ApiHttpService {

  public GetDistricts(){
    return this.get<DistrictViewDto[]>(GET_DISTRICTS_URI);
  }
  public GetCircles(){
    return this.get<CirclesViewDto[]>(GET_CIRCLES_URI);
  }
  public CreateDistrict(district: DistrictDto){
    return this.post<DistrictDto>(CREATE_DISTRICT_URI,district);
  }

  public UpdateDistrict(district: DistrictDto){
    return this.post<DistrictDto>(UPDATE_DISTRICT_URI,district);
  }
}
