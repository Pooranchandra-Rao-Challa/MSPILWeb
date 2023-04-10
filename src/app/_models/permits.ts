
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
