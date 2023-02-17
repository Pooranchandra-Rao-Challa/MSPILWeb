import { VarietyViewDto, VarietyDto, VehicleTypeViewDto, VehicleTypeDto, PlantSubTypeViewDto, PlantSubTypeDto, BankViewDto, BankDto, SeasonViewDto, SeasonDto, HglViewDto, HglDto, ShiftsViewDto, ShiftDto, SampleslabsViewDto, SampleSlabDto } from './../_models/applicationmaster';
import { Injectable } from "@angular/core";
import { LookUpHeaderDto, LookupViewDto, plantTypeDto, planttypeViewDto } from "../_models/applicationmaster";
import { ApiHttpService } from "./api.http.service";
import { CREATE_BANK_URI, CREATE_HGL_URI, CREATE_LOOKUP_URI, CREATE_PLANTTYPE_URI, CREATE_PLANT_SUB_TYPE_URI, CREATE_SAMPLESLAB_URI, CREATE_SEASON_URI, CREATE_SHIFT_URI, CREATE_VARIETY_URI, CREATE_VEHICLE_TYPE_URI, GET_BANK_URI, GET_HGL_URI, GET_LOOKUP_URI, GET_PLANTTYPE_URI, GET_PLANT_SUB_TYPE_URI, GET_SAMPLESLABS_URI, GET_SEASON_URI, GET_SHIFT_URI, GET_VARIETY_URI, GET_VEHICLE_TYPE_URI, UPDATE_BANK_URI, UPDATE_HGL_URI, UPDATE_LOOKUP_URI, UPDATE_PLANTTYPE_URI, UPDATE_PLANT_SUB_TYPE_URI, UPDATE_SAMPLESLAB_URI, UPDATE_SEASON_URI, UPDATE_SHIFT_URI, UPDATE_VARIETY_URI, UPDATE_VEHICLE_TYPE_URI } from "./api.uri.service";



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
    // plant type
    public GetPlantType() {
      return this.get<planttypeViewDto[]>(GET_PLANTTYPE_URI);
    }
    public CreatePlantType(plant:plantTypeDto) {
      return this.post<plantTypeDto>(CREATE_PLANTTYPE_URI,plant);
    }
    public UpdatePlantType(plant:plantTypeDto) {
      return this.post<plantTypeDto>(UPDATE_PLANTTYPE_URI,plant);
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

// plant Sub type
public GetPlantSubType() {
  return this.get<PlantSubTypeViewDto[]>(GET_PLANT_SUB_TYPE_URI);
}
public CreatePlantSubType(PlantSubType:PlantSubTypeDto) {
  return this.post<PlantSubTypeDto>(CREATE_PLANT_SUB_TYPE_URI,PlantSubType);
}
public UpdatePlantSubType(PlantSubType:PlantSubTypeDto) {
  return this.post<PlantSubTypeDto>(UPDATE_PLANT_SUB_TYPE_URI,PlantSubType);
}

 /* Bank */
public GetBank() {
  return this.get<BankViewDto[]>(GET_BANK_URI);
}
public CreateBank(bank:BankDto) {
  return this.post<BankDto>(CREATE_BANK_URI,bank);
}
public UpdateBank(bank:BankDto) {
  return this.post<BankDto>(UPDATE_BANK_URI,bank);
}

public Getseason() {
  return this.get<SeasonViewDto[]>(GET_SEASON_URI);
  }

  public CreateSeason(season:SeasonDto){
    debugger;
    return this.post<SeasonDto>(CREATE_SEASON_URI,season);
  }


  public UpdateSeason(season: SeasonDto){
    return this.post<SeasonDto>(UPDATE_SEASON_URI,season);
  }


public GetHgls() {
  return this.get<HglViewDto[]>(GET_HGL_URI);
  }

  public CreateHgl(hgl:HglDto){
    return this.post<HglDto>(CREATE_HGL_URI,hgl);
  }

  public UpdateHgl(hgl: HglDto){
    return this.post<HglDto>(UPDATE_HGL_URI,hgl);
  }


// shift 

public GetShift() {
  return this.get<ShiftsViewDto[]>(GET_SHIFT_URI);
  }

  public CreateShift(shift:ShiftDto){
    return this.post<ShiftDto>(CREATE_SHIFT_URI,shift);
  }

  public UpdateShift(shift: ShiftDto){
    return this.post<ShiftDto>(UPDATE_SHIFT_URI,shift);
  }

  // sample Slabs

public GetSampleSlabs() {
  return this.get<SampleslabsViewDto[]>(GET_SAMPLESLABS_URI);
  }

  public CreateSampleSlab(sampleslab:SampleSlabDto){
    debugger
    return this.post<SampleSlabDto>(CREATE_SAMPLESLAB_URI,sampleslab);
  }

  public UpdateSampleSlab(sampleslab:SampleSlabDto){
    return this.post<SampleSlabDto>(UPDATE_SAMPLESLAB_URI,sampleslab);
  }

}


