export class LookUpHeaderDto{
  lookUpId?:number
  code?: string;
  name?: string;
  isActive?: boolean;
  lookUpDetails?:LookupDetailDto[];
}
export class LookupDetailDto{
  lookUpId?:number;
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
