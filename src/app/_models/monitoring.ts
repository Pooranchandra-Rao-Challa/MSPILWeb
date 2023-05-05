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
  string?: string;
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
  varietyName?: string;
  varietyId?: number;
  expectedVarietyId?: number;
  expectedVarietyName?: string;
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
  expanded: boolean;
  offerNo: number;
  offerDate: Date;
  isNewFarmer: boolean;
  seasonId: number;
  seasonName: string;
  seasonCode: string;
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
  ObjMeasuredPlots?: IPlotAssessmentViewDto[];
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
  plantTypeName: string;
  expectedVarietyId: number;
  expectedVarietyName: string;
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

export interface IPlotAssessmentViewDto {
  plotAssessmentId: number;
  seasonId: number;
  seasonName: string;
  plotReportId: number;
  plotNumber: string;
  plotId: any
  previousCropId: number;
  previousCrop: string;
  cropTypeId: number;
  cropType: string;
  allottedPlotId: number;
  offerNo: number;
  farmerId: number;
  farmerCode: string;
  farmerName: string;
  fatherName: string;
  farmerVillageId: number;
  farmerVillageName: string;
  farmerDivisionName: string;
  farmerCircleName: string;
  farmerSectionName: string;
  plotVillageId: number;
  plotVillageName: string;
  plotDivisionName: string;
  plotCircleName: string;
  plotSectionName: string;
  plantTypeId: number;
  plantType: string;
  surveyNo: number;
  reportedArea: number;
  plantingDate: Date;
  varietyId: number;
  varietyName: string;
  fieldName: string;
  birNumber: number;
  birDate: Date;
  plotTypeId: number;
  plotType: string;
  assessedArea: number;
  measuredDate: Date;
  isADemoPlot: boolean;
  weedStatusId: number;
  weedStatus: string;
  interCropId: number;
  interCrop: string;
  hasMicroNutrientDeficiency: boolean;
  isTrashMulchingDone: boolean;
  isGapsFillingDone: boolean;
  isActive: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
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


export interface IPlotTransferViewDto {
  plotTransferId: number;
  seasonId: number;
  seasonName: string;
  seasonCode: string;
  plotId: number;
  docNo: number;
  docDate: Date;
  plotTransferTypeId: number;
  plotTransferTypeName: string;
  fromFarmerId: number;
  fromFarmerCode: number;
  fromFarmerName: string;
  plotNumber: number;
  transferArea: number;
  toFarmerId: number;
  toFarmerCode: number;
  toFarmerName: string;
  plotTransferReasonId: number;
  plotTransferReasonName: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
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
  seasonName: string;
  seasonCode: string;
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
export interface ICompletedPlotViewDto {
  plotId: number;
  seasonId: number;
  seasonName: string;
  seasonCode: string;
  farmerId: number;
  farmerCode: string;
  farmerName: string;
  plotNumber: string;
  estimatedTon: number;
  excessTonage: number;
  suppliedTon: number;
  weightmentDate: Date;
  netArea: number;
  status: string;
}

export class MaintenanceItems {
  diseases?: MaintDiseaseDto[]
  pests?: MaintPestDto[]
  fertilizers?: MaintFertilizerDto[]
  weedicides?: MaintWeedicideDto[]

}
export class MaintDiseaseDto {
  plotDiseaseId?: number;
  plotAssessmentId?: number
  plotAgreementId?: number
  plotYieldId?: number
  diseaseId?: number
  diseaseName?: string
  identifiedDate?: Date
  controlDate?: Date
  remarks?: string
  createdBy?: string
  updatedBy?: string
  createdAt?: Date
  updatedAt?: Date

}


export class MaintPestDto {
  plotPestId?: number;
  plotAssessmentId?: number
  plotAgreementId?: number
  plotYieldId?: number
  pestId?: number
  pestName?: string
  identifiedDate?: Date
  controlDate?: Date
  remarks?: string
  createdBy?: string
  updatedBy?: string
  createdAt?: Date
  updatedAt?: Date
}

export class MaintWeedicideDto {
  plotWeedicideId?: number;
  plotAssessmentId?: number
  plotAgreementId?: number
  plotYieldId?: number
  weedicideId?: number
  weedicideName?: string
  selected?: boolean
  createdBy?: string
  updatedBy?: string
  createdAt?: Date
  updatedAt?: Date
}

export class MaintFertilizerDto {
  plotFertilizerId?: number;
  plotAssessmentId?: number
  plotAgreementId?: number
  plotYieldId?: number
  fertilizerId?: number
  fertilizerName?: string
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
  farmerVillageName?: string
  farmerCircleName?: string
  farmerDivisionName?: string
  farmerSectionName?: string
  farmerDistrictName?: string
  farmerMandalName?: string
  farmerVillageId?: number
  plotVillageName?: string
  plotCircleName?: string
  plotDivisionName?: string
  plotSectionName?: string
  plotDistrictName?: string
  plotMandalName?: string
  plotVillageId?: number
  plotVillage?: string
  reportedArea?: number
  fieldName?: string
  birNumber?: number
  birDate?: Date
  plantingDate?: Date
  varietyId?: number
  varietyName?: string
  surveyNo?: number
  plantTypeId?: number
  plantTypeName?: string
  plotTypeId?: number
  plotTypeName?: string
  agreedTon?: number
  cropTypeName?: string
  cropName?: string
  measuredArea?: number
  agreementedArea?: number
  measuredDate?: Date;
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
  varietyName: string;
  plantTypeName: string;
  plotTypeName: string;
  weedStatusId: number;
  weedStatusName: string;
  interCropingId: number;
  interCropName: string;
  cropName: string;
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

export interface IFarmerPlotYieldViewDto {
  seasonId: number;
  SeasonName: string;
  seasonCode: string;
  farmerId: number;
  farmerCode: string;
  farmerName: string;
  fatherName: string;
  farmerVillageId: number;
  farmerVillageName: string;
  farmerDivisionName: string;
  farmerCircleName: string;
  farmerSectionName: string;
  netYieldPlots: string;
  objNetYieldPlots?: IPlotYieldViewDto[];
}

export interface IPlotYieldViewDto {
  plotId: number;
  offerNo: number;
  plotNumber: number;
  plotYieldId: number;
  plotVillageName: number;
  plotDivisionName: string;
  plotCircleName: string;
  plotSectionName: string;
  reportedArea: string;
  plantingDate: string;
  variety: string;
  plantType: string;
  plotType: string;
  weedStatusId: number;
  weedStatus: string;
  interCropingId: number;
  interCrop: string;
  crop: string;
  cropType: string;
  fieldName: string;
  birNumber: number;
  birDate: Date;
  surveyNo: number;
  measuredArea: number;
  agreementedArea: number;
  estimatedTon: number;
  inspectionDate: Date;
  poorCropArea: number;
  harvestArea: number;
  perishedArea: number;
  notGrownArea: number;
  actionPlanId: number;
  actionPlan: string;
  reasonForPerishedAreaId: number;
  reasonForPerishedArea: number;
  divertedArea: number;
  isSeedArea: number;
  netArea: number;
  hasMicroNutrientDeficiency: boolean;
  isTrashMulchingDone: boolean;
  isGapFillingDone: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

export class SampleDto {
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
  sampleId?: number
  plotId?: number
  docNo?: number
  docDate?: string
  plotYieldI?: number
  fieldBrix?: number
  brix?: number
  pol?: number
  serverUpdatedStatus?: boolean
}

export interface IPlotsofFarmerViewDto {
  plotId: number;
  seasonId: number;
  farmerId: number;
  plotNumber: string;
  netArea: number;
  estimatedTon: number;
  excessTonage: number;
  suppliedTon: number;
  weightmentDate: Date;
  villageId: number;
  villageName: string;
}

export class SampleDetailsDto {
  sampleId?: number;
  seasonId?: number
  season?: string;
  seasonCode?: string;
  docNo?: number
  docDate?: string
  plotId?: number
  farmerId?: number
  farmerCode?: string
  farmerName?: string
  plotNumber?: number
  fieldBrix?: number
  brix?: number
  pol?: number
  createdAt?: string
  createdBy?: string
  updatedAt?: string
  updatedBy?: string
}

export interface ISampleDetailsViewDto {
  sampleId: number;
  sampleNo: number;
  plotId: number;
  noOfSample: number;
  seasonId: number;
  seasonCode: string;
  docNo: number;
  docDate: Date;
  farmerId: number;
  farmerCode: string;
  farmerName: string;
  fieldBrix: number;
  brix: number;
  pol: number;
  cCS: number;
  purity: number;
  canAddSample: boolean;
  canEditSample: boolean;
  canNotDoEditOrAdd: boolean;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
}

export class PlotYieldDto {
  plotYieldId?: number;
  plotId?: number;
  estimatedTon?: number;
  actionPlanId?: number;
  inspectionDate?: Date;
  poorCropArea?: number;
  harvestArea?: number;
  perishedArea?: number;
  reasonForPerishedAreaId?: number;
  divertedArea?: number;
  isSeedArea?: boolean;
  netArea?: boolean;
  notGrownArea?: boolean;
  interCropingId?: number;
  weedStatusId?: number;
  hasMicroNutrientDeficiency?: boolean;
  isTrashMulchingDone?: boolean;
  isGapFillingDone?: boolean;
  serverUpdatedStatus?: boolean;
  diseases?: plotDiseasesDto[];
  fertilizers?: plotFertilizersDto[];
  pests?: plotPestsDto[];
  weedicides?: plotWeedicidesDto[];
}
export interface IProppingViewDto {
  plotId: number;
  plotNumber: string;
  farmerCode: string;
  farmerName: string;
  divisionName: string;
  circleName: string;
  sectionName: string;
  villageName: string;
  varietyName: string;
  plantTypeName: string;
  plantingDate: Date;
  netArea: number;
  proppingDate: Date;
}
export class ProppingDto {
  plotProppingId?: number;
  plotId?: number;
  proppingStageId?: number;
  proppingDate?: Date;
}

export class SeedDto {
  seedId?: number;
  seasonCode?: string;
  plotId?: number;
  docNo?: number;
  docDate?: Date;
  seedSupplyTypeId?: number;
  typeOfSeedId?: number;
  subSeeds?: SeedDetailDto[];
}

export class SeedDetailDto {
  seedDetailId?: number;
  seedId?: number
  farmerCode?: number;
  farmerName?: string;
  uom?: string;
  qty?: number;
  rate?: number;
  amount?: number;
}

export interface SeedViewDto {
  seedId?: number;
  seasonId?: number;
  season?: string;
  docNo?: number;
  docDate?: Date;
  plotId?: number;
  plotNumber?: string;
  farmerId?: number;
  farmerCode?: string;
  farmerName?: string;
  seedSupplyTypeId?: number;
  seedSupplyType?: string;
  typeOfSeedId?: number;
  typeOfSeed?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}
