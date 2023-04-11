import { Injectable } from "@angular/core";
import { CircleforEstimatedtonDto, DivisionsforEstimatedtonDto, EstimatedViewDto, FarmersInPlantingDatesDto, IPlotScheduleViewDto, ISeasonScheduleGroupViewDto, SectionforEstimatedtonDto, VillageforEstimatedtonDto, } from "../_models/permits";
import { ApiHttpService } from "./api.http.service";
import { GET_CIRCLES_FOR_ESTIMATED_TON, GET_DIVISIONS_FOR_ESTIMATED_TON, GET_ESTIMATED_TON, GET_FARMERS_FOR_ESTIMATED_TON, GET_FARMER_PLOTS_IN_SCHEDULE_URI, GET_SEASON_SCHEDULE_GROUPS_URI, GET_SECTIONS_FOR_ESTIMATED_TON, GET_VILLAGES_FOR_ESTIMATED_TON } from "./api.uri.service";




@Injectable({ providedIn: 'root' })
export class permitService extends ApiHttpService {


  public GetSeasonScheduleGroups(seasonId: number) {
        return this.getWithId<ISeasonScheduleGroupViewDto[]>(GET_SEASON_SCHEDULE_GROUPS_URI, seasonId);
      }
      public GetFarmerPlotsInSchedule(seasonId: any, scheduleGroupId: any) {
        return this.getWithParams<IPlotScheduleViewDto>(GET_FARMER_PLOTS_IN_SCHEDULE_URI, [seasonId,scheduleGroupId]);
      }
    
   
 // Estimatedton
 public GetEstimatedTon(seasonId: number) {
  return this.getWithId<EstimatedViewDto>(GET_ESTIMATED_TON, [seasonId]);
}
public GetFarmersInPlantingDates(seasonId:number,frompltngDate:any,topltngDate:any,villageId:number){
  return this.getWithParams<FarmersInPlantingDatesDto>(GET_FARMERS_FOR_ESTIMATED_TON, [seasonId,frompltngDate,topltngDate,villageId]);
}

public GetDivisionsforEstimatedton() {
  return this.get<DivisionsforEstimatedtonDto[]>( GET_DIVISIONS_FOR_ESTIMATED_TON);
}
public GetCirclesforEstimatedton() {
  return this.get<CircleforEstimatedtonDto[]>(  GET_CIRCLES_FOR_ESTIMATED_TON );
}
public GetSectionsforEstimatedton() {
  return this.get<SectionforEstimatedtonDto[]>( GET_SECTIONS_FOR_ESTIMATED_TON);
}
public GetVillagesforEstimatedton() {
  return this.get<VillageforEstimatedtonDto[]>(GET_VILLAGES_FOR_ESTIMATED_TON );
}

}
