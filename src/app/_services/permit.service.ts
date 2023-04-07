import { Injectable } from "@angular/core";
import { SeasonScheduleGroupViewDto } from "../_models/permits";
import { ApiHttpService } from "./api.http.service";
import { GET_SEASON_SCHEDULE_GROUPS_URI } from "./api.uri.service";




@Injectable({ providedIn: 'root' })
export class permitService extends ApiHttpService {


  public GetSeasonScheduleGroups(seasonId: number) {
        return this.getWithId<SeasonScheduleGroupViewDto[]>(GET_SEASON_SCHEDULE_GROUPS_URI, seasonId);
      }
    


}
