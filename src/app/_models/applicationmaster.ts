export class LookUpHeaderDto {
  id?: number
  code?: string;
  name?: string;
  isActive?: boolean;
  lookUpDetails?: LookupDetailDto[];
  LookupDetailDto: any;
}
export class LookupDetailDto {
  id?: number;
  code?: string;
  name?: string;
  remarks?: string;
  listingorder?: number;
}

export class LookupViewDto {
  id?: number;
  code?: string;
  name?: string;
  isActive?: boolean;
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: string;
  createdBy?: string;
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
  transporterFreeze?: boolean;
  gateEntryFreeze?: boolean;
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
