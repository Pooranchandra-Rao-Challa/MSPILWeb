
export class ISeasonScheduleGroupViewDto {
    createdBy?: string
    createdAt?: string
    updatedBy?: string
    updatedAt?: string
    seasonScheduleId?: number
    seasonId?: number
    GroupNo?: number
    isActive?: boolean
    toDOP?: string
    fromDOP?: string
    objPlotSchedule?:IPlotScheduleViewDto[];
  }
  export class IPlotScheduleViewDto {
    seasonId?: number
    season?: string
    farmerId?:number
    farmerCode?: string
    farmerName?: string
    fatherName?: string
    farmerVillageId?: number
    farmerVillageName?: string
    farmerDivisionName?: string
    farmerCircleName?: string
    farmerSectionName?:string
    netYieldPlots?: string
  }
  export class EstimatedViewDto{
    seasonId?: number;
    seasonName?: string;
    divisionCode?:  string;
    divisionName?: string;
    sectionCode?: string;
    sectionName?: string;
    circleCode?:  string;
    circleName?:  string;
    villageCode?: string;
    villageName?:  string;
    plantingDate?: Date
    plotNumber?: string;
    farmerId?: number;
    farmerCode?:  string;
    farmerName?:  string;
    estimatedTon?: number;
    netArea?: number;
    plotExcessTonId?: number;
    excessTonage?: number;
    plotYieldId?: number;
    plantType?:  string;
    variety?:  string;
    createdAt?: Date
    createdBy?:  string;
    updatedAt?: Date
    updateBy?: string;
    isActive?: boolean;
    }
  
    export class FarmersDto{
      farmerId?:  number;
        farmercode?:  string;
        farmerName?:  string;
        villageName?: string;
        sectionName?:  string;
        circleName?:  string;
        divisionName?:  string;
    }
    
    export class DivisionsforUserDto{
      seasonId?:  number;
      seasonName?: string;
      divisionId?:  number;
      divisionCode?: string;
      divisionName?: string;
    }
    export class CircleforUserDto{
      seasonId?:number;
      seasonName?:string;
      circleId?: number;
      divisionId?: number;
      circleCode?:string;
      circleName?: string;
      divisionCode?: string;
      divisionName?: string;
    }
    export class SectionforUserDto{
        seasonId?: number;
        seasonName?: string;
        sectionId?:number;
        sectionCode?: string;
        sectionName?: string;
        circleId?: number;
        circleCode?: string;
        circleName?: string;
        divisionId?:number;
        divisionCode?: string;
        divisionName?: string;
    }
    export class VillageforUserDto{
      seasonId?: number;
      seasonName?: string;
      villageId?:  number;
      villageCode?: string;
      villageName?: string;
      sectionId?:  number;
      sectionCode?:string;
      sectionName?:string;
      circleId?:  number;
      circleCode?: string;
      circleName?: string;
      divisionId?: number;
      divisionCode?: string;
      divisionName?: string;
    }
    export class ExcessTonViewDto{
      seasonId?: number;
      seasonName?: number;
      divisionCode?:string;
      divisionName?: string;
      circleCode?: string;
      circleName?: string;
      sectionCode?: string;
      sectionName?: string;
      villageCode?:string;
      villageName?: string;
      plantingDate?: Date;
      plotNumber?: string;
      farmerId?: number;
      farmerName?: string;
      farmerCode?: string;
      estimatedTon?: number;
      netArea?: number;
  }

export class ExcessTonDto{
  plotExcessTonId?: number;
  plotYieldId?:number;
  excessTonage?: number;
}
export class ExcessViewDto{
  seasonId?: number;
  frompltngDate?: Date;
  topltngDate?: Date;
  divisionId?: string;
  circleId?: string;
  sectionId?: string;
  villageId?: string;
  farmerId?: number;
}
export class VarietiesForUserDto  {
  varietyId?: number
  varietyName?: string
  villageId?: number;
  divisionId?: number;
  sectionId?: number;
  circleId?: number;
  planttypeId?: number;
  plotId?: number
  farmerId?:number
}
export class PlantTypeForUserDto {
  plantTypeId?: number
  plantTypeName?: string
  villageId?: number;
  divisionId?: number;
  sectionId?: number;
   circleId?: number;  
  planttypeId?: number;
  plotId?: number;
  farmerId?:number
  seasonName:any
}

export class FarmersInPlotsForUserDto {
  farmerId?: number
  farmercode?: string
  villageName?: string
  farmerName?: string
  divisionId?: number;
  sectionId?: number;
  circleId?: number;  
  villageId?:number;
  sectionName?: string;
  circleName?:string;
  divisionName?:string; 
  seasonId?: number;
  seasonName?: string; 
  
}

export class PlotsForUserDto {
  farmerId?: number
  farmercode?: string
  plotId?: number
  plotNumber?: string
  farmerName?: string
  villageName?: string
  divisionId?: number;
  sectionId?: number;
  circleId?: number;  
  villageId?:number

}
export class ScheduleGroupPlotsDto {
  seasonId?: number
  farmerId?: number
  farmercode?: string
  farmerName?: string
  villageId?: number
  villageName?: string
  sectionId?: number
  sectionName?: string
  circleId?: number
  circleName?: string
  divisionId?: number
  divisionName?: string
  fromDOP?:  Date;
  toDOP?:  Date;
  plotId?: number
  plantTypeId?: number
  varietyId?: number
}
export class ScheduleGroupPlotsViewDto {
  farmerId?: number
  farmerCode?: string
  farmerName?: string
  plotId?: number
  plotNumber?: string
  divisionName?: string
  circleName?: string
  sectionName?: string
  villageName?: string
  netArea?: number
  estimatedTon?: number
  surveyNo?: string
  plantType?: string
  variety?: string
  plantingDate?: string
}

export class SeasonCuttingOrderViewDto {
  seasonCuttingOrderId?: number;
  seasonId?: number;
  seasonName?: string;
  cuttingOrderNo?: number;
  cuttingOrderDate?: Date;
  fromSchGroupNo?: number;
  toSchGroupNo?:  number;
  fromDOP?:  Date;
  toDOP?:  Date;
  fromCCS?: number;
  toCCS?: number;
  fromBrix?:  number;
  toBrix?: number;
  fromPol?: number;
  toPol?: number;
  fromPurity?: number;
  toPurity?: number;
  createdAt?:  Date;
  createdBy ?: string;
  updatedAt?: Date;
  updatedBy?: string;
  objPlotCuttingOrder?: PlotCuttingOrderViewDto[];
}
export class SeasonQuotaViewDto {
  seasonQuotaId?: number
  seasonId?: number
  seasonName?: string
  docNo?: number
  docDate?: string
  fromSchGroupNo?: number
  toSchGroupNo?: number
  fromDate?: string
  toDate?: string
  quotaReleased?: number
  createdAt?: string
  createdBy?: string
  updatedAt?: string
  updatedBy?: string
  objPlotQuotas?:PlotQuotaViewDto[];
}
export class PlotQuotaViewDto {
  PlotQuotaId?: number
  SeasonQuotaId?: number
  QuotaReleased?: number
  DivisionCode?: string
  DivisionName?: string
  CircleCode?: string
  CircleName?: string
  SectionCode?: string
  SectionName?: string
  VillageCode?: string
  VillageName?: string
  NetArea?: number
  EstimatedTon?: number
}

export class PlotCuttingOrderViewDto{
  plotCuttingOrderId?:number;
  seasonCuttingOrderId?:number;
  cuttingOrderNo?: number;
  orderQuantity?: number;
  farmerCode?: string;
  farmerName?:string;
  divisionCode?: string;
  divisionName?: string;
  circleCode?: string;
  circleName?: string;
  sectionCode?: string;
  sectionName?: string;
  villageCode?:string;
  villageName?: string;
  plantTypeName?: string;
  varietyName?: string;
  netArea?: number;
  estimatedTon?: number;
}
export class ScheduleGroupDto {
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
  scheduleGroupId?: number
  seasonId?: number
  groupNo?: number
  fromDop?: string
  toDop?: string
  isActive?: boolean
  plotSchedules?: PlotSchedule[]

}
export class PlotSchedule {
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
  plotScheduleId?: number
  scheduleGroupId?: number
  divisionId?: number
  circleId?: number
  sectionId?: number
  farmerId?: number
  plantTypeId?: number
  varietyId?: number
  plotYieldId?: number
  villageId?: number
}

export class GetCuttingOrderViewDto{
  seasonId?: number;
  divisionId?: string;
  circleId?: string;
  sectionId?: string;
  villageId?: string;
  fromPlantingDate?: Date;
  toPlantingDate?:  Date;
  farmerId?: string;
  plotId?: string;
  plantTypeId?: string;
  varietyId?: string;
  fromSchGroupNo?: number;
  toSchGroupNo?: number;
  fromCCS?: number;
  toCCS?: number;
  fromBrix?: number;
  toBrix?: number;
  fromPol?: number;
  toPol?:  number;
  fromPurity?: number;
  toPurity?: number;

}

export class PlotQuotaDto {
  seasonId?: number
  fromGrpNo?: number
  toGrpNo?: number
  quota?: number
  filterName?: string
}
export class GetQuotasViewDto {
  sectionId?: number
  sectionName?: string
  circleId?: number
  circleName?: string
  divisionId?: number
  divisionName?: string
  villageId?: number
  villageName?: string
  tons?: number
  excessTonage?: number
  totalTons?: number
  scheduledTons?: number
  plotQuotaId?:number
  seasonQuotaId?:number

}

export class PermitQuotaDto {
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
  seasonQuotaId?: number
  seasonId?: number
  docNo?: number
  docDate?: string
  fromSchGroupNo?: number
  toSchGroupNo?: number
  fromDate?: string
  toDate?: string
  quotaReleased?: number
  groupBy?: string
  serverUpdatedStatus?: boolean
  plotQuotas?: PlotQuotaDto[]
}

export interface PlotQuotaDto {
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
  plotQuotaId?: number
  seasonQuotaId?: number
  divisionId?: number
  circleId?: number
  sectionId?: number
  villageId?: number
  quotaReleased?: number
}



