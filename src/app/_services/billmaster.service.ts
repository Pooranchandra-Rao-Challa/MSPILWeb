import { Injectable } from "@angular/core";
import { BillDto, BillParameterDto, BillParameterViewDto, BillViewDto, DieselBunkViewDto } from "../_models/billingmaster";
import { ApiHttpService } from "./api.http.service";
import { CREATE_BILLPARAM_URI, CREATE_BILL_URI, GET_BILLPARAMS_URI, GET_BILLS_URI, GET_DIESEL_BUNK_URI, UPDATE_BILLPARAM_URI, UPDATE_BILL_URI } from "./api.uri.service";


@Injectable({ providedIn: 'root' })
export class BillMasterService extends ApiHttpService {

  public CreateBill(bill: any) {
    return this.post<any>(CREATE_BILL_URI, bill);
  }

  public UpdateBill(bill: any) {
    return this.post<any>(UPDATE_BILL_URI, bill);
  }

  public GetBills() {
    return this.get<BillViewDto[]>(GET_BILLS_URI);
  }

  public CreateBillParam(billParam: BillParameterDto) {
    debugger
    return this.post<BillParameterDto>(CREATE_BILLPARAM_URI, billParam);
  }

  public UpdateBillParam(billParam: BillParameterDto) {
    return this.post<any>(UPDATE_BILLPARAM_URI, billParam);
  }

  public GetDieselBunks() {
    return this.get<DieselBunkViewDto[]>(GET_DIESEL_BUNK_URI);
  }

  public GetBillParameters() {
    return this.get<BillParameterViewDto[]>(GET_BILLPARAMS_URI);
  }

}
