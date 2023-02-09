import { Injectable } from "@angular/core";
import { LookupDetailDto } from "../_models/applicationmaster";
import { ApiHttpService } from "./api.http.service";
import { LOOKUP_ACTIONPLANS_URI, LOOKUP_BILLCATEGORIES_URI, LOOKUP_CASTE_URI, LOOKUP_CROPS_URI, LOOKUP_DEPARTMENTS_URI, LOOKUP_DESIGNATIONS_URI, LOOKUP_DISEASES_URI, LOOKUP_FERTILIZERS_URI, LOOKUP_GRADES_URI, LOOKUP_HGL_TYPES_URI, LOOKUP_LOAN_TRANSFER_REASONS_URI, LOOKUP_LOAN_TRANSFER_TYPES_URI, LOOKUP_METHOD_OF_IRRIGATIONS_URI, LOOKUP_NOT_PLANING_RESONS_URI, LOOKUP_PAYMENT_MODES_URI, LOOKUP_PERISHABLE_REASONS_URI, LOOKUP_PESTS_URI, LOOKUP_PLANTING_METHODS_URI, LOOKUP_PLOT_TRANSFER_REASONS_URI, LOOKUP_PLOT_TRANSFER_TYPES_URI, LOOKUP_PLOT_TYPES_URI, LOOKUP_PROPPING_STAGES_URI, LOOKUP_RELATION_TYPES_URI, LOOKUP_SEED_MATERIAL_USED_URI, LOOKUP_SEED_SUPPLY_TYPES_URI, LOOKUP_SOIL_TYPES_URI, LOOKUP_SOURCE_OF_IRRIGATIONS_URI, LOOKUP_SPACING_INFO_URI, LOOKUP_TPT_TYPES_URI, LOOKUP_TYPE_OF_SEEDS_URI, LOOKUP_UOMS_URI, LOOKUP_VARIETY_TYPES_URI, LOOKUP_WB_MACHINES_URI, LOOKUP_WEEDS_URI, LOOKUP_WEED_STATUSES_URI } from "./api.uri.service";

@Injectable({ providedIn: 'root' })
export class LookupService extends ApiHttpService {

  public CropTypes() {
    return this.get<LookupDetailDto[]>(LOOKUP_CROPS_URI);
  }
  public VarietyTypes() {
    return this.get<LookupDetailDto[]>(LOOKUP_VARIETY_TYPES_URI);
  }

  public NotPlaningResons() {
    return this.get<LookupDetailDto[]>(LOOKUP_NOT_PLANING_RESONS_URI);
  }
  public PlotTypes() {
    return this.get<LookupDetailDto[]>(LOOKUP_PLOT_TYPES_URI);
  }
  public ActionPlans() {
    return this.get<LookupDetailDto[]>(LOOKUP_ACTIONPLANS_URI);
  }
  public PlotTransferReasons() {
    return this.get<LookupDetailDto[]>(LOOKUP_PLOT_TRANSFER_REASONS_URI);
  }
  public MethodofIrrigations() {
    return this.get<LookupDetailDto[]>(LOOKUP_METHOD_OF_IRRIGATIONS_URI);
  }
  public SourceofIrrigations() {
    return this.get<LookupDetailDto[]>(LOOKUP_SOURCE_OF_IRRIGATIONS_URI);
  }
  public LoanTransferReasons() {
    return this.get<LookupDetailDto[]>(LOOKUP_LOAN_TRANSFER_REASONS_URI);
  }
  public PlantingMethods() {
    return this.get<LookupDetailDto[]>(LOOKUP_PLANTING_METHODS_URI);
  }
  public WeedStatuses() {
    return this.get<LookupDetailDto[]>(LOOKUP_WEED_STATUSES_URI);
  }
  public SeedSupplyTypes() {
    return this.get<LookupDetailDto[]>(LOOKUP_SEED_SUPPLY_TYPES_URI);
  }
  public TypeOfSeeds() {
    return this.get<LookupDetailDto[]>(LOOKUP_TYPE_OF_SEEDS_URI);
  }
  public RelationTypes() {
    return this.get<LookupDetailDto[]>(LOOKUP_RELATION_TYPES_URI);
  }
  public SoilTypes() {
    return this.get<LookupDetailDto[]>(LOOKUP_SOIL_TYPES_URI);
  }
  public SpacingInfo() {
    return this.get<LookupDetailDto[]>(LOOKUP_SPACING_INFO_URI);
  }
  public PerishableReasons() {
    return this.get<LookupDetailDto[]>(LOOKUP_PERISHABLE_REASONS_URI);
  }
  public TPTTypes() {
    return this.get<LookupDetailDto[]>(LOOKUP_TPT_TYPES_URI);
  }
  public HGLTypes() {
    return this.get<LookupDetailDto[]>(LOOKUP_HGL_TYPES_URI);
  }
  public Castes() {
    return this.get<LookupDetailDto[]>(LOOKUP_CASTE_URI);
  }
  public PlotTransferTypes() {
    return this.get<LookupDetailDto[]>(LOOKUP_PLOT_TRANSFER_TYPES_URI);
  }
  public LoanTransferTypes() {
    return this.get<LookupDetailDto[]>(LOOKUP_LOAN_TRANSFER_TYPES_URI);
  }
  public PaymentModes() {
    return this.get<LookupDetailDto[]>(LOOKUP_PAYMENT_MODES_URI);
  }
  public Grades() {
    return this.get<LookupDetailDto[]>(LOOKUP_GRADES_URI);
  }
  public ProppingStages() {
    return this.get<LookupDetailDto[]>(LOOKUP_PROPPING_STAGES_URI);
  }
  public WBMachines() {
    return this.get<LookupDetailDto[]>(LOOKUP_WB_MACHINES_URI);
  }
  public BillCategories() {
    return this.get<LookupDetailDto[]>(LOOKUP_BILLCATEGORIES_URI);
  }
  public Crops() {
    return this.get<LookupDetailDto[]>(LOOKUP_CROPS_URI);
  }
  public UOMs() {
    return this.get<LookupDetailDto[]>(LOOKUP_UOMS_URI);
  }
  public Departments() {
    return this.get<LookupDetailDto[]>(LOOKUP_DEPARTMENTS_URI);
  }
  public Designations() {
    return this.get<LookupDetailDto[]>(LOOKUP_DESIGNATIONS_URI);
  }
  public Fertilizers() {
    return this.get<LookupDetailDto[]>(LOOKUP_FERTILIZERS_URI);
  }
  public Pests() {
    return this.get<LookupDetailDto[]>(LOOKUP_PESTS_URI);
  }
  public Diseases() {
    return this.get<LookupDetailDto[]>(LOOKUP_DISEASES_URI);
  }
  public Weeds() {
    return this.get<LookupDetailDto[]>(LOOKUP_WEEDS_URI);
  }
  public SeedMaterialUsed() {
    return this.get<LookupDetailDto[]>(LOOKUP_SEED_MATERIAL_USED_URI);
  }
}
