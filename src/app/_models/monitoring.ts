export class AllottedPlotDto {
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
export interface IAllottedPlotViewDto {
  allottedPlotId: number;
  seasonId: number;
  seasonName: string;
  isNewFarmer: boolean;
  offerNo: number;
  offerDate: Date;
  farmerId: number;
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
