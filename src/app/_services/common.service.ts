import { Injectable } from "@angular/core";
import { StateDto } from "../_models/geomodels";
import { ApiHttpService } from "./api.http.service";
import { GET_STATES_URI } from "./api.uri.service";


@Injectable({ providedIn: 'root' })
export class CommonService extends ApiHttpService {

  GetStates() {
    return this.get<StateDto>(GET_STATES_URI);
  }
}
