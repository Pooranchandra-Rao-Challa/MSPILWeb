export class LookUpHeaderDto{
  id?:number
  code?: string;
  name?: string;
  isActive?: boolean;
  lookUpDetails?:LookupDetailDto[];
  LookupDetailDto: any;
}
export class LookupDetailDto{
  id?:number;
  code?: string;
  name?: string;
  remarks?: string;
  listingorder?: number;
}

export class LookupViewDto{
  id?: number;
  code?: string;
  name?: string;
  isActive?: boolean;
  updatedAt?: Date;
  createdAt?: Date;
  updatedBy?: string;
  createdBy?: string;
}

