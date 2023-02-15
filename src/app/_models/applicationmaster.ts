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
export class BankViewDto{
bankId?:number;
code?: string;
name?: string;
abbr?:string;
isActive: boolean = true;
updatedAt?: Date;
createdAt?: Date;
updatedBy?: string;
createdBy?: string;
}

export class BankDto{
  bankId?:number;
  code?: string;
  name?: string;
  abbr?:string;
  isActive: boolean = true;
  branches?:BranchesDto[];
}
export class BranchesDto{
  branchId?:number;
  bankId?:number;
  code?: string;
  name?: string;
  ifsc?: string;
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
  subHgls?: SubHgldto[]
}

export class SubHgldto {
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
  subHglId?: number
  hglid?: number
  code?: string
  name?: string
  vehicleTypeId?: number
  noOfPersons?: number
  isActive?: boolean
}