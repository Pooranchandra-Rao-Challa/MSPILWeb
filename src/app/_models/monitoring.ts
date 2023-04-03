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
export class IPlotOfferViewDto {
  plotOfferId?: number;
  seasonId?: number;
  seasonName?: string;
  isNewFarmer?: boolean;
  offerNo?: number;
  offerDate?: Date;
  farmerId?: number;
  farmerCode?: string;
  farmerName?: string;
  fatherName?: string;
  farmerVillageId?: number;
  farmerVillageName?: string;
  farmerDivisionName?: string;
  farmerCircleName?: string;
  farmerSectionName?: string;
  offeredPlots?: string;
  ObjOfferedPlots?: IFarmerPlotOffersViewDto[];
  plotVillageId?: number;
  plotVillageName?: string;
  plotDivisionName?: string;
  plotCircleName?: string;
  plotSectionName?: string;
  plantTypeId?: number;
  plantType?: string;
  varietyId?: number;
  expectedVariety?: string;
  plantingDate?: Date;
  expectedArea?: number;
  reasonForNotPlantingId?: number;
  reasonForNotPlanting?: string;
  forApproval?: boolean;
  approvedAt?: Date;
  dataSyncedAt?: Date;
  isActive?: boolean;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
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
  agreementedPlots: string;
  ObjOfferedPlots?: IFarmerPlotOffersViewDto[];
  ObjMeasuredPlots?: PlotAssessmentViewDto[];
  objAgreementedPlots: IAgreementedPlotsViewDto[];
}

export interface IFarmerPlotOffersViewDto {
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
  measuredDate?: Date;
  isaDemoPlot?: boolean;
  weedStatusId?: number;
  interCropingId?: number;
  hasMicroNutrientDeficiency?: boolean;
  isTrashMulchingDone?: boolean;
  isGapsFillingDone?: boolean;
  serverUpdatedStatus?: boolean;
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
  plotDiseaseId?: number;
  plotAssessmentId?: number;
  plotAgreementId?: number;
  plotYieldId?: number;
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
  plotFertilizerId?: number;
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
  plotPestId?: number;
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
  plotWeedicideId?: number;
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
  plotId?: any
  previousCropId?: number;
  previousCrop?: string;
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
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
  plotTransferId?: number
  plotId?: number
  plotAssessmentId?: number
  docNo?: number
  docDate?: string
  plotTransferTypeId?: number
  fromFarmerId?: number
  transferArea?: number
  toFarmerId?: number
  plotTransferReasonId?: number
  serverUpdatedStatus?: boolean
  transferredToPlotId?: number
  transferredToOfferId?: number
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
  plotId?: number;
  reportedArea?: number;
  plantSubTypeId?: number;
  varietyId?: number;
  fieldName?: string;
  birnumber?: string;
  birdate?: Date;
  surveyNo?: string;
  demoPlotArea?: number;
  seedMaterialUsedId?: number;
  dataSyncedAt?: string;
  remarks?: string;
  serverUpdatedStatus?: boolean;
  profile?: string;
  totalArea?: number;
  cultivatedArea?: number;
  methodOfIrrigationId?: number;
  distanceFromPlot?: number;
  plantingMethodId?: number;
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
  plotOfferId: number;
  offerNo: number;
  plotNumber: number;
  plotReportId: number;
  plotReportAddlInfoId: number;
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
  plantingDate?: Date;
  varietyId: number;
  variety: string;
  plotTypeId: number;
  plotType: string;
  cropTypeId: number;
  cropType: string;
  fieldName: string;
  birNumber: number;
  birDate?: Date;
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
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface IPlotOfferInfoViewDto {
  plotOfferId: number;
  offerNo: number;
  farmerName: string;
  farmerCode: string;
  frmerCircle: string;
  armerDivision: string;
  armerSection: string;
  armerDistrict: string;
  armerMandal: string;
  armerVillage: string;
  lotVillage: string;
  lotCircle: string;
  lotDistrict: string;
  lotDivision: string;
  lotSection: string;
  lotMandal: string;
  plantTypeId: number;
  plantType: string;
  expectedVarietyId: number;
  expectedVariety: string;
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
  plotDivision?: string
  plotSection?: string
  plotDistrict?: string
  plotMandal?: string
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
  cropType?: string
  Crop?: string
  measuredArea?: number
  agreementedArea?: number
}
export class FarmerSelectInfoViewDto {
  userId?: number
  name?: string
  id?: number
  title?: string
  completed?: boolean
  fromFarmerName?: string
  toFarmerName?: string
}
export class GetFarmersInSeasonViewDto {
  farmerCode?: number
  farmerName?: string
  plotId?: number
  plotNumber?: string
  netArea?: boolean
  seasonsId?: number
}

export class PlotAgreementDto {
  plotAgreementId?: number;
  plotId?: number;
  earthingUpArea?: number;
  bioFertilizersAppliedArea?: number;
  deepPloughedArea?: number;
  deTrashingArea?: number;
  ratoonManagedUsedArea?: number;
  trashShedderArea?: number;
  loadShedderArea?: number;
  weedStatusId?: number;
  interCropingId?: number;
  hasMicroNutrientDeficiency?: boolean;
  isTrashMulchingDone?: boolean;
  isGapsFillingDone?: boolean;
  serverUpdatedStatus?: boolean;
  agreementedArea?: number;
  nomineeDetails?: NomineeDetailsDto;
  diseases?: plotDiseasesDto[];
  fertilizers?: plotFertilizersDto[];
  pests?: plotPestsDto[];
  weedicides?: plotWeedicidesDto[];
}

export class NomineeDetailsDto {
  nomineeDetailId?: number;
  plotAgreementId?: number;
  relationTypeId?: number;
  nominee?: string;
  guarantor1?: string;
  guarantor2?: string;
  guarantor3?: string;;
  serverUpdatedStatus?: boolean;

}

export interface IAgreementedPlotsViewDto {
  plotId: number;
  offerNo: number;
  plotNumber: number;
  plotReportId: number;
  plotAgreementId: number;
  plotVillageName: string;
  plotDivisionName: string;
  plotCircleName: string;
  plotSectionName: string;
  surveyNo: string;
  reportedArea: string;
  plantingDate: Date;
  variety: string;
  plantType: string;
  plotType: string;
  weedStatusId: number;
  weedStatus: string;
  interCropingId: number;
  interCrop: string;
  crop: string;
  fieldName: string;
  birNumber: number;
  birDate: Date;
  agreementedArea: number;
  agreementedDate: Date;
  earthingUpArea: number;
  bioFertilizersAppliedArea: number;
  deepPloughedArea: number;
  deTrashingArea: number;
  ratoonManagedUsedArea: number;
  trashShedderArea: number;
  loadShedderArea: number;
  hasMicroNutrientDeficiency: boolean;
  isTrashMulchingDone: boolean;
  isGapsFillingDone: boolean;
  nomineeId: number;
  relationTypeId: number;
  relationType: string;
  nominee: string;
  guarantor1: string;
  guarantor2: string;
  guarantor3: string;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}
export class FarmerSectionViewDto {
  farmerId?: number
  farmerCode?: string
  farmerName?: string

}
export class FarmerPlotYieldViewDto {
  seasonId?: number;
  season?: Date;
  farmerId?: number;
  farmerCode?: string;
  farmerName?: string;
  fatherName?: string;
  farmerVillageId?: number;
  farmerVillageName?: string;
  farmerDivisionName?: string;
  farmerCircleName?: string;
  farmerSectionName?: string;
  netYieldPlots!: string;
  objnetYieldPlots?: PlotYieldViewDto[];
}
export class PlotYieldViewDto {
  offerNo?: number;
  plotNumber?: number;
  plotYieldId?: number;
  plotVillageName?:number;
  plotDivisionName?: string;
  plotCircleName?: string;
  plotSectionName?: string;
  reportedArea?: string;
  plantingDate?: string;
  variety?: string;
  plantType?: string;
  cropType?: string;
  birNumber?: number;
  birDate?: Date;
  surveyNo?: number;
  measuredArea?: number;
  agreementedArea?: number;
  estimatedTon?: number;
  perishedArea?: number;
  netArea?: number;
  hasMicroNutrientDeficiency?: boolean;
  isTrashMulchingDone?: boolean;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}
export class SampleDto {
  DocNo?: string;
  DocDate?: Date;
  FieldBrix?: number;
  Pol?: number;
  CreatedAt?: Date;
  CreatedBy?: string;
  UpdatedAt?: Date;
  UpdatedBy?: string;
  SeasonId?: number;
  PlotYieldId?: number;
  PlotNo?: number;
  FarmerCode?: number;
}

export interface plotsofFarmerViewDto {
  plotId: number
  seasonId: number
  farmerId: number
  plotNumber: string
  netArea: number
}
