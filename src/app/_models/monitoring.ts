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
  farmerCode:string;
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
