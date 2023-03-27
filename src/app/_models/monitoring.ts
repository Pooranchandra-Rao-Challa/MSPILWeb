export class PlotOfferDto {
  plotOfferId?: number;
  seasonId?: number;
  offerNo!: number;
  offerDate?: Date;
  isNewFarmer?: boolean;
  farmerId?: number;
  plotVillageId?: number;
  expectedArea?: number;
  plantTypeId?: number;
  expectedPlantingDate?: Date;
  expectedVarietyId?: number;
  reasonForNotPlantingId?: number;
  entityStatusId?: number;
  serverUpdatedStatus?: boolean;
}
export interface IPlotOfferViewDto {
  allottedPlotId: number;
  seasonId: number;
  seasonName: string;
  isNewFarmer: boolean;
  offerNo: number;
  offerDate: Date;
  farmerId: number;
  farmerCode: string;
  farmerName: string;
  fatherName: string;
  farmerVillageId: number;
  farmerVillageName: string;
  farmerDivisionName: string;
  farmerCircleName: string;
  farmerSectionName: string;
  offeredPlots: string;
  ObjOfferedPlots: IFarmerPlotOffersViewDto[];
  plotVillageId: number;
  plotVillageName: string;
  plotDivisionName: string;
  plotCircleName: string;
  plotSectionName: string;
  plantTypeId: number;
  plantType: string;
  varietyId: number;
  expectedVariety: string;
  plantingDate: Date;
  expectedArea: number;
  reasonForNotPlantingId: number;
  reasonForNotPlanting: string;
  forApproval: boolean;
  approvedAt: Date;
  dataSyncedAt: Date;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

export interface IFarmerInPlotOfferDto {
  offerNo: number;
  offerDate: Date;
  isNewFarmer: boolean;
  seasonId: number;
  seasonName: string;
  farmerId: number;
  farmerCode: string;
  farmerName: string;
  fatherName: string;
  farmerVillageId: number;
  farmerVillageName: string;
  farmerDivisionName: string;
  farmerCircleName: string;
  farmerSectionName: string;
  measuredPlots: string;
  offeredPlots: string;
  ObjOfferedPlots?: IFarmerPlotOffersViewDto[];
  ObjMeasuredPlots?: PlotAssessmentViewDto[];
}

export interface IFarmerPlotOffersViewDto{
  plotOfferId: number;
  offerNo: number;
  offerDate: Date;
  isNewFarmer: boolean;
  plotVillageId: number;
  plotVillageName: string;
  plotDivisionName: string;
  plotCircleName: string;
  plotSectionName: string;
  plantTypeId: number;
  plantType: string;
  expectedVarietyId: number;
  expectedVariety: string;
  expectedPlantingDate: Date;
  expectedArea: number;
  reasonForNotPlantingId: number;
  reasonForNotPlanting: string;
  forApproval: boolean;
  approvedAt: Date;
  dataSyncedAt: Date;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

export class PlotAssessmentDto {
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  plotAssessmentId?: number;
  plotId?: number;
  measuredArea?: number;
  // measuredDate?: Date;
  isaDemoPlot?: boolean;
  weedStatusId?: number;
  interCropingId?: number;
  hasMicroNutrientDeficiency?: boolean;
  isTrashMulchingDone?: boolean;
  isGapsFillingDone?: boolean;
  serverUpdatedStatus?:boolean;
  diseases?: plotDiseasesDto[];
  fertilizers?: plotFertilizersDto[];
  pests?: plotPestsDto[];
  weedicides?: plotWeedicidesDto[];
}
export class plotDiseasesDto {
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  diseaseDtoId?: number;
  plotAssessmentId?: number;
  plotAgreementId?: number;
  plotYieldId?:number;
  diseaseId?: number;
  identifiedDate?: Date;
  controlDate?: Date;
  remarks?: string;
  serverUpdatedStatus?: boolean;
}

export class plotFertilizersDto {
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  fertilizerDtoId?: number;
  plotAssessmentId?: number;
  plotAgreementId?: number;
  plotYieldId?: number;
  fertilizerId?: number;
  serverUpdatedStatus?: boolean;
}

export class plotPestsDto {
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  pestDtoId?: number;
  plotAssessmentId?: number;
  plotAgreementId?: number;
  plotYieldId?: number 
  pestId?: number;
  identifiedDate?: Date;
  controlDate?: Date;
  remarks?: string;
  serverUpdatedStatus?: boolean;
}

export class plotWeedicidesDto {
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  weedicideDtoId?: number;
  plotAssessmentId?: number;
  plotAgreementId?: number;
  plotYieldId?: number;
  weedicideId?: number;
  serverUpdatedStatus?: boolean;
}

export class PlotAssessmentViewDto {
  plotAssessmentId?: number;
  seasonId?: number;
  season?: Date;
  plotReportId?: number;
  plotNumber?: string;
  previousCropId?: number;
  previousCrop?: string;
  cropTypeId?: number;
  cropType?: string;
  allottedPlotId?: number;
  offerNo?: number;
  farmerId?: number;
  farmerCode?: string;
  farmerName?:string;
  fatherName?: string;
  farmerVillageId?: number;
  farmerVillageName?: string;
  farmerDivisionName?: string;
  farmerCircleName?: string;
  farmerSectionName?: string;
  plotVillageId?: number;
  plotVillageName?: string;
  plotDivisionName?: string;
  plotCircleName?: string;
  plotSectionName?: string;
  plantTypeId?: number;
  plantType?: string;
  surveyNo?: number;
  reportedArea?: number;
  plantingDate?: Date;
  varietyId?: number;
  variety?: string;
  fieldName?: string;
  birNumber?: number;
  birDate?: Date;
  plotTypeId?: number;
  plotType?: string;
  assessedArea?: number;
  assessedDate?: Date;
  isADemoPlot?: boolean;
  weedStatusId?: number;
  weedStatus?: string;
  interCropId?: number;
  interCrop?: string;
  hasMicroNutrientDeficiency?: boolean;
  isTrashMulchingDone?: boolean;
  isGapsFillingDone?: boolean;
  isActive?: boolean;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

}
export class PlotTransferDto {
  plotTransferId?: number
  seasonId?: number
  plotAssessmentId?: number
  docNo?: number
  docDate?: string
  plotTransferTypeId?: number
  fromFarmerId?: number
  transferArea?: number
  toFarmerId?: number
  plotTransferReasonId?: number
  isActive?: boolean
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
}
export class PlotTransferViewDto {
  plotTransferId?: number
  seasonId?: number
  SeasonName?: string
  plotAssessmentId?: number
  docNo?: number
  docDate?: string
  plotTransferTypeId?: number
  plotTransferType?: string
  fromFarmerId?: number
  fromFarmerCode?: number
  fromFarmerName?: string
  transferArea?: number
  toFarmerId?: number
  toFarmerCode?: number
  toFarmerName?: string
  plotTransferReasonId?: number
  plotTransferReason?: string
  isActive?: boolean
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
}

export class PlotReportDto {
  plotReportId?: number;
  seasonId?: number;
  allottedPlotId?: number;
  cropTypeId?: number;
  plantTypeId?: number;
  plotNumber?: string;
  surveyNo?: string;
  reportedArea?: number;
  plantingDate?: Date;
  plantSubTypeId?: number;
  varietyId?: number;
  fieldName?: string;
  birnumber?: string;
  birdate?: Date;
  plotTypeId?: number;
  demoPlotArea?: number;
  seedMaterialUsedId?: number;
  soilTypeId?: number;
  spacingId?: number;
  isNeedHotWaterTreatment?: boolean;
  isDustingApplied?: boolean;
  isTrashMulchingDone?: boolean;
  isPreviouslyRedPlot?: boolean;
  isBasalFertilization?: boolean;
  previousCropId?: number;
  sourceOfIrrigationId?: number;
  isCompositeFormYard?: boolean;
  isFilterPressMud?: boolean;
  isGreenManures?: boolean;
  profile?: string;
  totalArea?: number;
  cultivatedArea?: number;
  methodOfIrrigationId?: number;
  distanceFromPlot?: number;
  plantingMethodId?: number;
  isActive?: boolean;
}

export interface IFarmerInPlotReportsViewDto {
  seasonId: number;
  season: string;
  farmerId: number;
  farmerCode: string;
  farmerName: string;
  fatherName: string;
  farmerVillageId: number;
  farmerVillageName: string;
  farmerDivisionName: string;
  farmerCircleName: string;
  farmerSectionName: string;
  reportedPlots: string;
  objReportedPlots?: IPlotReportViewDto[]
}

export interface IPlotReportViewDto {
  plotId: number;
  offerNo: number;
  plotNumber: number;
  plotReportId: number;
  plotVillageName: string;
  plotDivisionName: string;
  plotCircleName: string;
  plotSectionName: string;
  plantTypeId: number;
  plantType: string;
  plantSubTypeId: number;
  plantSubType: string;
  expectedPlantingDate: Date;
  surveyNo: string;
  demoPlotArea: number;
  reportedArea: number;
  plantingDate: Date;
  varietyId: number;
  variety: string;
  plotTypeId: number;
  plotType: string;
  cropTypeId: number;
  cropType: string;
  fieldName: string;
  birNumber: number;
  birDate: Date;
  seedMaterialUsedId: number;
  seedMaterialUsed: string;
  profile: string;
  totalArea: number;
  cultivatedArea: number;
  methodOfIrrigationId: number;
  methodOfIrrigation: string;
  distanceFromPlot: number;
  plantingMethodId: number;
  plantingMethod: string;
  soilTypeId: number;
  soilType: string;
  spacingId: number;
  spacing: string;
  isNeedHotWaterTreatment: boolean;
  isDustingApplied: boolean;
  isTrashMulchingDone: boolean;
  isPreviouslyRedPlot: boolean;
  isBasalFertilization: boolean;
  previousCropId: number;
  previousCrop: string;
  sourceOfIrrigationId: number;
  sourceOfIrrigation: string;
  isCompositeFormYard: boolean;
  isFilterPressMud: boolean;
  isGreenManures: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

export class CompletedPlotDto {
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
  completedPlotId?: number
  seasonId?: number
  docNo?: number
  docDate?: string
  plotAssessmentId?: number
  isCompleted?: boolean
  isLeftCultivation?: boolean
  isUsedForRatoon?: boolean
  isActive?: boolean

}
export class CompletedPlotViewDto {
  completedPlotId?: number
  seasonId?: number
  season?: string
  docNo?: number
  docDate?: string
  plotAssessmentId?: number
  farmerId?: number
  farmerName?: string
  farmerCode?: string
  plotNumber?: string
  estimatedTon?: number
  netArea?: number
  isCompleted?: boolean
  isLeftCultivation?: boolean
  isUsedForRatoon?: boolean
  isActive?: boolean
  createdAt?: string
  createdBy?: string
  updatedAt?: string
  updatedBy?: string
}



export class MaintenanceItems {
  diseases?: MaintDiseaseDto[]
  pests?: MaintPestDto[]

  fertilizers?: MaintFertilizerDto[]
  weedicides?: MaintWeedicideDto[]

}
export class MaintDiseaseDto {
  plotAssessmentId?: number
  plotAgreementId?: number
  plotYieldId?: number
  diseaseId?: number
  name?: string
  identifiedDate?: Date
  controlDate?: Date
  remarks?: string
  createdBy?: string
  updatedBy?: string
  createdAt?: Date
  updatedAt?: Date
}

export class MaintPestDto {
  plotAssessmentId?: number
  plotAgreementId?: number
  plotYieldId?: number
  pestId?: number
  name?: string
  identifiedDate?: Date
  controlDate?: Date
  remarks?: string
  createdBy?: string
  updatedBy?: string
  createdAt?: Date
  updatedAt?: Date
}



export class MaintWeedicideDto {
  plotAssessmentId?: number
  plotAgreementId?: number
  plotYieldId?: number
  weedicideId?: number
  name?: string
  selected?: boolean
  createdBy?: string
  updatedBy?: string
  createdAt?: Date
  updatedAt?: Date
}

export class MaintFertilizerDto {
  plotAssessmentId?: number
  plotAgreementId?: number
  plotYieldId?: number
  fertilizerId?: number
  name?: string
  selected?: boolean
  createdBy?: string
  updatedBy?: string
  createdAt?: Date
  updatedAt?: Date
}

export class PlotInfoDto {
  plotId?: number
  plotNumber?: string
}
export class PlotsDto {
  plotId?: number
  plotNumber?: string
  offerNo?: number
  farmerId?: number
  farmerCode?: string
  farmerName?: string
  fatherName?: string
  farmerCircle?: string
  farmerDivision?: string
  farmerSection?: string
  farmerDistrict?: string
  farmerMandal?: string
  farmerVillageId?: number
  farmerVillage?: string
  plotCircle?: string
  plotDivision?:string
  plotSection?: string
  plotDistrict?: string
  plotMandal?:string
  plotVillageId?: number
  plotVillage?: string
  reportedArea?: number
  fieldName?: string
  birNumber?: number
  birDate?: Date
  plantingDate?: Date
  varietyId?: number
  variety?: string
  surveyNo?: number
  plantTypeId?: number
  plantType?: string
  plotTypeId?: number
  plotType?: string
  agreedTon?: number
  cropType?:string
  Crop?:string
}





