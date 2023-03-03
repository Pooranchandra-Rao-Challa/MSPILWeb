import {
  VarietyViewDto, VarietyDto, VehicleTypeViewDto, VehicleTypeDto, PlantSubTypeViewDto, PlantSubTypeDto, BankViewDto, BankDto, SeasonViewDto, SeasonDto, HglViewDto,
  HglDto, ShiftsViewDto, ShiftDto, SampleslabsViewDto, SampleSlabDto, TptViewDto, TptDto, TptdetailViewDto, LookupDetailViewDto, FarmersViewDto, FarmerDto, BranchViewDto, SeasonBillingRateViewDto
} from './../_models/applicationmaster';
import { Injectable } from "@angular/core";
import { LookUpHeaderDto, LookupViewDto, plantTypeDto, plantTypeViewDto, SubHglViewDto } from '../_models/applicationmaster';
import { ApiHttpService } from "./api.http.service";
import { CREATE_FARMER_URI, GET_FARMERS_URI,GET_BRANCH_URI, GET_LOOKUP_DETAILS_URI, GET_SUBHGL_URI, UPDATE_FARMER_URI, GET_BILLPARAMS_URI, GET_BILLPARAMSFORCATEGORY_URI, GET_GETSEASONBILLINGRATES_URI, } from './api.uri.service';
import {
  CREATE_BANK_URI, CREATE_CreateTpt_URI, CREATE_HGL_URI, CREATE_LOOKUP_URI, CREATE_PLANTTYPE_URI, CREATE_PLANT_SUB_TYPE_URI, CREATE_SAMPLESLAB_URI, CREATE_SEASON_URI,
  CREATE_SHIFT_URI, CREATE_VARIETY_URI, CREATE_VEHICLE_TYPE_URI, GET_BANKS_URI, GET_BANK_URI, GET_HGL_URI, GET_LOOKUP_URI, GET_PLANTTYPE_URI, GET_PLANT_SUB_TYPE_URI,
  GET_SAMPLESLABS_URI, GET_SEASON_URI, GET_SHIFT_URI, GET_TPTDETAILS_URI, GET_TPTS_URI, GET_VARIETY_URI, GET_VEHICLE_TYPE_URI, UPDATE_BANK_URI, UPDATE_HGL_URI,
  UPDATE_LOOKUP_URI, UPDATE_PLANTTYPE_URI, UPDATE_PLANT_SUB_TYPE_URI, UPDATE_SAMPLESLAB_URI, UPDATE_SEASON_URI, UPDATE_SHIFT_URI, UPDATE_UpdateTpt_URI,
  UPDATE_VARIETY_URI, UPDATE_VEHICLE_TYPE_URI
} from "./api.uri.service";
import { BillParameterViewDto } from '../_models/billingmaster';


@Injectable({ providedIn: 'root' })
export class AppMasterService extends ApiHttpService {
 // lookup
 public GetlookUp() {
  return this.get<LookupViewDto[]>(GET_LOOKUP_URI);
}
public Createlookup(lookup: LookUpHeaderDto) {
  debugger
  return this.post<LookUpHeaderDto>(CREATE_LOOKUP_URI, lookup);
}
public Updatelookup(lookup: LookUpHeaderDto) {
  debugger;
  return this.post<LookUpHeaderDto>(UPDATE_LOOKUP_URI, lookup);
}
// Lookup Details
public GetlookupDetails(lookupId:number) {
  return this.get<LookupDetailViewDto[]>(GET_LOOKUP_DETAILS_URI+lookupId);
}
// plant type
public GetPlantType() {
  return this.get<plantTypeViewDto[]>(GET_PLANTTYPE_URI);
}
public CreatePlantType(plant: plantTypeDto) {
  return this.post<plantTypeDto>(CREATE_PLANTTYPE_URI, plant);
}
public UpdatePlantType(plant: plantTypeDto) {
  return this.post<plantTypeDto>(UPDATE_PLANTTYPE_URI, plant);
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

  // plant Sub type
  public GetPlantSubType() {
    return this.get<PlantSubTypeViewDto[]>(GET_PLANT_SUB_TYPE_URI);
  }
  public CreatePlantSubType(PlantSubType: PlantSubTypeDto) {
    return this.post<PlantSubTypeDto>(CREATE_PLANT_SUB_TYPE_URI, PlantSubType);
  }
  public UpdatePlantSubType(PlantSubType: PlantSubTypeDto) {
    return this.post<PlantSubTypeDto>(UPDATE_PLANT_SUB_TYPE_URI, PlantSubType);
  }
  public GetPlantTypeForPlantSubType(plantTypeId?: number) {
    if (plantTypeId != null) return this.getWithId<plantTypeDto>(GET_PLANTTYPE_URI, plantTypeId);
    else return this.get<plantTypeDto>(GET_PLANTTYPE_URI);
  }
  /* Bank */
  public GetBanks() {
    return this.get<BankViewDto[]>(GET_BANKS_URI);
  }
  public GetBank(Id: any) {
    return this.get<BankDto>(GET_BANK_URI + Id);
  }
  public CreateBank(bank: BankDto) {
    return this.post<BankDto>(CREATE_BANK_URI, bank);
  }
  public UpdateBank(bank: BankDto) {
    return this.post<BankDto>(UPDATE_BANK_URI, bank);
  }
       // Branch Details
public GetBranchDetails(bankId:number) {
  return this.get<BranchViewDto[]>(GET_BRANCH_URI+bankId);
}
  // season
  public Getseason() {
    return this.get<SeasonViewDto[]>(GET_SEASON_URI);
  }

  public CreateSeason(season: SeasonDto) {
    debugger;
    return this.post<SeasonDto>(CREATE_SEASON_URI, season);
  }


  public UpdateSeason(season: SeasonDto) {
    return this.post<SeasonDto>(UPDATE_SEASON_URI, season);
  }

 // Hgl
  public GetHgls() {
    return this.get<HglViewDto[]>(GET_HGL_URI);
  }

  public CreateHgl(hgl: HglDto) {
    debugger;
    return this.post<HglDto>(CREATE_HGL_URI, hgl);
  }

  public UpdateHgl(hgl: HglDto) {
    return this.post<HglDto>(UPDATE_HGL_URI, hgl);

  }

  // SubHgl
  public GetSubHgl(hglId : number) {
    debugger;
    return this.get<SubHglViewDto[]>(GET_SUBHGL_URI + hglId );
  }

  // shift

  public GetShift() {
    return this.get<ShiftsViewDto[]>(GET_SHIFT_URI);
  }

  public CreateShift(shift: ShiftDto) {
    return this.post<ShiftDto>(CREATE_SHIFT_URI, shift);
  }

  public UpdateShift(shift: ShiftDto) {
    return this.post<ShiftDto>(UPDATE_SHIFT_URI, shift);
  }

  // sample Slabs

  public GetSampleSlabs() {
    return this.get<SampleslabsViewDto[]>(GET_SAMPLESLABS_URI);
  }

  public CreateSampleSlab(sampleslab: SampleSlabDto) {
    debugger
    return this.post<SampleSlabDto>(CREATE_SAMPLESLAB_URI, sampleslab);
  }

  public UpdateSampleSlab(sampleslab: SampleSlabDto) {
    return this.post<SampleSlabDto>(UPDATE_SAMPLESLAB_URI, sampleslab);
  }


  // Farmers

  public GetFarmers() {
    return this.get<FarmersViewDto[]>(GET_FARMERS_URI);
  }
  public CreateFarmer(farmer:FarmerDto){
    return this.post<FarmerDto>(CREATE_FARMER_URI, farmer);
  }
  public UpdateFarmer(farmer:FarmerDto){
    return this.post<FarmerDto>(UPDATE_FARMER_URI, farmer);
  }

  public BillParamsForCategory(categoryId:string) {
    return this.get<BillParameterViewDto[]>(GET_BILLPARAMSFORCATEGORY_URI + categoryId);
  }

  public GetSeasonBillingRates(seasonId: number | undefined) {
    return this.get<SeasonBillingRateViewDto[]>(GET_GETSEASONBILLINGRATES_URI + seasonId);
  }


}



