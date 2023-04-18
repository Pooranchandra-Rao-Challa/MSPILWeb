
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
  
    export class FarmersInPlantingDatesDto{
      farmerId?:  number;
      farmercode?: string;
      farmerName?: string;
      villageName?:string;
    }
    
    export class DivisionsforUserDto{
      divisionId?: number;
      divisionCode?:string;
      divisionName?: string;
    }
    export class CircleforUserDto{
      circleId?: number;
      divisionId?: number;
      circleCode?:string;
      circleName?: string;
    }
    export class SectionforUserDto{
      sectionId?: number;
      divisionId?: number;
      circleId?: number;
      sectionCode?:string;
      sectionName?: string;
    }
    export class VillageforUserDto{
      villageId?: number;
      divisionId?: number;
      sectionId?: number;
      circleId?: number;
      villageCode?:string;
      villageName?: string;
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

export class VarietiesForUserDto  {
  varietyId?: number
  varietyName?: string
  villageId?: number;
  divisionId?: number;
  sectionId?: number;
  circleId?: number;
  planttypeId?: number;
  plotId?: number
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
}


