export class LookUpHeaderDto {
  id?: number
  code?: string;
  name?: string;
  isActive?: boolean;
  lookUpDetails?: LookupDetailDto[];
}
export class LookupDetailDto {
  id?: number;
  code?: string;
  name?: string;
  remarks?: string;
  listingorder?: number;
}
export class LookupViewDto{
  lookUpId?: number;
  code?: string;
  name?: string;
  isActive?: boolean;
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: string;
  createdBy?: string;
  lookUpDetails?: LookupDetailDto[] ;
}

export class planttypeViewDto{
 plantTypeId?: number;
 code?: string;
 name?: string;
 estimatedTon?:number;
 loanEligible?:number;
 isActive?: boolean;
 updatedAt?: Date;
 createdAt?: Date;
 updatedBy?: string;
 createdBy?: string;
}
export class plantTypeDto{
  plantTypeId?:number;
  code?: string;
  name?: string;
  estimatedTon?:number;
  loanEligible?:number;
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
  hglId: number | undefined;
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
  bankId?: number;
  code?: string;
  name?: string;
  abbr?: string
  isActive?: boolean;
  branches?: BranchDto[];
}

export class BankViewDto {
  bankId?: number;
  code?: string;
  name?: string;
  abbr?: string
  isActive?: boolean;
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
}
export class PlantSubTypeViewDto {
plantSubTypeId?: number;
plantId?:number;
plantName?:string;
code?: string;
name?: string;
isActive: boolean = true;
updatedAt?: Date;
createdAt?: Date;
updatedBy?: string;
createdBy?: string;
}
export class PlantSubTypeDto{
plantSubTypeId?: number;
plantId?:number;
code?: string;
name?: string;
isActive: boolean = true;
updatedAt?: Date;
createdAt?: Date;
updatedBy?: string;
createdBy?: string;
}

export class SeasonViewDto{
  seasonId?: number
  code?: string
  name?: string
  plantFrom?: Date
  plantTo?: Date
  crushFrom?: Date
  crushTo?: Date
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
  seasonId?: number
  code?:  string
  name?:  string
  plantFrom?:  Date
  plantTo?:  Date
  crushFrom?:  Date
  crushTo?:  Date
  burnCaneRate?:  number
  caneRate?:  number
  capacity?:  number
  currentSeason?:  string
  isActive?:  boolean
  seasonBillingRates?:  SeasonBillingRateDto[]
}

export class SeasonBillingRateDto{
  seasonBillingRateId?:  number
  seasonId?:  number
  billParameterId?:  number
  rate?:  number
  priority?:  number
  isActive?:  boolean
}


export class HglViewDto {
  subHglId(subHglId: any) {
    throw new Error('Method not implemented.');
  }
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
  hglId?: number
  code?: string
  name?: string
  gender?: string
  relationTypeId?: number
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
  accountNo?: string
  glcode?: string
  subGlcode?: string
  otherCode?: string
  isActive?: boolean
  subHgls?: SubHglDto[]
}

export class SubHglDto {
  subHglId?: number
  hglid?: number
  code?: string
  name?: string
  vehicleTypeId?: number
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

  sampleSlabId?: number
  fromArea?: number
  toArea?: number
  noOfSample?: number
  isActive?: boolean
  createdAt?: string
  createdBy?: string
  updatedAt?: string
  updatedBy?: string
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
