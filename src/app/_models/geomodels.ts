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

