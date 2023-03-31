export class MaxLength {
  code: number = 10;
  name: number = 50;
  address: number = 256;
  pinCode: number = 6;
  phoneNo: number = 10;
  accountNo: number = 18;
  aadhaarNo:number =12;
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
export class ConstantDto {
  PolFactor?: string
  BrixFactor?: string
  WeighmentPrintCount?: string
  SpecialPermitAllowedLimit?: string
  PermitLapseHours?: string
  NonRegisteredBindingPERC?: string
  NonRegisteredBadPERC?: string
  SupportsMultiLogin?: string
  IsWeighmentApprovalRequired?: string
}
