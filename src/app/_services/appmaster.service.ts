import { VarietyViewDto, VarietyDto, VehicleTypeViewDto, VehicleTypeDto, TptDto, TptViewDto, BankViewDto, BankDto, TptdetailViewDto } from './../_models/applicationmaster';
import { Injectable } from "@angular/core";
import { LookUpHeaderDto, LookupViewDto } from "../_models/applicationmaster";
import { ApiHttpService } from "./api.http.service";
import { CREATE_CreateTpt_URI, CREATE_LOOKUP_URI, CREATE_VARIETY_URI, CREATE_VEHICLE_TYPE_URI, GET_BANKS_URI, GET_BANK_URI, GET_LOOKUP_URI, GET_PLANTTYPE_URI, GET_TPTDETAILS_URI, GET_TPTS_URI, GET_VARIETY_URI, GET_VEHICLE_TYPE_URI, UPDATE_LOOKUP_URI, UPDATE_UpdateTpt_URI, UPDATE_VARIETY_URI, UPDATE_VEHICLE_TYPE_URI } from "./api.uri.service";



@Injectable({ providedIn: 'root' })
export class AppMasterService extends ApiHttpService {
  // lookup
  public GetlookUp() {
    return this.get<LookupViewDto[]>(GET_LOOKUP_URI);
  }
  public Createlookup(lookup: LookUpHeaderDto) {
    return this.post<LookUpHeaderDto>(CREATE_LOOKUP_URI, lookup);
  }
  public Updatelookup(lookup: LookUpHeaderDto) {
    return this.post<LookUpHeaderDto>(UPDATE_LOOKUP_URI, lookup);
  }

  /* Variety */

  public GetVarieties() {
    return this.get<VarietyViewDto[]>(GET_VARIETY_URI);
  }
  public CreateVariety(variety: VarietyDto) {
    return this.post<VarietyDto>(CREATE_VARIETY_URI, variety);
  }
  public UpdateVariety(variety: VarietyDto) {
    return this.post<VarietyDto>(UPDATE_VARIETY_URI, variety);
  }

  /* Vehicle Type */

  public GetVehicleTypes() {
    return this.get<VehicleTypeViewDto[]>(GET_VEHICLE_TYPE_URI);
  }
  public CreateVehicleType(vehicleType: VehicleTypeDto) {
    return this.post<VehicleTypeDto>(CREATE_VEHICLE_TYPE_URI, vehicleType);
  }
  public UpdateVehicleType(vehicleType: VehicleTypeDto) {
    return this.post<VehicleTypeDto>(UPDATE_VEHICLE_TYPE_URI, vehicleType);
  }

  /* TPT */

  public GetTpts() {
    return this.get<TptViewDto[]>(GET_TPTS_URI);
  }
  public CreateTpt(tpt: TptDto) {
    debugger
    return this.post<TptDto>(CREATE_CreateTpt_URI, tpt);
  }
  public UpdateTpt(tpt: TptDto) {
    return this.post<TptDto>(UPDATE_UpdateTpt_URI, tpt);
  }

  /* TPT Details */

  public GetTptDetails(tptId: number) {
    return this.get<TptdetailViewDto[]>(GET_TPTDETAILS_URI + tptId);
  }

  /* Bank */

  public GetBanks() {
    return this.get<BankViewDto[]>(GET_BANKS_URI);
  }
  public GetBank(Id: any) {
    return this.get<BankDto>(GET_BANK_URI + Id);
  }

}


