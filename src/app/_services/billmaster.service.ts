import { Injectable } from "@angular/core";
import { BillDto, BillParameterDto, BillParameterViewDto, BillViewDto, DieselBunkDto, DieselBunkViewDto, DieselRateDto, DieselRateViewDto, DistanceRateDto, DistanceRateViewDto } from "../_models/billingmaster";
import { ApiHttpService } from "./api.http.service";
import {
  CREATE_BILLPARAM_URI, CREATE_BILL_URI, CREATE_DIESELBUNK_URI, CREATE_DIESELRATE_URI, CREATE_DISTANCERATE_URI, GET_BILLPARAMS_URI, GET_BILLS_URI, GET_DIESELRATES_URI, GET_DIESEL_BUNK_URI, GET_DISTANCERATES_URI, UPDATE_BILLPARAM_URI, UPDATE_BILL_URI,
  UPDATE_DIESELBUNK_URI,
  UPDATE_DIESELRATE_URI,
  UPDATE_DISTANCERATE_URI
} from "./api.uri.service";


@Injectable({ providedIn: 'root' })
export class BillMasterService extends ApiHttpService {

  public GetBills() {
    return this.get<BillViewDto[]>(GET_BILLS_URI);
  }

  public CreateBill(bill: any) {
    return this.post<any>(CREATE_BILL_URI, bill);
  }

  public UpdateBill(bill: any) {
    return this.post<any>(UPDATE_BILL_URI, bill);
  }

  public GetBillParameters() {
    return this.get<BillParameterViewDto[]>(GET_BILLPARAMS_URI);
  }

  public CreateBillParam(billParam: BillParameterDto) {
    return this.post<BillParameterDto>(CREATE_BILLPARAM_URI, billParam);
  }

  public UpdateBillParam(billParam: BillParameterDto) {
    return this.post<any>(UPDATE_BILLPARAM_URI, billParam);
  }

  public GetDieselBunks() {
    return this.get<DieselBunkViewDto[]>(GET_DIESEL_BUNK_URI);
  }

  public CreateDieselBunk(dieselBunk: DieselBunkDto) {
    debugger
    return this.post<DieselBunkDto>(CREATE_DIESELBUNK_URI, dieselBunk);
  }

  public UpdateDieselBunk(dieselBunk: DieselBunkDto) {
    return this.post<DieselBunkDto>(UPDATE_DIESELBUNK_URI, dieselBunk);
  }

  // Diesel rates services

  public GetDieselRates() {
    return this.get<DieselRateViewDto[]>(GET_DIESELRATES_URI);
  }

  public CreateDieselRate(dieselRate: DieselRateDto) {
    debugger
    return this.post<DieselRateDto>(CREATE_DIESELRATE_URI, dieselRate);
  }

  public UpdateDieselRate(dieselRate: DieselRateDto) {
    return this.post<DieselRateDto>(UPDATE_DIESELRATE_URI, dieselRate);
  }

  // Distance rate services

  public GetDistanceRates() {
    return this.get<DistanceRateViewDto[]>(GET_DISTANCERATES_URI);
  }

  public CreateDistanceRate(distanceRate: DistanceRateDto) {
    debugger
    return this.post<DistanceRateDto>(CREATE_DISTANCERATE_URI, distanceRate);
  }

  public UpdateDistanceRate(distanceRate: DistanceRateDto) {
    return this.post<DistanceRateDto>(UPDATE_DISTANCERATE_URI, distanceRate);
  }

}
