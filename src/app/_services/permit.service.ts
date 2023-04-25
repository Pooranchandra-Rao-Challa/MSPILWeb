import { Injectable } from "@angular/core";
import { CircleforUserDto, DivisionsforUserDto, EstimatedViewDto, ExcessTonDto, ExcessTonViewDto, ExcessViewDto, FarmersDto, FarmersInPlotsForUserDto, IPlotScheduleViewDto, ISeasonScheduleGroupViewDto, PlantTypeForUserDto, PlotsForUserDto, ScheduleGroupPlotsDto, SectionforUserDto, VarietiesForUserDto, VillageforUserDto, } from "../_models/permits";
import { ApiHttpService } from "./api.http.service";
import { GET_CIRCLES_FOR_USER, GET_DIVISIONS_FOR_USER, GET_ESTIMATED_TON, GET_EXCESS_TON, GET_FARMERS_FOR_ESTIMATED_TON, GET_FARMERS_IN_PLOTS_FOR_USER, GET_FARMER_PLOTS_IN_SCHEDULE_URI, GET_PLANT_TYPE_FOR_USER, GET_PLOTS_FOR_USER, GET_SCHEDULE_GROUP_PLOTS_URI, GET_SEASON_SCHEDULE_GROUPS_URI,  GET_SECTIONS_FOR_USER,  GET_VARIETIES_FOR_USER,  GET_VILLAGES_FOR_USER, UPDATE_EXCESS_TON, UPDATE_EXCESS_TONNAGE, } from "./api.uri.service";




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
public GetExcessTon(excesston: ExcessViewDto) {
  return this.post<ExcessViewDto>(GET_EXCESS_TON, excesston);
}
public UpdateExcessTon(excesston: ExcessTonDto) {
  return this.post<ExcessTonDto>( UPDATE_EXCESS_TON, excesston);
}
public UpdateExcessTonnage(excesston: ExcessTonDto) {
  return this.post<ExcessTonDto>( UPDATE_EXCESS_TONNAGE, excesston);
}
public GetDivisionsforUser(seasonId: number,type: string) {
  let arr: any[] = [];
  arr.push(seasonId);
  arr.push(type);
  return this.getWithParams<DivisionsforUserDto>( GET_DIVISIONS_FOR_USER,arr );
}
public GetCirclesforUser(seasonId: number,type: string) {
  let arr: any[] = [];
  arr.push(seasonId);
  arr.push(type);
  return this.getWithParams<CircleforUserDto>(  GET_CIRCLES_FOR_USER,arr);
}
public GetSectionsforUser(seasonId: number,type: string) {
  let arr: any[] = [];
  arr.push(seasonId);
  arr.push(type);
  return this.getWithParams<SectionforUserDto>( GET_SECTIONS_FOR_USER,arr);
}
public GetVillagesforUser(seasonId: number,type: string) {
  let arr: any[] = [];
  arr.push(seasonId);
  arr.push(type);
  return this.getWithParams<VillageforUserDto>(GET_VILLAGES_FOR_USER,arr);
}


public GetVarietiesForUser(seasonId: number) {
  return this.getWithId<VarietiesForUserDto[]>(GET_VARIETIES_FOR_USER, seasonId);
}

public GetPlantTypeForUser(seasonId: number) {
  return this.getWithId<PlantTypeForUserDto[]>(GET_PLANT_TYPE_FOR_USER, seasonId);
}
public GetFarmersInPlotsForUser(seasonId: number,villageId :number,type: string) {
  let arr: any[] = [];
  arr.push(seasonId);
  arr.push(villageId);
  arr.push(type);
  return this.getWithParams<FarmersInPlotsForUserDto>(GET_FARMERS_IN_PLOTS_FOR_USER, arr);
}
public GetPlotsForUser(seasonId: number,farmerId  :number) {
  return this.getWithParams<PlotsForUserDto>(GET_PLOTS_FOR_USER, [seasonId,farmerId]);

}
public GetScheduleGroupPlots(scheduleReq: any) {
  return this.post<ScheduleGroupPlotsDto>(GET_SCHEDULE_GROUP_PLOTS_URI, scheduleReq);

}

}
