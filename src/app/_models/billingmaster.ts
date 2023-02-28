
export class BillDto {
  billId?: number;
  billNo?: number;
  categoryId?: number;
  seasonsId?: number;
  runDate?: Date;
  fromDate?: Date;
  toDate?: Date;
  isFinal: boolean = true;
  isActive: boolean = true;
}

export class BillViewDto {
  billId?: number;
  billNo?: number;
  billCategoryId?: number;
  billCategoryName?: string;
  seasonsId?: number;
  seasonName?: string;
  runDate?: Date;
  fromDate?: Date;
  toDate?: Date;
  isFinal: boolean = true;
  isActive: boolean = true;
  isConfirmed?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: Date;
  updatedBy?: Date;
}

export class BillParameterDto {
  billParameterId?: number;
  code?: string;
  categoryId?: number;
  name?: string;
  type?: string;
  priority?: number;
  caluclationType?: string;
  formula?: string;
  isActive?: boolean;
}

export class BillParameterViewDto {
  billParamId?: number;
  code?: string;
  billCategoryId?: number;
  billCategoryName?: string;
  name?: string;
  type?: string;
  priority?: number;
  caluclationType?: string;
  formula?: string;
  isActive?: boolean;
  updatedAt?: Date;
  createdAt?: Date;
  updatedByUser?: string;
  createdByUser?: string;
}

export class DieselBunkDto {
  id?: number;
  code?: string;
  name?: string;
  rate?: number;
  pinCode?: string;
  phoneNo?: string;
  email?: string;
  gLcode?: string;
  subGLcode?: string;
  address?: string;
  isActive: boolean = true;
}

export class DieselBunkViewDto {
  id?: number;
  code?: string;
  name?: string;
  rate?: number;
  pinCode?: string;
  phoneNo?: string;
  email?: string;
  glCode?: string;
  subGLCode?: string;
  address?: string;
  isActive: boolean = true;
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: string;
  createdBy?: string;
}

export class DieselRateDto {
  id?: number;
  fromDate?: Date;
  toDate?: Date;
  rate?: number;
  isActive: boolean = true;
}

export class DieselRateViewDto {
  id?: number;
  fromDate?: Date;
  toDate?: Date;
  rate?: number;
  isActive: boolean = true;
  updatedAt?: Date;
  createdAt?: Date;
  updatedByUser?: string;
  createdByUser?: string;
}

export class DistanceRateDto {
  id?: number;
  distance?: number;
  rate?: number;
  isActive?: boolean
}

export class DistanceRateViewDto {
  id?: number;
  distance?: number;
  rate?: number;
  isActive: boolean = true;
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: string;
  createdBy?: string;
}

export class VillageParamRateDto {
  id?: number;
  seasonsId?: number;
  villageId?: number;
  villageName?: string;
  billParameterId?: number;
  rate?: number;
  isActive: boolean = true;
}

export class VillageParamRateViewDto {
  id?: number;
  seasonsId?: number;
  seasonName?: string;
  villageId?: number;
  villageName?: string;
  sectionName?: string;
  circleName?: string;
  divisionName?: string;
  billParameterId?: number;
  billParameterName?: string;
  rate?: number;
  isActive?: boolean
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: string;
  createdBy?: string;
}

export class WareHouseViewDto {
  id?: number
  code?: string
  name?: string
  glcode?: string
  subGlcode?: string
  isActive?: boolean
  updatedAt?: string
  createdAt?: string
  updatedByUser?: string
  createdByUser?: string
  warehouseId: any;
}

export class WareHouseDto {
  id?: number
  code?: string
  name?: string
  glcode?: string
  subGlcode?: string
  isActive?: boolean

}

export class LoanTypeViewDto {
  loanTypeId?: number
  code?: string
  categoryId?: number
  categoryName?: string
  name?: string
  interestRate?: number
  priority?: number
  glCode?: string
  subGLcode?: string
  isActive?: boolean
  createdAt?: string
  createdBy?: string
  updatedAt?: string
  updatedBy?: string
}
export class LoanTypeDto {
  loanTypeId?: number
  code?: string
  categoryId?: number
  name?: string
  interestRate?: number
  priority?: number
  glcode?: string
  subGlcode?: string
  isActive?: boolean
  loanSubTypes?: LoanSubTypeDto[]
}

export class LoanSubTypeDto {
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string
  loanSubTypeId?: number
  loanTypeId?: number
  code?: string
  name?: string
  priority?: number
  interestRate?: number
  rate?: number
  requestReq?: boolean
  uomid?: number
  loanQtyType?: string
  glcode?: string
  subGlcode?: string
  isActive?: boolean
}

export class LoanSubTypeViewDto {
  loanSubTypeId?: number
  loanTypeId?: number
  loanName?: string
  code?: string
  name?: string
  priority?: number
  interestRate?: number
  rate?: number
  requestReq?: boolean
  uomId?: number
  uomName?: string
  loanQtyType?: string
  glCode?: string
  subGLcode?: string
  isActive?: boolean
  createdBy?: string
  createdAt?: string
  updatedBy?: string
  updatedAt?: string

}
