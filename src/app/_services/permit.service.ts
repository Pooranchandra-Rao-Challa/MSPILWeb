import { Injectable } from "@angular/core";
import { CircleforUserDto, DivisionsforUserDto, EstimatedViewDto, ExcessTonDto, ExcessTonViewDto, ExcessViewDto, FarmersDto, FarmersInPlotsForUserDto, GetCuttingOrderViewDto, GetQuotasViewDto, IPlotScheduleViewDto, ISeasonScheduleGroupViewDto, PermitQuotaDto, PlantTypeForUserDto, PlotCuttingOrderViewDto, PlotQuotaViewDto, PlotsForUserDto, ScheduleGroupDto, ScheduleGroupPlotsDto, SeasonCuttingOrderDto, SeasonCuttingOrderViewDto, SeasonQuotaViewDto, SectionforUserDto, VarietiesForUserDto, VillageforUserDto, } from "../_models/permits";
import { ApiHttpService } from "./api.http.service";
import { CREATE_CUTTING_ORDER_URI, CREATE_EXCESS_TON, CREATE_PERMIT_QUOTA, CREATE_SCHEDULE_GROUP_URI, GET_CIRCLES_FOR_USER, GET_CUTTING_ORDERS, GET_DIVISIONS_FOR_USER, GET_ESTIMATED_TON, GET_EXCESS_TON, GET_FARMERS_FOR_ESTIMATED_TON, GET_FARMERS_IN_PLOTS_FOR_USER, GET_FARMER_PLOTS_IN_SCHEDULE_URI, GET_PLANT_TYPE_FOR_USER, GET_PLOTS_FOR_USER, GET_PLOT_CUTTING_ORDERS, GET_PLOT_QUOTAS_URI, GET_QUOTAS_URI, GET_SCHEDULE_GROUP_PLOTS_URI, GET_SEASON_CUTTING_ORDERS, GET_SEASON_QUOTAS, GET_SEASON_SCHEDULE_GROUPS_URI,  GET_SECTIONS_FOR_USER,  GET_VARIETIES_FOR_USER,  GET_VILLAGES_FOR_USER,UPDATE_EXCESS_TONNAGE, UPDATE_PERMIT_QUOTA_URI, } from "./api.uri.service";




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
public CreateExcessTon(excesston: ExcessTonDto) {
  return this.post<ExcessTonDto>( CREATE_EXCESS_TON, excesston);
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





public GetFarmersInPlotsForUser(seasonId: number,villageId :number,type: string) {
  let arr: any[] = [];
  arr.push(seasonId);
  arr.push(villageId);
  arr.push(type);
  return this.getWithParams<FarmersInPlotsForUserDto>(GET_FARMERS_IN_PLOTS_FOR_USER, arr);
}

public GetPlotsForUser(seasonId: number,farmerId:number ,villageId :number,type: string) {
  let arr: any[] = [];
  arr.push(seasonId);
  arr.push(farmerId);
  arr.push(villageId);
  arr.push(type);
  return this.getWithParams<PlotsForUserDto>(GET_PLOTS_FOR_USER, arr);
}
public GetScheduleGroupPlots(scheduleGroupingPlots: ScheduleGroupPlotsDto) {
  return this.post<ScheduleGroupPlotsDto>(GET_SCHEDULE_GROUP_PLOTS_URI, scheduleGroupingPlots);

}
public GetVarietiesForUser(seasonId: number,farmerId:number ,villageId :number,plotId : number) {
  let arr: any[] = [];
  arr.push(seasonId);
  arr.push(farmerId);
  arr.push(villageId);
  arr.push(plotId );
  return this.getWithParams<VarietiesForUserDto>(GET_VARIETIES_FOR_USER, arr);
}
public GetPlantTypeForUser(seasonId: number,farmerId:number ,villageId :number,plotId : number) {
  let arr: any[] = [];
  arr.push(seasonId);
  arr.push(farmerId);
  arr.push(villageId);
  arr.push(plotId );
  return this.getWithParams<PlantTypeForUserDto>(GET_PLANT_TYPE_FOR_USER, arr);
}

// Cutting order
public GetSeasonCuttingOrder(seasonId: number) {
  return this.getWithId<SeasonCuttingOrderViewDto>(GET_SEASON_CUTTING_ORDERS, [seasonId]);
}
public GetPlotCuttingOrder(seasonId:any,seasonCuttingOrderId: any) {
  return this.getWithParams<PlotCuttingOrderViewDto>(GET_PLOT_CUTTING_ORDERS,[seasonId,seasonCuttingOrderId]);
}
public GetCuttingOrder(cuttingorder: GetCuttingOrderViewDto) {
  return this.post<GetCuttingOrderViewDto>(GET_CUTTING_ORDERS, cuttingorder);
}
public CreateCuttingOrder(cuttingorder: SeasonCuttingOrderDto) {
  return this.post<SeasonCuttingOrderDto>(CREATE_CUTTING_ORDER_URI, cuttingorder);
}
public GetSeasonQuotas(seasonId: number) {
  return this.getWithId<SeasonQuotaViewDto>(GET_SEASON_QUOTAS, seasonId);
}
public GetPlotQuotas(seasonId:any,SeasonQuotaId :any) {
  return this.getWithParams<PlotQuotaViewDto>(GET_PLOT_QUOTAS_URI,[seasonId,SeasonQuotaId]);
  }

  public CreateScheduleGroup(ScheduleGroup: any) {
    return this.post<ScheduleGroupDto>(CREATE_SCHEDULE_GROUP_URI, ScheduleGroup);
  }

  public GetQuotas(GetQuotas: GetQuotasViewDto) {
    return this.post<GetQuotasViewDto>(GET_QUOTAS_URI, GetQuotas);
  }

  public CreatepermitQuota(permitQuota: PermitQuotaDto) {
    return this.post<PermitQuotaDto>(CREATE_PERMIT_QUOTA, permitQuota);
  }

  public UpdatePermitQuota(permitQuota: PermitQuotaDto) {
    return this.post<PermitQuotaDto>(UPDATE_PERMIT_QUOTA_URI, permitQuota);
  }
}
