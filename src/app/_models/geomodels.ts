export interface DistrictViewDto {
  districtId: number;
  districtName: string;
  districtCode: string;
  stateId: number;
  stateName: string;
  isActive: boolean;
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


export interface DivisonsViewDto{
  divisionId: number,
  divisionCode: string,
  divisionName: string,
  inchargeName: string,
  inchargePhoneNo: string,
  address: string,
  listingOrder: number,
  isActive: boolean,
  createdBy: string,
  updatedBy: string,
  createAt: Date;
  updatedAt: Date,
}

export class DivisionDto{
  divisionId?: number;
  code?: string;
  name?: string;
  inchargeName?: string;
  inchargePhoneNo?: string;
  address?: string;
  listingOrder?: number;
  isActive?: boolean;
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
  isActive:boolean,
  updatedAt: Date,
  createdAt: Date,
  updatedBy: string,
  createdBy: string,

}

export class CircleDto{
  circleId?: number;
  code?: string;
  name?: string;
  divisionId?: number;
  inchargeName?: string;
  inchargePhoneNo?:  number;
  address?: string;
  listingOrder?: number;
  isActive?: boolean;

}

export interface MandalsViewDto {
  mandalId: number,
  mandalCode: string,
  mandalName: string,
  districtId: number,
  districtName: string,
  isActive: boolean,
  createdBy: string,
  updatedBy: string,
  createdAt: string,
  updatedAt: string,
}

export class MandalDto{
  mandalId?: number;
  code?: string;
  name?: string;
  districtId?: number;
  isActive?: boolean;
}

export interface SectionsViewDto {
  sectionId: number,
  code: any,
  name: any,
  circleId: number,
  circleName: string,
  divisionId: number,
  divisionName: string,
  inchargeName: string,
  inchargePhoneNo: string,
  address: string,
  listingOrder: number,
  isActive: boolean,
  updatedAt: string,
  createdAt: string,
  updatedBy: string,
  createdBy: string,
}


export class SectionDto {
  sectionId?: number;
  code?: string;
  name?: string;
  circleId?: number;
  inchargeName?: string;
  inchargePhoneNo?: string;
  address?: string;
  listingOrder?: number;
  isActive?: boolean;
}

export interface StatesViewDto {
  stateId: number,
  code: string,
  name: string,
  isActive: boolean,
  createdBy: string,
  createdAt: string,
  updatedBy: string,
  updatedAt: string,
}

export class StateDto {
  stateId?: number;
  code?: string;
  name?: string;
  isActive?: boolean;
}

