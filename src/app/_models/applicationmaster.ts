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
