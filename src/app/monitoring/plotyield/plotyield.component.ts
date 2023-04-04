import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Table } from 'primeng/table';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { LookupDetailDto, SeasonDto, SeasonViewDto } from 'src/app/_models/applicationmaster';
import {
  FarmerPlotYieldViewDto, MaintDiseaseDto, MaintenanceItems, MaintFertilizerDto, MaintPestDto, MaintWeedicideDto, PlotInfoDto,
  PlotsDto, PlotYieldViewDto
} from 'src/app/_models/monitoring';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { MonitoringService } from 'src/app/_services/monitoring.service';
import { CURRENT_SEASON } from 'src/environments/environment';

export interface IHeader {
  field: string;
  header: string;
  label: string;
}
@Component({
  selector: 'app-plotyield',
  templateUrl: './plotyield.component.html',
  styles: [
  ]
})

export class PlotyieldComponent implements OnInit {
  globalFilterFields: string[] = ["Season", "farmerCode", "farmerName", "farmerVillageName", "cropType", "offerNo", "plotVillageName", "fieldName",
    "surveyNo", "plotType", "reportedArea", "measuredArea", "netArea", "perishedArea", "notGrownArea", "isSeedArea", "agreementedArea", "harvestedArea", "poorCropArea", "plantType"
    , "plantingDate", "variety", "estimatedton", "birNumber", "birDate", "inspectionDate", "reasonForPerishedAreaId", "actionPlan", "divertedArea"];
  @ViewChild('filter') filter!: ElementRef;
  // seasons: SeasonViewDto[] = [];
  seasons!: any;
  currentSeasonCode?: string;
  currentSeason: SeasonDto = {};
  showDialog: boolean = false;
  submitLabel!: string;
  fbPlotYield!: FormGroup
  addFlag: boolean = true;
  plotInfo: PlotsDto = {};
  plotReports: PlotInfoDto[] = [];
  // plotReports: any[] = [];
  actionPlan: LookupDetailDto[] = [];
  perishedArea: LookupDetailDto[] = [];
  cropstypes: LookupDetailDto[] = [];
  weedstatus: LookupDetailDto[] = [];
  maintanenceItems?: MaintenanceItems = {};
  plotYields: FarmerPlotYieldViewDto[] = [];
  mediumDate: string = MEDIUM_DATE;
  checked!: boolean;
  activeIndex?= 0;
  activeIndex1?= 0;
  activeIndex2?= 0;
  permissions: any;

  farmerHeaders: IHeader[] = [
    { field: 'season', header: 'season', label: 'Season' },
    { field: 'farmerCode', header: 'farmerCode', label: 'Farmer Code' },
    { field: 'farmerName', header: 'farmerName', label: 'Farmer Name' },
    { field: 'farmerVillageName', header: 'farmerVillageName', label: 'Farmer Village' },
  ];

  plotHeaders: IHeader[] = [
    { field: 'cropType', header: 'cropType', label: 'Crop Type' },
    { field: 'offerNo', header: 'offerNo', label: 'Offer No' },
    { field: 'plotVillageName', header: 'plotVillageName', label: 'Plot Village' },
    { field: 'fieldName', header: 'fieldName', label: 'Field Name' },
    { field: 'plotNumber', header: 'plotNumber', label: ' Plot Number' },
    { field: 'surveyNo', header: 'surveyNo', label: 'Survey No' },
    { field: 'plotType', header: 'plotType', label: 'Plot Type' },
    { field: 'reportedArea', header: 'reportedArea', label: 'Reported Area' },
    { field: 'measuredArea', header: 'measuredArea', label: 'Measured Area' },
    { field: 'netArea', header: 'netArea', label: 'Net Area' },
    { field: 'perishedArea', header: 'perishedArea', label: 'Perished Area' },
    { field: 'notGrownArea', header: 'notGrownArea', label: 'Not Grown Area' },
    { field: 'isSeedArea', header: 'isSeedArea', label: 'Is Seed Area' },
    { field: 'agreementedArea', header: 'agreementedArea', label: 'Agreemented Area' },
    { field: 'harvestedArea', header: 'harvestedArea', label: 'Harvested Area' },
    { field: 'poorCropArea', header: 'poorCropArea', label: 'Poor Crop Area' },
    { field: 'plantType', header: 'plantType', label: 'Plant Type' },
    { field: 'plantingDate', header: 'plantingDate', label: 'Planting Date' },
    { field: 'variety', header: 'variety', label: 'Variety' },
    { field: 'estimatedton', header: 'estimatedton', label: 'Estimated Ton' },
    { field: 'birNumber', header: 'birNumber', label: 'Bir Number' },
    { field: 'birDate', header: 'birDate', label: 'Bir Date' },
    { field: 'inspectionDate', header: 'inspectionDate', label: 'Inspection Date' },
    { field: 'reasonForPerishedAreaId', header: 'reasonForPerishedAreaId', label: 'Perishal Reason' },
    { field: 'actionPlan', header: 'actionPlan', label: 'Action Plan' },
    { field: 'divertedArea', header: 'divertedArea', label: 'Divert To Others' },
  ];

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
    this.onSearch();
  }

  constructor(private formbuilder: FormBuilder,
    private appMasterService: AppMasterService,
    private monitoringService: MonitoringService,
    private lookupService: LookupService,
    private jwtService: JWTService) { }

  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    this.currentSeasonCode = CURRENT_SEASON()
    this.plotYieldForm();
    this.initSeasons();
    this.initCurrentSeasons();
    this.initActionPlan();
    this.initPerishedArea();
    this.initweedstatus();
    this.initCropType();
  }

  getMaintenanceItemsForAssessment(plotyieldId: number = -1) {
    this.monitoringService.GetMaintenanceItemsForAssessment(plotyieldId).subscribe((resp) => {
      this.maintanenceItems = resp as unknown as MaintenanceItems;
      this.initMaintanenceItems();
    });
  }

  initMaintanenceItems() {
    let weedicideArray = this.fbPlotYield.get("weedicides") as FormArray;

    this.maintanenceItems?.weedicides?.forEach(weedicide => {
      weedicideArray.push(this.createWeed(weedicide));
    })
    let fertilizerArray = this.fbPlotYield.get("fertilizers") as FormArray;

    this.maintanenceItems?.fertilizers?.forEach(fertilizer => {
      fertilizerArray.push(this.createFertlizer(fertilizer))
    })
    let pestArray = this.fbPlotYield.get("pests") as FormArray;

    this.maintanenceItems?.pests?.forEach(pest => {
      pestArray.push(this.createpests(pest))
    })
    let diseaseArray = this.fbPlotYield.get("diseases") as FormArray;

    this.maintanenceItems?.diseases?.forEach(disease => {
      diseaseArray.push(this.createDisease(disease))
    })
  }

  plotYieldForm() {
    this.fbPlotYield = this.formbuilder.group({
      plotYieldId: [null],
      seasonId: [null, (Validators.required)],
      plotId: [null, (Validators.required)],
      actionPlanId: [null, Validators.required],
      inspectionDate: [null, Validators.required],
      isSeedArea: [null],
      notGrownArea: [null],
      netArea: [null, (Validators.required)],
      reasonForPerishedAreaId: [null, (Validators.required)],
      divertedArea: [null],
      harvestArea: [null],
      poorCropArea: [null],
      perishedArea: [null, (Validators.required)],
      weedStatusId: [null],
      interCropingId: [null],
      hasMicroNutrientDeficiency: [null],
      isTrashMulchingDone: [null],
      isGapFillingDone: [null],
      weedicides: this.formbuilder.array([]),
      pests: this.formbuilder.array([]),
      fertilizers: this.formbuilder.array([]),
      diseases: this.formbuilder.array([]),
    })
  }

  get FormControls() {
    return this.fbPlotYield.controls;
  }

  initSeasons() {
    this.appMasterService.Getseason().subscribe((resp) => {
      this.seasons = resp as unknown as SeasonViewDto[];
    });
  }

  initActionPlan() {
    this.lookupService.ActionPlans().subscribe((resp) => {
      this.actionPlan = resp as unknown as LookupDetailDto[];
    });
  }

  initPerishedArea() {
    this.lookupService.PerishableReasons().subscribe((resp) => {
      this.perishedArea = resp as unknown as LookupDetailDto[];
    });
  }

  initCurrentSeasons() {
    this.appMasterService.CurrentSeason(this.currentSeasonCode!).subscribe((resp) => {
      this.currentSeason = resp as unknown as SeasonDto;
      this.initPlotReports(this.currentSeason.seasonId!);
      this.initPlotYields(this.currentSeason.seasonId!);
    });
  }

  getPlotinfo(plotId: number) {
    this.monitoringService.GetPlotsinfo(plotId).subscribe((resp) => {
      this.plotInfo = resp as unknown as PlotsDto;
      console.log(this.plotInfo)
    })
  }

  initPlotReports(season: number) {
    this.monitoringService.GetPlotsInSeasons(season, 'PlotYield').subscribe((resp) => {
      console.log(resp)
      this.plotReports = resp as any;
      // this.plotReports.forEach(s => {
      //   s.DisplayValue = `${s.plotNumber}-${s.farmerCode}-${s.farmerName}-${s.farmerVillage}`
      // })
    })
  }

  initCropType() {
    this.lookupService.Crops().subscribe((resp) => {
      this.cropstypes = resp as unknown as LookupDetailDto[];
    });
  }

  initweedstatus() {
    this.lookupService.WeedStatuses().subscribe((resp) => {
      this.weedstatus = resp as unknown as LookupDetailDto[];
    });
  }

  initPlotYields(seasonId: number) {
    let param1 = this.filter.nativeElement.value == "" ? null : this.filter.nativeElement.value;
    this.monitoringService.GetPlotYields(seasonId, param1).subscribe((resp) => {
      this.plotYields = resp as unknown as FarmerPlotYieldViewDto[];
      this.plotYields.forEach((farmer) => {
        farmer.objnetYieldPlots = JSON.parse(farmer.netYieldPlots) as PlotYieldViewDto[]
      })
    })
  }

  addPlotYield() {
    this.submitLabel = "Add Plot Yield";
    this.addFlag = true;
    this.showDialog = true;
    this.getMaintenanceItemsForAssessment();
  }

  onSearch() {
    this.initPlotYields(this.currentSeason.seasonId!);
  }

  getFormArrayControl(formGroupName: string): FormArray {
    return this.fbPlotYield.controls[formGroupName] as FormArray
  }

  createpests(pest: MaintPestDto): FormGroup {
    return this.formbuilder.group({
      plotPestId: [pest.plotPestId],
      pestId: [pest.pestId],
      plotAgreementId: [pest.plotAgreementId],
      name: [pest.name],
      remarks: [pest.remarks],
      identifiedDate: [pest.identifiedDate],
      controlDate: [pest.controlDate]
    })
  }

  createWeed(weed: MaintWeedicideDto): FormGroup {
    return this.formbuilder.group({
      plotWeedicideId: [weed.plotWeedicideId],
      weedicideId: [weed.weedicideId],
      plotAgreementId: [weed.plotAgreementId],
      name: [weed.name],
      checked: [weed.selected],
    });
  }

  createFertlizer(fertilizer: MaintFertilizerDto): FormGroup {
    return this.formbuilder.group({
      plotFertilizerId: [fertilizer.plotFertilizerId],
      fertilizerId: [fertilizer.fertilizerId],
      plotAgreementId: [fertilizer.plotAgreementId],
      name: [fertilizer.name],
      checked: [fertilizer.selected],
    });
  }

  createDisease(disease: MaintDiseaseDto): FormGroup {
    return this.formbuilder.group({
      plotDiseaseId: [disease.plotDiseaseId],
      diseaseId: [disease.diseaseId],
      plotAgreementId: [disease.plotAgreementId],
      name: [disease.name],
      remarks: [disease.remarks],
      identifiedDate: [disease.identifiedDate],
      controlDate: [disease.controlDate]
    })
  }

  ClearForm() {
    var temp = Object.assign({}, this.currentSeason);
    this.fbPlotYield.reset();
    this.plotInfo = {};
    (this.fbPlotYield.get("weedicides") as FormArray).clear();
    (this.fbPlotYield.get("fertilizers") as FormArray).clear();
    (this.fbPlotYield.get("pests") as FormArray).clear();
    (this.fbPlotYield.get("diseases") as FormArray).clear();
    this.activeIndex = this.activeIndex1 = this.activeIndex2 = 0;
    this.currentSeason = Object.assign({}, temp);
    this.fbPlotYield.get('seasonId')?.patchValue(this.currentSeason.seasonId);
  }

  onSubmit() {
    if (this.fbPlotYield.valid) {
    }
    else {
      this.fbPlotYield.markAllAsTouched();
    }
  }

}
