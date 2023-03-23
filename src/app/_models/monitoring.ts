export class PlotOfferDto {
  allottedPlotId?: number;
  seasonId?: number;
  offerNo?: number;
  offerDate?: Date;
  isNewFarmer?: boolean;
  farmerId?: number;
  villageId?: number;
  expectedArea?: number;
  plantTypeId?: number;
  plantingDate?: Date;
  varietyId?: number;
  reasonForNotPlantingId?: number;
  isActive?: boolean;
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
  ObjOfferedPlots:IFarmerPlotOffersViewDto[];
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
  plotOfferId: number;
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
  ObjOfferedPlots:IFarmerPlotOffersViewDto[];
}
export interface IFarmerPlotOffersViewDto{
  plotOfferId: number;
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

export class PlotAssessmentDto {
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  plotAssessmentId?: number;
  seasonId?: number;
  plotReportId?: number;
  assessedArea?: number;
  assessedDate?: Date;
  isAdemoPlot?: boolean;
  weedStatusId?: number;
  interCropId?: number;
  hasMicroNutrientDeficiency?: boolean;
  isTrashMulchingDone?: boolean;
  isGapsFillingDone?: boolean;
  earthingUpArea?: number;
  bioFertilizersAppliedArea?: number;
  deepPloughedArea?: number;
  deTrashingArea?: number;
  ratoonManagedUsedArea?: number;
  trashShedderArea?: number;
  loadShedderArea?: number;
  isAssessed?: boolean;
  isAgreemented?: boolean;
  agreementedDate?: Date;
  agreementedArea?: Date;
  isActive?: boolean;
  selfId?: number;
  plotAssessmentDiseases?: plotAssessmentDiseasesDto[];
  plotAssessmentFertilizers?: plotAssessmentFertilizersDto[];
  plotAssessmentPests?: plotAssessmentPestsDto[];
  plotAssessmentWeedicides?: plotAssessmentWeedicidesDto[];
}
export class plotAssessmentDiseasesDto {
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  plotAssessmentDiseaseId?: number;
  plotAssessmentId?: number;
  diseaseId?: number;
  identifiedDate?: Date;
  controlDate?: Date;
  remarks?: string;
  isAssessed?: boolean;
  isAgreemented?: boolean;
}

export class plotAssessmentFertilizersDto {
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  plotAssessmentFertilizerId?: number;
  plotAssessmentId?: number;
  fertilizerId?: number;
  isAssessed?: boolean;
  isAgreemented?: boolean;
}

export class plotAssessmentPestsDto {
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  plotAssessmentPestId?: number;
  plotAssessmentId?: number;
  pestId?: number;
  identifiedDate?: Date;
  controlDate?: Date;
  remarks?: string;
  isAssessed?: boolean;
  isAgreemented?: boolean;
}

export class plotAssessmentWeedicidesDto {
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  plotAssessmentWeedicideId?: number;
  plotAssessmentId?: number;
  weedicideId?: number;
  isAssessed?: boolean;
  isAgreemented?: boolean;
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

export interface IPlotReportViewDto {
  plotReportId?: number;
  seasonId: number;
  season?: string;
  cropTypeId?: number;
  cropType?: string;
  allottedPlotId?: number;
  offerNo?: number;
  farmerId?: number;
  farmerCode?: string;
  farmerName?: string;
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
  plotNumber?: string;
  surveyNo?: string;
  reportedArea?: number;
  plantingDate?: Date;
  plantSubTypeId?: number;
  plantSubType?: string;
  varietyId?: number;
  varietyName?: string;
  expectedVariety?: string;
  fieldName?: string;
  birNumber?: string;
  birDate?: Date;
  plotTypeId?: number;
  plotType?: string;
  demoPlotArea?: number;
  seedMaterialUsedId?: number;
  seedMaterialUsed?: string;
  soilTypeId?: number;
  soilType?: string;
  spacingId?: number;
  spacing?: string;
  isNeedHotWaterTreatment?: boolean;
  isDustingApplied?: boolean;
  isTrashMulchingDone?: boolean;
  isPreviouslyRedPlot?: boolean;
  isBasalFertilization?: boolean;
  previousCropId?: number;
  previousCrop?: string;
  sourceOfIrrigationId?: number;
  sourceOfIrrigation?: string;
  isCompositeFormYard?: boolean;
  isFilterPressMud?: boolean;
  isGreenManures?: boolean;
  profile?: string;
  cultivatedArea?: number;
  methodOfIrrigationId?: number;
  methodOfIrrigation?: string;
  distanceFromPlot?: number;
  plantingMethodId?: number;
  plantingMethod?: string;
  approvedAt?: Date;
  forApproval?: boolean;
  dataSyncedAt?: Date;
  isActive?: boolean;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}
export class CompletedPlotDto {
  createdBy?:  string
  createdAt?:  string
  updatedBy?:  string
  updatedAt?:  string
  completedPlotId?:  number
  seasonId?:  number
  docNo?:  number
  docDate?:  string
  plotAssessmentId?:  number
  isCompleted?:  boolean
  isLeftCultivation?:  boolean
  isUsedForRatoon?:  boolean
  isActive?:  boolean

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







