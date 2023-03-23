import { Injectable } from "@angular/core";


@Injectable({ providedIn: 'root' })
export class APIURIService {
  constructor() { }
}
export const LOGIN_URI = "Security/Login";
export const REFRESH_TOKEN_URI = "Security/Refresh"
export const GET_USERS_URI = "Security/GetUsers"
export const CREATE_USER_URI = "Security/CreateUser"
export const UPDATE_USER_URI = "Security/UpdateUser"
export const GET_USER_SECTIONS_URI = "Security/GetUserSections"
export const GET_ALL_SECTIONS_URI = "Security/GetAllSections"
export const GET_ROLES_URI = "Security/GetRoles"
export const CREATE_ROLE_URI = "Security/CreateRole"
export const UPDATE_ROLE_URI = "Security/UpdateRole"
export const GET_ROLE_PERMISSIONS_URI = "Security/GetRolePermissions"
export const GET_PERMISSIONS_URI = "Security/GetPermissions"
export const CREATE_DISTRICT_URI = "GeoMaster/CreateDistrict"
export const UPDATE_DISTRICT_URI = "GeoMaster/UpdateDistrict"
export const GET_DISTRICTS_URI = "GeoMaster/GetDistricts"
export const CREATE_DIVISION_URI = "GeoMaster/CreateDivision"
export const UPDATE_DIVISION_URI = "GeoMaster/UpdateDivision"
export const GET_DIVISION_URI = "GeoMaster/GetDivisions"
export const CREATE_STATE_URI = "GeoMaster/CreateState"
export const UPDATE_STATE_URI = "GeoMaster/UpdateState"
export const GET_STATES_URI = "GeoMaster/GetStates"
export const CREATE_CIRCLE_URI = "GeoMaster/CreateCircle"
export const UPDATE_CIRCLE_URI = "GeoMaster/UpdateCircle"
export const GET_CIRCLES_URI = "GeoMaster/GetCircles"
export const CREATE_MANDAL_URI = "GeoMaster/CreateMandal"
export const UPDATE_MANDAL_URI = "GeoMaster/UpdateMandal"
export const GET_MANDALS_URI = "GeoMaster/GetMandals"
export const CREATE_SECTION_URI = "GeoMaster/CreateSection"
export const UPDATE_SECTION_URI = "GeoMaster/UpdateSection"
export const GET_SECTIONS_URI = "GeoMaster/GetSections"
export const CREATE_VILLAGE_URI = "GeoMaster/CreateVillage"
export const UPDATE_VILLAGE_URI = "GeoMaster/UpdateVillage"
export const GET_VILLAGES_URI = "GeoMaster/GetVillages"

export const GET_Application_Constant_URI = "Common/GetConstants"

export const CREATE_BILL_URI = "BillingMaster/CreateBill";
export const UPDATE_BILL_URI = "BillingMaster/UpdateBill";
export const GET_BILLS_URI = "BillingMaster/GetBills";
export const CREATE_BILLPARAM_URI = "BillingMaster/CreateBillParameter";
export const UPDATE_BILLPARAM_URI = "BillingMaster/UpdateBillParameter";
export const GET_BILLPARAMS_URI = "BillingMaster/GetBillParameters/";
export const GET_DIESEL_BUNK_URI = "BillingMaster/GetDieselBunks";
export const CREATE_DIESELBUNK_URI = "BillingMaster/CreateDieselBunk";
export const UPDATE_DIESELBUNK_URI = "BillingMaster/UpdateDieselBunk";
export const GET_DIESELRATES_URI = "BillingMaster/GetDieselRates";
export const CREATE_DIESELRATE_URI = "BillingMaster/CreateDieselRate";
export const UPDATE_DIESELRATE_URI = "BillingMaster/UpdateDieselRate";
export const GET_DISTANCERATES_URI = "BillingMaster/GetDistanceRates";
export const CREATE_DISTANCERATE_URI = "BillingMaster/CreateDistanceRate";
export const UPDATE_DISTANCERATE_URI = "BillingMaster/UpdateDistanceRate";
export const GET_VILLAGEPARAMRATES_URI = "BillingMaster/GetVillageParamRates";
export const GET_VILLAGEPARAMRATESBYSEASONID_URI = "BillingMaster/GetVillageParamRateBySeasonId/";
export const CREATE_VILLAGEPARAMRATE_URI = "BillingMaster/CreateVillageParamRate";
export const UPDATE_VILLAGEPARAMRATE_URI = "BillingMaster/UpdateVillageParamRate";
export const GET_WAREHOUSE_URI = "BillingMaster/GetWareHouses";
export const CREATE_WAREHOUSE_URI = "BillingMaster/CreateWareHouse";
export const UPDATE_WAREHOUSE_URI = "BillingMaster/UpdateWareHouse";


export const LOOKUP_ACTIONPLANS_URI = "Lookup/ActionPlans";
export const LOOKUP_BILLCATEGORIES_URI = "Lookup/BillCategories";
export const LOOKUP_CROPS_URI = "Lookup/Crops";
export const LOOKUP_CASTE_URI = "Lookup/Castes";
export const LOOKUP_CROPTYPES_URI = "Lookup/CropTypes";
export const LOOKUP_DEPARTMENTS_URI = "Lookup/Departments";
export const LOOKUP_DESIGNATIONS_URI = "Lookup/Designations";
export const LOOKUP_DISEASES_URI = "Lookup/Diseases";
export const LOOKUP_FERTILIZERS_URI = "Lookup/Fertilizers";
export const LOOKUP_GRADES_URI = "Lookup/Grades";
export const LOOKUP_HGL_TYPES_URI = "Lookup/HGLTypes";
export const LOOKUP_LOAN_TRANSFER_REASONS_URI = "Lookup/LoanTransferReasons";
export const LOOKUP_LOAN_TRANSFER_TYPES_URI = "Lookup/LoanTransferTypes";
export const LOOKUP_METHOD_OF_IRRIGATIONS_URI = "Lookup/MethodofIrrigations";
export const LOOKUP_NOT_PLANING_RESONS_URI = "Lookup/NotPlaningResons";
export const LOOKUP_PAYMENT_MODES_URI = "Lookup/PaymentModes";
export const LOOKUP_PESTS_URI = "Lookup/Pests";
export const LOOKUP_PERISHABLE_REASONS_URI = "Lookup/PerishableReasons";
export const LOOKUP_PLANTING_METHODS_URI = "Lookup/PlantingMethods";
export const LOOKUP_PLOT_TRANSFER_REASONS_URI = "Lookup/PlotTransferReasons";
export const LOOKUP_PLOT_TRANSFER_TYPES_URI = "Lookup/PlotTransferTypes";
export const LOOKUP_PLOT_TYPES_URI = "Lookup/PlotTypes";
export const LOOKUP_PROPPING_STAGES_URI = "Lookup/ProppingStages";
export const LOOKUP_RELATION_TYPES_URI = "Lookup/RelationTypes";
export const LOOKUP_SEED_SUPPLY_TYPES_URI = "Lookup/SeedSupplyTypes";
export const LOOKUP_SOIL_TYPES_URI = "Lookup/SoilTypes";
export const LOOKUP_SOURCE_OF_IRRIGATIONS_URI = "Lookup/SourceofIrrigations";
export const LOOKUP_SPACING_INFO_URI = "Lookup/SpacingInfo";
export const LOOKUP_TPT_TYPES_URI = "Lookup/TPTTypes";
export const LOOKUP_TYPE_OF_SEEDS_URI = "Lookup/TypeOfSeeds";
export const LOOKUP_UOMS_URI = "Lookup/UOMs";
export const LOOKUP_VARIETY_TYPES_URI = "Lookup/VarietyTypes";
export const LOOKUP_WB_MACHINES_URI = "Lookup/WBMachines";
export const LOOKUP_WEED_STATUSES_URI = "Lookup/WeedStatuses";
export const LOOKUP_WEEDS_URI = "Lookup/Weeds";
export const LOOKUP_SEED_MATERIAL_USED_URI = "Lookup/SeedMaterialUsed";
export const APP_CONSTANTS = "Lookup/AppConstants";
export const GET_LOOKUP_URI = "ApplicationMaster/GetLookUps"
export const GET_LOOKUP_DETAILS_URI = "ApplicationMaster/GetLookUp"
//export const GET_LOOKUP_FOR_MENU_URI = "ApplicationMaster/Lookups"
export const GET_LOOKUP_DETAILS_FOR_MENU_URI = "ApplicationMaster/LookupDetailsforLookup"
export const CREATE_LOOKUP_URI = "ApplicationMaster/CreateLookUp"
export const UPDATE_LOOKUP_URI = "ApplicationMaster/UpdateLookUp"
export const GET_PLANTTYPE_URI = "ApplicationMaster/GetPlantTypes";
export const CREATE_PLANTTYPE_URI = "ApplicationMaster/CreatePlantType";
export const UPDATE_PLANTTYPE_URI = "ApplicationMaster/UpdatePlantType";
export const GET_VARIETY_URI = "ApplicationMaster/GetVarieties";
export const CREATE_VARIETY_URI = "ApplicationMaster/CreateVariety";
export const UPDATE_VARIETY_URI = "ApplicationMaster/UpdateVariety";
export const GET_VEHICLE_TYPE_URI = "ApplicationMaster/GetVehicleTypes";
export const CREATE_VEHICLE_TYPE_URI = "ApplicationMaster/CreateVehicleType";
export const UPDATE_VEHICLE_TYPE_URI = "ApplicationMaster/UpdateVehicleType";
export const GET_TPTS_URI = "ApplicationMaster/GetTpts";
export const CREATE_CreateTpt_URI = "ApplicationMaster/CreateTpt";
export const UPDATE_UpdateTpt_URI = "ApplicationMaster/UpdateTpt";
export const GET_BANKS_URI = "ApplicationMaster/GetBanks";
export const GET_BANK_URI = "ApplicationMaster/GetBank/";
export const GET_TPTDETAILS_URI = "ApplicationMaster/GetTptDetail";
export const GET_PLANT_SUB_TYPE_URI = "ApplicationMaster/GetPlantSubTypes";
export const CREATE_PLANT_SUB_TYPE_URI = "ApplicationMaster/CreatePlantSubType";
export const UPDATE_PLANT_SUB_TYPE_URI = "ApplicationMaster/UpdatePlantSubType";
export const CREATE_BANK_URI = "ApplicationMaster/CreateBank"
export const UPDATE_BANK_URI = "ApplicationMaster/UpdateBank";
export const GET_SEASON_URI = "ApplicationMaster/GetSeasons";
export const CURRENT_SEASON_URI = "ApplicationMaster/CurrentSeason";
export const GET_BRANCH_URI = "ApplicationMaster/GetBank/"
export const CREATE_SEASON_URI = "ApplicationMaster/CreateSeason";
export const UPDATE_SEASON_URI = "ApplicationMaster/UpdateSeason";
export const GET_SHIFT_URI = "ApplicationMaster/GetShifts";
export const CREATE_SHIFT_URI = "ApplicationMaster/CreateShift";
export const UPDATE_SHIFT_URI = "ApplicationMaster/UpdateShift";
export const GET_SAMPLESLABS_URI = "ApplicationMaster/GetSampleSlabs";
export const CREATE_SAMPLESLAB_URI = "ApplicationMaster/CreateSampleSlab";
export const UPDATE_SAMPLESLAB_URI = "ApplicationMaster/UpdateSampleSlab";
export const GET_FARMERS_URI = "ApplicationMaster/GetFarmers";
export const CREATE_FARMER_URI = "ApplicationMaster/CreateFarmer";
export const UPDATE_FARMER_URI = "ApplicationMaster/UpdateFarmer";
export const GET_HGL_URI = "ApplicationMaster/GetHgls";
export const CREATE_HGL_URI = "ApplicationMaster/CreateHgl";
export const UPDATE_HGL_URI = "ApplicationMaster/UpdateHgl";
export const GET_LOANTYPE_URI = "BillingMaster/GetLoanTypes";
export const CREATE_LOANTYPE_URI = "BillingMaster/CreateLoanType";
export const UPDATE_LOANTYPE_URI = "BillingMaster/UpdateLoanType";
export const GET_LOANSUBTYPES_URI = "BillingMaster/GetLoanSubType";
export const GET_SUBHGL_URI = "ApplicationMaster/GetSubHgl/";
export const GET_BILLPARAMSFORCATEGORY_URI = "ApplicationMaster/GetBillParameterForCategory";
export const GET_GETSEASONBILLINGRATES_URI = "ApplicationMaster/GetSeasonBillingRate";

export const GET_OFFERCODE_URI = "Monitoring/GetNewOfferNo";
export const CREATE_PLOT_OFFER_URI = "Monitoring/CreatePlotOffer";
export const UPDATE_PLOT_OFFER_URI = "Monitoring/UpdatePlotOffer";
export const GET_PLOT_OFFERS_URI = "Monitoring/GetPlotOffers";
export const IS_NEW_FARMAR_URI = "Monitoring/IsNewFarmer";
export const CREATE_PLOT_REPORT_URI = "Monitoring/CreatePlotReport";
export const UPDATE_PLOT_REPORT_URI = "Monitoring/UpdatePlotReport";
export const GET_PLOT_ALLOTMENTS_IN_SEASON_URI = "Monitoring/PlotAllotmentsInSeason";
export const GET_PLOT_REPORTS_URI = "Monitoring/GetPlotReports";
export const GET_PLOT_REORT_IN_SEASON_URI = "Monitoring/PlotReportsInSeason";

export const GET_PLOTASSESSMENT_URI = "Monitoring/GetPlotAssessements";
export const CREATE_PLOTASSESSMENT_URI = "Monitoring/CreateAssessedArea";
export const UPDATE_PLOTASSESSMENT_URI = "Monitoring/UpdateAssessedArea";
export  const GET_PLOT_REPORTINFO_URI ="Monitoring/PlotReportInfo";
export const GET_DOCCODE_URI = "Monitoring/GetNewDocNoForPlotTransfer";
export const CREATE_PLOTTRANSFER_URI = "Monitoring/CreatePlotTransfer";
export const UPDATE_PLOTTRANSFER_URI = "Monitoring/UpdatePlotTransfer";
export const GET_PLOTTRANSFER_URI = "Monitoring/GetPlotTransfers";

export const CREATE_COMPLETED_PLOT_URI = "Monitoring/CreateCompletedPlot";
export const UPDATE_COMPLETED_PLOT_URI = "Monitoring/UpdateCompletedPlot";
export const GET_COMPLETED_PLOTS_URI = "Monitoring/GetCompletedPlots";
export const GET_DONOFORCOMPLETEDPLOTS_URI = "Monitoring/GetNewDocNoForCompletedPlots";
export const GET_COMPLETED_PLOT_IN_SEASON_URI= "Monitoring/PlotAllotmentsInSeason";



export const GET_ALLOTTED_PLOT_URI = "Monitoring/AllottedPlot";
export const GET_PLOT_NUMBER_URI = "Monitoring/GetPlotNumber";
