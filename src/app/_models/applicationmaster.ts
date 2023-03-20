import { BillParameterViewDto } from "./billingmaster";

export class LookUpHeaderDto {
  lookUpId!: number;
  lookupDetailId?: number;
  code?: string;
  name?: string;
  isActive?: boolean;
  lookUpDetails?: LookupDetailDto[];
}

export class LookupViewDto {
  id!: number;
  lookupDetailId?: number;
  code?: string;
  name?: string;
  isActive?: boolean;
  lookupDetails?: LookupDetailDto[];
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: string;
  createdBy?: string;
}

export class LookupDetailDto {
  lookupDetailId?:number;
  code?: string;
  name?: string;
  lookupId?: number;
  remarks?: string;
  lookupName?: string;
  listingorder?: number;
  isActive?: boolean;
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: string;
  createdBy?: string;
  billParams: BillParameterViewDto[] =[];
}
export class LookupDetailViewDto {
  lookupId?: number;
  lookupDetailId?:number;
  code?: string;
  name?: string;
  remarks?: string;
  isActive?: boolean;
  listingorder?: number;
  lookupDetails?: LookupDetailDto[];
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: string;
  createdBy?: string;
  // lookupName?: string;
}
export class plantTypeViewDto {
  plantTypeId?: number;
  code?: string;
  name?: string;
  estimatedTon?: number;
  loanEligible?: number;
  isActive?: boolean;
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: string;
  createdBy?: string;
}
export class plantTypeDto {
  plantTypeId?: number;
  code?: string;
  name?: string;
  estimatedTon?: number;
  loanEligible?: number;
  isActive?: boolean;
}
export class VarietyDto {
  varietyId?: number;
  code?: string;
  name?: string;
  varietyTypeId?: number;
  plantAge?: number;
  ratoonAge?: number;
  sugarContent?: string;
  plantSuitability?: string;
  isActive: boolean = true;
}

export class VarietyViewDto {
  varietyId?: number;
  code?: string;
  name?: string;
  varietyTypeId?: number;
  varietyName?: string;
  plantAge?: number;
  ratoonAge?: number;
  sugarContent?: string;
  plantSuitability?: string;
  isActive: boolean = true;
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: string;
  createdBy?: string;
}

export class VehicleTypeDto {
  vehicleTypeId?: number;
  code?: string;
  name?: string;
  capacity?: number;
  billingCapacity?: number;
  bindingCane?: number;
  badCane?: number;
  isActive?: boolean;
}

export class VehicleTypeViewDto {
  vehicleTypeId?: number;
  code?: string;
  name?: string;
  capacity?: number;
  billingCapacity?: number;
  bindingCane?: number;
  badCane?: number;
  isActive?: boolean;
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: string;
  createdBy?: string;
}

export class TptDto {
  tptId!: number;
  code?: string;
  name?: string;
  gender?: string;
  relationTypeId?: number;
  relationName?: string;
  address?: string;
  pinCode?: string;
  phoneNo?: string;
  email?: string;
  panNo?: string;
  tax?: number;
  tds?: boolean;
  guarantor1?: string;
  guarantor2?: string;
  guarantor3?: string;
  bankId?: number;
  branchId?: number;
  accountNo?: string;
  glCode?: string;
  subGlcode?: string;
  otherCode?: string;
  isActive?: boolean;
  tptdetails?: TptdetailDto[]
}

export class TptdetailDto {
  id?: number;
  tptId?: number;
  vehicleNo?: string;
  vehicleTypeId?: number;
  insuranceNo?: string;
  receivableAmt?: number;
  receivedAmt?: number;
  transporterFreeze?: boolean;
  gateEntryFreeze?: boolean;
  isActive?: boolean;
}

export class TptViewDto {
  tptId!: number;
  code?: string;
  name?: string;
  gender?: string;
  relationTypeId?: number;
  relationType?: string;
  relationName?: string;
  address?: string;
  pinCode?: string;
  phoneNo?: string;
  email?: string;
  panNo?: string;
  tax?: number;
  tds?: boolean;
  guarantor1?: string;
  guarantor2?: string;
  guarantor3?: string;
  ifsc?: string;
  bankName?: string;
  bankId?: number;
  branchId?: number;
  branchName?: string;
  accountNo?: string;
  glCode?: string;
  subGLCode?: string;
  otherCode?: string;
  isActive?: boolean;
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: string;
  createdBy?: string;
}

export class TptdetailViewDto {
  tptdetailId?: number;
  tptId?: number;
  tPTName?: string;
  vehicleNo?: string
  vehicleTypeId?: number;
  vehicleName?: string;
  insuranceNo?: string;
  receivableAmt?: number;
  receivedAmt?: number;
  transporterFreeze: boolean = true;
  gateEntryFreeze: boolean = true;
  isActive: boolean = true;
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: string;
  createdBy?: string;
}


export class BankDto {
  bankId!: number;
  branchId?: number;
  code?: string;
  name?: string;
  abbr?: string;
  isActive?: boolean;
  branches?: BranchDto[];
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: string;
  createdBy?: string;
}

export class BankViewDto {
  bankId!: number;
  branchId?: number;
  code?: string;
  name?: string;
  abbr?: string
  isActive?: boolean;
  branches?: BranchDto[];
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: string;
  createdBy?: string;
}
export class BranchDto {
  branchId?: number;
  bankId?: number;
  code?: string;
  name?: string;
  abbr?: string
  address?: string;
  pinCode?: string;
  phoneNo?: string;
  email?: string;
  ifsc?: string;
  isActive?: boolean;
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: string;
  createdBy?: string;
}


export class BranchViewDto {
  branchId?: number;
  bankId?: number;
  code?: string;
  name?: string;
  abbr?: string
  address?: string;
  pinCode?: string;
  phoneNo?: string;
  email?: string;
  ifsc?: string;
  isActive?: boolean;
  branches?: BranchDto[];
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: string;
  createdBy?: string;
}


export class PlantSubTypeViewDto {
  plantSubTypeId?: number;
  plantTypeId?: number;
  plantName?: string;
  code?: string;
  name?: string;
  isActive: boolean = true;
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: string;
  createdBy?: string;
}
export class PlantSubTypeDto {
  plantSubTypeId?: number;
  plantTypeId?: number;
  code?: string;
  name?: string;
  isActive: boolean = true;
}

export class SeasonViewDto{
  seasonId?: number
  code?: string
  name?: string
  plantFrom?: any
  plantTo?: any
  crushFrom?: any
  crushTo?: any
  burnCaneRate?: number
  caneRate?: number
  capacity?: number
  currentSeason?: any
  isActive?: boolean
  updatedAt?: string
  createdAt?: string
  updatedBy?: string
  createdBy?: string
}

export class SeasonDto {
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
  seasonId?: number
  code?: string
  name?: string
  plantFrom?: string
  plantTo?: string
  crushFrom?: string
  crushTo?: string
  burnCaneRate?: number
  caneRate?: number
  capacity?: number
  currentSeason?: string
  isActive?: boolean
  farmerRates?: FarmerRate[]
  transporterRates?: TransporterRate[]
  seedRates?: SeedRate[]
  harvestorRates?: HarvestorRate[]
}

export interface FarmerRate {
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
  seasonBillingRateId?: number
  seasonId?: number
  billParameterId?: number
  rate?: number
  priority?: number
  isActive?: boolean
}

export interface TransporterRate {
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
  seasonBillingRateId?: number
  seasonId?: number
  billParameterId?: number
  rate?: number
  priority?: number
  isActive?: boolean
}

export interface SeedRate {
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
  seasonBillingRateId?: number
  seasonId?: number
  billParameterId?: number
  rate?: number
  priority?: number
  isActive?: boolean
}

export interface HarvestorRate {
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
  seasonBillingRateId?: number
  seasonId?: number
  billParameterId?: number
  rate?: number
  priority?: number
  isActive?: boolean
}


export class SeasonBillingRateViewDto {
  seasonBillingRateId?: number
  seasonId?: number
  seasonName?: string
  billParameterId?: number
  billParameterName?: string
  billCategoryId?:number
  billCategoryName?:string
  rate?: number
  priority?: number
  isActive?: boolean
  updatedAt?: string
  createdAt?: string
  updatedBy?: string
  createdBy?: string
  lookupDetailId: any;
}



export class HglViewDto {

  hglId?: number
  code?: string
  name?: string
  gender?: string
  relationTypeId?: number
  relationType?: string
  relationName?: string
  address?: string
  pinCode?: string
  phoneNo?: string
  email?: string
  panNo?: string
  aadhaarNo?: string
  tax?: number
  tds?: boolean
  guarantor1?: string
  guarantor2?: string
  guarantor3?: string
  branchId?: number
  bankId?:number
  branchName?: string
  bankName?: string
  ifsc?: string
  accountNo?: string
  glCode?: string
  subGLCode?: string
  otherCode?: string
  isActive?: boolean
  createdAt?: string
  createdBy?: string
  updatedAt?: string
  updatedBy?: string
}


export class HglDto {
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
  hglId?: number;
  code?: string;
  name?: string;
  gender?: string;
  relationTypeId?: number;
  relationName?: string;
  address?: string;
  pinCode?: string;
  phoneNo?: string;
  email?: string;
  panNo?: string;
  aadhaarNo?: string;
  tax?: number;
  tds?: boolean;
  guarantor1?: string;
  guarantor2?: string;
  guarantor3?: string;
  branchId?: number;
  bankId?: number;
  accountNo?: string;
  glcode?: string;
  subGlcode?: string;
  otherCode?: string;
  isActive?: boolean;
  subHgls?: SubHglDto[];

}

export class SubHglDto {
  subHglId?: number
  hglid?: number
  code?: string
  name?: string
  vehicleTypeId?: number
  // vehicleName?: string
  noOfPersons?: number
  isActive?: boolean
}

export class SubHglViewDto {
  subHglId?: number
  hglId?: number
  code?: string
  name?: string
  vehicleTypeId?: number
  vehicleName?: string
  noOfPersons?: number
  isActive?: boolean
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
}


export class ShiftsViewDto{

    shiftId?: number
    code?: string
    name?: string
    fromTime?: string
    toTime?: string
    isNextDay?: boolean
    isActive?: boolean
    createdAt?: string
    createdBy?: string
    updatedAt?: string
    updatedBy?: string
}

export class ShiftDto {
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
  shiftId?: number
  code?: string
  name?: string
  fromTime?: string
  toTime?: string
  strFromTime?:any
  strToTime?:any
  isNextDay?: boolean
  isActive?: boolean
}

export class FromTime {
  ticks?: number
  days?: number
  hours?: number
  milliseconds?: number
  minutes?: number
  seconds?: number
}

export class ToTime {
  ticks?: number
  days?: number
  hours?: number
  milliseconds?: number
  minutes?: number
  seconds?: number
}

export class SampleslabsViewDto{
  
  sampleSlabId?: number;
  fromArea?: number;
  toArea?: number;
  noOfSample?: number;
  isActive?: boolean;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}



export class FarmersViewDto{
  farmerId?: number;
  code?: string;
  farmerName?: string;
  aliasName?: string;
  gender?: string;
  fatherName?: string;
  casteId?: number;
  caste?: string;
  address?: string;
  circleId?: number;
  circleName?: string;
  divisionId?: number;
  divisionName?: string;
  sectionId?: number;
  sectionName?: string;
  districtId?: number;
  districtName?: string;
  mandalId?: number;
  mandalName?: string;
  villageId?: number;
  villageName?: string;
  pinCode?: string;
  phoneNo?: string;
  email?: string;
  panNo?: string;
  aadharNo?: any;
  oldRyot?: string;
  jfNo?: string;
  bankId?: number;
  bankName?: string;
  branchId?: number;
  branchName?: string;
  ifsc?: string;
  accountNo?: string;
  totalArea?: number;
  cultivatedArea?: number;
  glCode?: string;
  subGLCode?: string;
  otherCode?: string;
  imageUrl?: string;
  isRegistered?: boolean;
  isActive?: boolean;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export class FarmerDto{
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  farmerId?: number;
  code?: string;
  name?: string;
  aliasName?: string;
  gender?: string;
  fatherName?: string;
  casteId?: number;
  address?: string;
  villageId?: number;
  phoneNo?: string;
  email?: string;
  panno?: string;
  aadhaarNo?: string;
  oldRyot?: string;
  selfId?: number;
  jfno?: string;
  branchId?: number;
  accountNo?: string;
  totalArea?: number;
  cultivatedArea?: number;
  glcode?: string;
  subGlcode?: string;
  otherCode?: string;
  imageUrl?: string;
  isRegistered?: boolean;
  isActive?: boolean;
}
export class SampleSlabDto {
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
  sampleSlabId?: number
  fromArea?: number
  toArea?: number
  noOfSample?: number
  isActive?: boolean
}
