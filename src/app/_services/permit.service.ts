import { Injectable } from "@angular/core";
import { IPlotScheduleViewDto, ISeasonScheduleGroupViewDto, } from "../_models/permits";
import { ApiHttpService } from "./api.http.service";
import { GET_FARMER_PLOTS_IN_SCHEDULE_URI, GET_SEASON_SCHEDULE_GROUPS_URI } from "./api.uri.service";




@Injectable({ providedIn: 'root' })
export class permitService extends ApiHttpService {


  public GetSeasonScheduleGroups(seasonId: number) {
        return this.getWithId<ISeasonScheduleGroupViewDto[]>(GET_SEASON_SCHEDULE_GROUPS_URI, seasonId);
      }
      public GetFarmerPlotsInSchedule(seasonId: any, scheduleGroupId: any) {
        return this.getWithParams<IPlotScheduleViewDto>(GET_FARMER_PLOTS_IN_SCHEDULE_URI, [seasonId,scheduleGroupId]);
      }
    


}
