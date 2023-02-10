import { Injectable } from "@angular/core";
import { LookUpHeaderDto, LookupViewDto } from "../_models/applicationmaster";
import { ApiHttpService } from "./api.http.service";
import { CREATE_LOOKUP_URI, GET_LOOKUP_URI, GET_PLANTTYPE_URI, UPDATE_LOOKUP_URI } from "./api.uri.service";



@Injectable({ providedIn: 'root' })
export class AppMasterService extends ApiHttpService {
// lookup
public GetlookUp() {
    return this.get<LookupViewDto[]>(GET_LOOKUP_URI);
    }
    public Createlookup(lookup:LookUpHeaderDto){
      return this.post<LookUpHeaderDto>(CREATE_LOOKUP_URI,lookup);
    }
    public Updatelookup(lookup: LookUpHeaderDto){
      return this.post<LookUpHeaderDto>(UPDATE_LOOKUP_URI,lookup);
    }

    
}
