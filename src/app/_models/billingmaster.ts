export class BillDto {
  billId?: number;
  billNo?: number;
  categoryId?: number;
  seasonsId?: number;
  runDate?: Date;
  fromDate?: Date;
  toDate?: Date;
  isFinal?: boolean;
  isActive?: boolean;
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
  isFinal?: boolean;
  isActive?: boolean;
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
  id?: number;
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
  isActive?: boolean;
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
  isActive?: boolean;
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
  isActive?: boolean;
}

export class DieselRateViewDto {
  id?: number;
  fromDate?: Date;
  toDate?: Date;
  rate?: number;
  isActive?: boolean;
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
  isActive?: boolean
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: string;
  createdBy?: string;
}