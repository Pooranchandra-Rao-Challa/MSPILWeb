import { HttpEvent } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { LookupDetailDto, SeasonDto, SeasonViewDto } from 'src/app/_models/applicationmaster';
import {
  IFarmerPlotYieldViewDto, MaintDiseaseDto, MaintenanceItems, MaintFertilizerDto, MaintPestDto, MaintWeedicideDto, PlotAgreementDto, PlotInfoDto,
  PlotsDto, IPlotYieldViewDto
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
  currentSeason: SeasonDto = {};
  showDialog: boolean = false;
  submitLabel!: string;
  fbPlotYield!: FormGroup
  addFlag: boolean = true;
  plotInfo: PlotsDto = {};
  actionPlan: LookupDetailDto[] = [];
  perishedArea: LookupDetailDto[] = [];
  cropstypes: LookupDetailDto[] = [];
  weedstatus: LookupDetailDto[] = [];
  maintanenceItems?: MaintenanceItems = {};
  plotYields: IFarmerPlotYieldViewDto[] = [];
  mediumDate: string = MEDIUM_DATE;
  checked!: boolean;
  activeIndex?= 0;
  activeIndex1?= 0;
  activeIndex2?= 0;
  permissions: any;
  plotNumbers: PlotInfoDto[] = [];

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
    private jwtService: JWTService,
    private alertMessage: AlertMessage,) { }

  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    this.plotYieldForm();
    this.initSeasons();
    this.initCurrentSeasons(CURRENT_SEASON());
    this.initActionPlan();
    this.initPerishedArea();
    this.initweedstatus();
    this.initCropType();
  }

  getMaintenanceItemsForYield(plotyieldId: number = -1) {
    this.monitoringService.GetMaintenanceItemsForYield(plotyieldId).subscribe((resp) => {
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

  initCurrentSeasons(seasonCode: string) {
    this.appMasterService.CurrentSeason(seasonCode).subscribe((resp) => {
      this.currentSeason = resp as unknown as SeasonDto;
      this.initPlotYields(this.currentSeason.seasonId!);
      this.initPlotNumbers(this.currentSeason.seasonId!, -1);
    });
  }

  getPlotinfo(plotId: number) {
    this.monitoringService.GetPlotsinfo(plotId).subscribe((resp) => {
      this.plotInfo = resp as unknown as PlotsDto;
    })
  }

  initPlotNumbers(season: number, plotId: number) {
    this.plotNumbers = [];
    this.monitoringService.GetPlotsInSeason(season, 'PlotYield', plotId).subscribe((resp) => {
      this.plotNumbers = resp as unknown as PlotInfoDto[];
      if (plotId) {
        this.fbPlotYield.controls['plotId'].patchValue(plotId);
        this.fbPlotYield.controls['plotId'].disable();
      }
    });
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
      this.plotYields = resp as unknown as IFarmerPlotYieldViewDto[];
      this.plotYields.forEach((value) => {
        value.objNetYieldPlots = JSON.parse(value.netYieldPlots) as IPlotYieldViewDto[];
      });
    })
  }

  addPlotYield() {
    this.submitLabel = "Add Plot Yield";
    this.addFlag = true;
    this.showDialog = true;
    this.getMaintenanceItemsForYield();
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
      plotYieldId: [pest.plotYieldId],
      name: [pest.name],
      remarks: [pest.remarks],
      identifiedDate: [pest.identifiedDate && new Date(pest.identifiedDate)],
      controlDate: [pest.controlDate && new Date(pest.controlDate)]
    })
  }

  onRowExpand(source: any) {
    var data = source.data as IFarmerPlotYieldViewDto;
    this.monitoringService.GetFarmerPlotsInYield(data.seasonId, data.farmerId).subscribe(resp => {
      data.objNetYieldPlots = resp as unknown as IPlotYieldViewDto[];
    });
  }

  createWeed(weed: MaintWeedicideDto): FormGroup {
    return this.formbuilder.group({
      plotWeedicideId: [weed.plotWeedicideId],
      weedicideId: [weed.weedicideId],
      plotYieldId: [weed.plotYieldId],
      name: [weed.name],
      checked: [weed.selected],
    });
  }

  createFertlizer(fertilizer: MaintFertilizerDto): FormGroup {
    return this.formbuilder.group({
      plotFertilizerId: [fertilizer.plotFertilizerId],
      fertilizerId: [fertilizer.fertilizerId],
      plotYieldId: [fertilizer.plotYieldId],
      name: [fertilizer.name],
      checked: [fertilizer.selected],
    });
  }

  createDisease(disease: MaintDiseaseDto): FormGroup {
    return this.formbuilder.group({
      plotDiseaseId: [disease.plotDiseaseId],
      diseaseId: [disease.diseaseId],
      plotYieldId: [disease.plotYieldId],
      name: [disease.name],
      remarks: [disease.remarks],
      identifiedDate: [disease.identifiedDate && new Date(disease.identifiedDate)],
      controlDate: [disease.controlDate && new Date(disease.controlDate)]
    })
  }

  editPlotYield(plotYield: IPlotYieldViewDto) {
    this.initPlotNumbers(this.currentSeason.seasonId!, plotYield.plotId);
    this.fbPlotYield.controls['seasonId'].setValue(this.currentSeason.seasonId!);
    this.fbPlotYield.controls['seasonId'].disable();
    this.fbPlotYield.patchValue(plotYield);
    this.fbPlotYield.controls['inspectionDate'].setValue(plotYield.inspectionDate && new Date(plotYield.inspectionDate?.toString() + ""));
    this.getPlotinfo(plotYield.plotId);
    this.getMaintenanceItemsForYield(plotYield.plotYieldId);

    this.addFlag = false;
    this.submitLabel = 'Update Plot Yield';
    this.showDialog = true;
  }

  savePlotYield(): Observable<HttpEvent<PlotAgreementDto>> {
    var postValues = this.fbPlotYield.value;
    postValues.weedicides = postValues.weedicides.filter((weed: any) => weed.checked == true)
    postValues.pests = postValues.pests.filter((pest: any) => pest.identifiedDate != undefined || pest.controlDate != undefined)
    postValues.fertilizers = postValues.fertilizers.filter((fertilizer: any) => fertilizer.checked == true)
    postValues.diseases = postValues.diseases.filter((disease: any) => disease.identifiedDate != undefined || disease.controlDate != undefined)
    if (this.addFlag) return this.monitoringService.CreatePlotYield(postValues)
    else return this.monitoringService.UpdatePlotYield(postValues)
  }

  onSubmit() {
    if (this.fbPlotYield.valid) {
      this.fbPlotYield.controls['seasonId'].enable();
      this.fbPlotYield.controls['plotId'].enable();
      this.savePlotYield().subscribe(resp => {
        if (resp) {
          this.initPlotYields(this.currentSeason.seasonId!);
          this.fbPlotYield.reset();
          this.showDialog = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMOPY001" : "SMOPY002"]);
        }
      });
    }
    else {
      this.fbPlotYield.markAllAsTouched();
    }
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

}
