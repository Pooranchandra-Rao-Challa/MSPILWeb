import { Injectable } from "@angular/core";
import { LookUpHeaderDto, LookupViewDto, plantTypeDto, planttypeViewDto } from "../_models/applicationmaster";
import { ApiHttpService } from "./api.http.service";
import { CREATE_LOOKUP_URI, CREATE_PLANTTYPE_URI, GET_LOOKUP_URI, GET_PLANTTYPE_URI, UPDATE_LOOKUP_URI, UPDATE_PLANTTYPE_URI } from "./api.uri.service";



@Injectable({ providedIn: 'root' })
export class AppMasterService extends ApiHttpService {
  // lookup
  public GetlookUp() {
    return this.get<LookupViewDto[]>(GET_LOOKUP_URI);
  }
  public Createlookup(lookup:LookUpHeaderDto) {
    return this.post<LookUpHeaderDto>(CREATE_LOOKUP_URI, lookup);
  }
  public Updatelookup(lookup:LookUpHeaderDto) {
    return this.post<LookUpHeaderDto>(UPDATE_LOOKUP_URI, lookup);
  }
  // plant type
  public GetPlantType() {
    return this.get<planttypeViewDto[]>(GET_PLANTTYPE_URI);
  }
  public CreatePlantType(plant:plantTypeDto) {
    return this.post<plantTypeDto>(CREATE_PLANTTYPE_URI,plant);
  }
  public UpdatePlantType(plant:plantTypeDto) {
    return this.post<plantTypeDto>(UPDATE_PLANTTYPE_URI,plant);
  }
}
