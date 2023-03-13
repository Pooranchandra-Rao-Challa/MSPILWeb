import { Injectable } from "@angular/core";
import { LookupDetailViewDto } from "src/app/_models/applicationmaster";
import { ApiHttpService } from "src/app/_services/api.http.service";
import {
  APP_CONSTANTS,
  LOOKUP_ACTIONPLANS_URI, LOOKUP_BILLCATEGORIES_URI, LOOKUP_CASTE_URI, LOOKUP_CROPS_URI, LOOKUP_CROPTYPES_URI, LOOKUP_DEPARTMENTS_URI, LOOKUP_DESIGNATIONS_URI,
  LOOKUP_DISEASES_URI, LOOKUP_FERTILIZERS_URI, LOOKUP_GRADES_URI, LOOKUP_HGL_TYPES_URI, LOOKUP_LOAN_TRANSFER_REASONS_URI, LOOKUP_LOAN_TRANSFER_TYPES_URI,
  LOOKUP_METHOD_OF_IRRIGATIONS_URI, LOOKUP_NOT_PLANING_RESONS_URI, LOOKUP_PAYMENT_MODES_URI, LOOKUP_PERISHABLE_REASONS_URI, LOOKUP_PESTS_URI,
  LOOKUP_PLANTING_METHODS_URI, LOOKUP_PLOT_TRANSFER_REASONS_URI, LOOKUP_PLOT_TRANSFER_TYPES_URI, LOOKUP_PLOT_TYPES_URI, LOOKUP_PROPPING_STAGES_URI,
  LOOKUP_RELATION_TYPES_URI, LOOKUP_SEED_MATERIAL_USED_URI, LOOKUP_SEED_SUPPLY_TYPES_URI, LOOKUP_SOIL_TYPES_URI, LOOKUP_SOURCE_OF_IRRIGATIONS_URI,
  LOOKUP_SPACING_INFO_URI, LOOKUP_TPT_TYPES_URI, LOOKUP_TYPE_OF_SEEDS_URI, LOOKUP_UOMS_URI, LOOKUP_VARIETY_TYPES_URI, LOOKUP_WB_MACHINES_URI,
  LOOKUP_WEEDS_URI, LOOKUP_WEED_STATUSES_URI
} from "src/app/_services/api.uri.service";

@Injectable({ providedIn: 'root' })
export class LookupService extends ApiHttpService {

  public CropTypes() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_CROPTYPES_URI);
  }
  public VarietyTypes() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_VARIETY_TYPES_URI);
  }

  public NotPlaningResons() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_NOT_PLANING_RESONS_URI);
  }
  public PlotTypes() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_PLOT_TYPES_URI);
  }
  public ActionPlans() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_ACTIONPLANS_URI);
  }
  public PlotTransferReasons() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_PLOT_TRANSFER_REASONS_URI);
  }
  public MethodofIrrigations() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_METHOD_OF_IRRIGATIONS_URI);
  }
  public SourceofIrrigations() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_SOURCE_OF_IRRIGATIONS_URI);
  }
  public LoanTransferReasons() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_LOAN_TRANSFER_REASONS_URI);
  }
  public PlantingMethods() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_PLANTING_METHODS_URI);
  }
  public WeedStatuses() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_WEED_STATUSES_URI);
  }
  public SeedSupplyTypes() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_SEED_SUPPLY_TYPES_URI);
  }
  public TypeOfSeeds() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_TYPE_OF_SEEDS_URI);
  }
  public RelationTypes() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_RELATION_TYPES_URI);
  }
  public SoilTypes() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_SOIL_TYPES_URI);
  }
  public SpacingInfo() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_SPACING_INFO_URI);
  }
  public PerishableReasons() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_PERISHABLE_REASONS_URI);
  }
  public TPTTypes() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_TPT_TYPES_URI);
  }
  public HGLTypes() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_HGL_TYPES_URI);
  }
  public Castes() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_CASTE_URI);
  }
  public PlotTransferTypes() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_PLOT_TRANSFER_TYPES_URI);
  }
  public LoanTransferTypes() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_LOAN_TRANSFER_TYPES_URI);
  }
  public PaymentModes() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_PAYMENT_MODES_URI);
  }
  public Grades() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_GRADES_URI);
  }
  public ProppingStages() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_PROPPING_STAGES_URI);
  }
  public WBMachines() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_WB_MACHINES_URI);
  }
  public BillCategories() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_BILLCATEGORIES_URI);
  }
  public Crops() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_CROPS_URI);
  }
  public UOMs() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_UOMS_URI);
  }
  public Departments() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_DEPARTMENTS_URI);
  }
  public Designations() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_DESIGNATIONS_URI);
  }
  public Fertilizers() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_FERTILIZERS_URI);
  }
  public Pests() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_PESTS_URI);
  }
  public Diseases() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_DISEASES_URI);
  }
  public Weeds() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_WEEDS_URI);
  }
  public SeedMaterialUsed() {
    return this.get<LookupDetailViewDto[]>(LOOKUP_SEED_MATERIAL_USED_URI);
  }
  public AppConstants() {
    return this.get<LookupDetailViewDto[]>(APP_CONSTANTS);
  }
}
