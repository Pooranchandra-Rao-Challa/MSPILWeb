import { Injectable } from "@angular/core";
import { CircleDto, CirclesViewDto, DistrictDto, DistrictViewDto, DivisionDto, DivisonsViewDto, MandalDto, MandalsViewDto, SectionDto, SectionsViewDto, StateDto, StatesViewDto, VillageDto, VillagesViewDto } from "../_models/geomodels";
import { ApiHttpService } from "./api.http.service";
import { CREATE_CIRCLE_URI, CREATE_DISTRICT_URI, CREATE_DIVISION_URI, CREATE_MANDAL_URI, CREATE_SECTION_URI, CREATE_STATE_URI, CREATE_VILLAGE_URI, CREATE_WAREHOUSE_URI, GET_CIRCLES_URI, GET_DISTRICTS_URI, GET_DIVISION_URI, GET_MANDALS_URI, GET_SECTIONS_URI, GET_STATES_URI, GET_VILLAGES_URI, GET_WAREHOUSE_URI, UPDATE_CIRCLE_URI, UPDATE_DISTRICT_URI, UPDATE_DIVISION_URI, UPDATE_MANDAL_URI, UPDATE_SECTION_URI, UPDATE_STATE_URI, UPDATE_VILLAGE_URI, UPDATE_WAREHOUSE_URI } from "./api.uri.service";

@Injectable({ providedIn: 'root' })
export class GeoMasterService extends ApiHttpService {
  public GetDistricts(){
    return this.get<DistrictViewDto[]>(GET_DISTRICTS_URI);
  }
  public CreateDistrict(district: DistrictDto){
    return this.post<DistrictDto>(CREATE_DISTRICT_URI,district);
  }
  public UpdateDistrict(district: DistrictDto){
    return this.post<DistrictDto>(UPDATE_DISTRICT_URI,district);
  }

  public GetCircles(){
    return this.get<CirclesViewDto[]>(GET_CIRCLES_URI);
  }
  public CreateCircle(circle: CircleDto){
    return this.post<CircleDto>(CREATE_CIRCLE_URI,circle);
  }
  public UpdateCircle(circle: CircleDto){
    return this.post<CircleDto>(UPDATE_CIRCLE_URI,circle);
  }

  public GetDivision(){
    return this.get<DivisonsViewDto[]>(GET_DIVISION_URI);
  }
  public CreateDivision(division: DivisionDto){
    return this.post<DivisionDto>(CREATE_DIVISION_URI,division);
  }
  public UpdateDivision(division: DivisionDto){
    return this.post<DivisionDto>(UPDATE_DIVISION_URI,division);
  }

  public GetMandals(){
    return this.get<MandalsViewDto[]>(GET_MANDALS_URI);
  }
  public CreateMandal(mandal: MandalDto){
    return this.post<MandalDto>(CREATE_MANDAL_URI,mandal);
  }
  public UpdateMandal(mandal: MandalDto){
    return this.post<MandalDto>(UPDATE_MANDAL_URI,mandal);
  }


  public GetSections(){
    return this.get<SectionsViewDto[]>(GET_SECTIONS_URI);
  }
  public CreateSection(section: SectionDto){
    return this.post<SectionDto>(CREATE_SECTION_URI,section);
  }
  public UpdateSection(section: SectionDto){
    return this.post<SectionDto>(UPDATE_SECTION_URI,section);
  }

  public GetState(){
    return this.get<StatesViewDto[]>(GET_STATES_URI);
  }
  public CreateState(state: StateDto){
    return this.post<StateDto>(CREATE_STATE_URI,state);
  }
  public UpdateState(state: StateDto){
    return this.post<StateDto>(UPDATE_STATE_URI,state);
  }


  public GetVillage(){
    return this.get<VillagesViewDto[]>(GET_VILLAGES_URI);
  }
  public CreateVillage(village: VillageDto){
    return this.post<VillageDto>(CREATE_VILLAGE_URI,village);
  }
  public UpdateVillage(village: VillageDto){
    return this.post<VillageDto>(UPDATE_VILLAGE_URI,village);
  }


}
