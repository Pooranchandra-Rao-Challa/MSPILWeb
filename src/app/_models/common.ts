export class MaxLength {
  code: number = 10;
  name: number = 50;
  seasonName: number = 9;
  address: number = 256;
  pinCode: number = 6;
  phoneNo: number = 10;
  accountNo: number = 18;
  aadhaarNo:number =12;
  Seasonname:number=9;
  ifscCode:number=11;
  Code:number=20;
  listingorder:number=2;
}
export class ApplicationConstantDto {

  id?: number;
  name?: string;
  value?: string;
  createdBy?: string;
  createdAt?: Date;
  updatedBy?: string;
  updatedAt?: Date;

}

export interface ITableHeader {
  field: string;
  header: string;
  label: string;
}

export class ConfirmationRequest {
  message: string = 'Are you sure want to delete ?';
  header: string = 'Confirmation';
  icon: string = 'pi pi-exclamation-triangle';
  class: string ='text-red';
}