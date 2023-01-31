export interface DistrictViewDto {
  districtId: number;
  districtName: string;
  districtCode: string;
  stateId: string;
  stateName: string;
  updatedAt: Date;
  createdAt: Date;
  updatedBy: string;
  createdBy: string;
}
export interface CirclesViewDto {
  circleId: number,
  circleCode: string,
  circleName: string,
  divisionId: number,
  divisionName: string,
  inchargeName: string,
  inchargePhoneNo: number,
  address: string,
  listingOrder: number,
  isActive:string,
  updatedAt: Date,
  createdAt: Date,
  updatedBy: string,
  createdBy: string,
  
}

export class DistrictDto {
  districtId?: number;
  code?: string;
  name?: string;
  isActive?: boolean = true;
  stateId?: number;
}

export class StateDto {
  stateId?: number;
  code?: string;
  name?: string;
  isActive?: boolean;
}

