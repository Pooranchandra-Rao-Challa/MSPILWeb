import { MonitoringService } from 'src/app/_services/monitoring.service';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from 'src/app/_services/common.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LookupDetailViewDto, PlantSubTypeViewDto, plantTypeViewDto, SeasonDto, VarietyViewDto } from 'src/app/_models/applicationmaster';
import { VillagesViewDto } from 'src/app/_models/geomodels';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { FORMAT_DATE } from 'src/app/_helpers/date.format.pipe';
import { ActivatedRoute } from '@angular/router';
import { IPlotReportViewDto, PlotReportDto } from 'src/app/_models/monitoring';

export interface IHeader {
  field: string;
  header: string;
  label: string;
}

@Component({
  selector: 'app-plotreports',
  templateUrl: './plotreports.component.html',
  styles: [
  ]
})
export class PlotreportsComponent implements OnInit {
  plotReports: IPlotReportViewDto[] = [];
  plotReport: PlotReportDto = new PlotReportDto();
  addFlag: boolean = true;
  globalFilterFields: any;
  @ViewChild('filter') filter!: ElementRef;
  seasons!: any;
  currentSeason: SeasonDto = {};
  showDialog: boolean = false;
  fbPlotReport!: FormGroup;
  submitLabel: string = 'Add Plot Report';
  villages: VillagesViewDto[] = [];
  plantTypes: plantTypeViewDto[] = [];
  varieties: VarietyViewDto[] = [];
  soilTypes: LookupDetailViewDto[] = [];
  spacingInfo: LookupDetailViewDto[] = [];
  sourceofIrrigations: LookupDetailViewDto[] = [];
  methodofIrrigations: LookupDetailViewDto[] = [];
  plantingMethods: LookupDetailViewDto[] = [];
  crops: LookupDetailViewDto[] = [];
  plotTypes: LookupDetailViewDto[] = [];
  seedMaterialUsed: LookupDetailViewDto[] = [];
  plantSubTypes: PlantSubTypeViewDto[] = [];
  cropTypes: LookupDetailViewDto[] = [];
  forapproval: boolean = false;
  offeredNo: any[] = [];
  allottedPlotByAllottedPlotId: any;
  headers: IHeader[] = [
    { field: 'previousCrop', header: 'previousCrop', label: 'Crop' },
    { field: 'season', header: 'season', label: 'Season' },
    { field: 'cropType', header: 'cropType', label: 'Crop Type' },
    { field: 'offerNo', header: 'offerNo', label: 'Offered No' },
    { field: 'farmerCode', header: 'farmerCode', label: 'Farmer Code' },
    { field: 'farmerVillageName', header: 'farmerVillageName', label: 'Farmer Village' },
    { field: 'plotVillageName', header: 'plotVillageName', label: 'Plot Village' },
    { field: 'plantType', header: 'plantType', label: 'Plant Type' },
    { field: 'plotNumber', header: 'plotNumber', label: 'Plot No' },
    { field: 'surveyNo', header: 'surveyNo', label: 'Survey No' },
    { field: 'plantingDate', header: 'plantingDate', label: 'Planting Date' },
    { field: 'expectedVariety', header: 'expectedVariety', label: 'Variety' },
    { field: 'fieldName', header: 'fieldName', label: 'Field Name' },
    { field: 'plotType', header: 'plotType', label: 'Plot Type' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ];
  constructor(private formbuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private appMasterService: AppMasterService,
    private lookupService: LookupService,
    private geoMasterService: GeoMasterService,
    private monitoringService: MonitoringService) { }

  ngOnInit() {
    this.forapproval = this.activatedRoute.snapshot.params['paramUrl'] == ':forapproval';
    this.initCurrentSeason(this.CurrentSeasonCode);
    this.initSeasons();
    this.initCropTypes();
    this.initVillages();
    this.initPlantTypes();
    this.initVarieties();
    this.initPlotTypes();
    this.initSeedMaterialUsed();
    this.initPlantSubTypes();
    this.initSoilTypes();
    this.initSpacingInfo();
    this.initCrops();
    this.initSourceofIrrigations();
    this.initMethodofIrrigations();
    this.initPlantingMethods();
    this.allottedPlotForm();
  }

  get CurrentSeasonCode() : string {
    let fullYear = new Date().getFullYear();
    let shortYear = parseInt(fullYear.toString().substring(2, 4));
    let month = new Date().getMonth();
    if (month >= 10) {
      return `${fullYear}-${shortYear+1}`;
    }
    else {
      return `${fullYear-1}-${shortYear}`;
    }
  }

  getPlotAllotmentsInSeason(seasonId: number) {
    this.monitoringService.GetPlotsInSeason(seasonId,'Reported').subscribe((resp) => {
      this.offeredNo = resp as any;
    });
  }


  getAllottedPlotByAllottedPlotId(offerNo: number) {
    this.offeredNo.forEach((value) => {
      if (value.offerNo == offerNo) {
        this.fbPlotReport.controls['allottedPlotId'].setValue(value.allottedPlotId);
      }
    });
    this.monitoringService.GetAllottedPlotByAllottedPlotId(this.fbPlotReport.controls['allottedPlotId'].value).subscribe((resp) => {
      this.allottedPlotByAllottedPlotId = resp as any;
      if (this.allottedPlotByAllottedPlotId) {
        this.fbPlotReport.controls['farmerId'].setValue(this.allottedPlotByAllottedPlotId[0]?.farmerId);
        this.fbPlotReport.controls['farmerName'].setValue(this.allottedPlotByAllottedPlotId[0]?.farmerName);
        this.fbPlotReport.controls['fatherName'].setValue(this.allottedPlotByAllottedPlotId[0]?.fatherName);
        this.fbPlotReport.controls['farmerDivision'].setValue(this.allottedPlotByAllottedPlotId[0]?.divisionName);
        this.fbPlotReport.controls['farmerCircle'].setValue(this.allottedPlotByAllottedPlotId[0]?.circleName);
        this.fbPlotReport.controls['farmerSection'].setValue(this.allottedPlotByAllottedPlotId[0]?.sectionName);
        this.fbPlotReport.controls['farmerVillage'].setValue(this.allottedPlotByAllottedPlotId[0]?.villageName);
        this.fbPlotReport.controls['plotDivision'].setValue(this.allottedPlotByAllottedPlotId[0]?.divisionName);
        this.fbPlotReport.controls['plotCircle'].setValue(this.allottedPlotByAllottedPlotId[0]?.circleName);
        this.fbPlotReport.controls['plotSection'].setValue(this.allottedPlotByAllottedPlotId[0]?.sectionName);
        this.fbPlotReport.controls['plotVillageName'].setValue(this.allottedPlotByAllottedPlotId[0]?.villageName);
        this.getPlotNumber(this.fbPlotReport.controls['allottedPlotId'].value);
      }
    });
  }

  getPlotNumber(allottedPlotId: number) {
    this.monitoringService.GetPlotNumber(allottedPlotId).subscribe((resp) => {
      let plotNumber = resp;
      this.fbPlotReport.controls['plotNumber'].setValue(plotNumber);
    });
  }

  initSeasons() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp as any;
    });
  }

  initCropTypes() {
    this.lookupService.CropTypes().subscribe((resp) => {
      this.cropTypes = resp as unknown as LookupDetailViewDto[];
    });
  }

  initVillages() {
    this.geoMasterService.GetVillage().subscribe((resp) => {
      this.villages = resp as unknown as VillagesViewDto[];
    });
  }

  initPlantTypes() {
    this.appMasterService.GetPlantType().subscribe((resp) => {
      this.plantTypes = resp as unknown as plantTypeViewDto[];
    });
  }

  initVarieties() {
    this.appMasterService.GetVarieties().subscribe((resp) => {
      this.varieties = resp as unknown as VarietyViewDto[];
    });
  }

  initPlotTypes() {
    this.lookupService.PlotTypes().subscribe((resp) => {
      this.plotTypes = resp as unknown as LookupDetailViewDto[];
    });
  }

  initSeedMaterialUsed() {
    this.lookupService.SeedMaterialUsed().subscribe((resp) => {
      this.seedMaterialUsed = resp as unknown as LookupDetailViewDto[];
    });
  }

  initPlantSubTypes() {
    this.appMasterService.GetPlantSubType().subscribe((resp) => {
      this.plantSubTypes = resp as unknown as PlantSubTypeViewDto[];
    });
  }

  initSoilTypes() {
    this.lookupService.SoilTypes().subscribe((resp) => {
      this.soilTypes = resp as unknown as LookupDetailViewDto[];
    });
  }

  initSpacingInfo() {
    this.lookupService.SpacingInfo().subscribe((resp) => {
      this.spacingInfo = resp as unknown as LookupDetailViewDto[];
    });
  }

  initCrops() {
    /* Here Crops means Previous Land Use */
    this.lookupService.Crops().subscribe((resp) => {
      this.crops = resp as unknown as LookupDetailViewDto[];
    });
  }

  initSourceofIrrigations() {
    this.lookupService.SourceofIrrigations().subscribe((resp) => {
      this.sourceofIrrigations = resp as unknown as LookupDetailViewDto[];
    });
  }

  initMethodofIrrigations() {
    this.lookupService.MethodofIrrigations().subscribe((resp) => {
      this.methodofIrrigations = resp as unknown as LookupDetailViewDto[];
    });
  }

  initPlantingMethods() {
    this.lookupService.PlantingMethods().subscribe((resp) => {
      this.plantingMethods = resp as unknown as LookupDetailViewDto[];
    });
  }

  initCurrentSeason(seasonCode: string) {
    this.appMasterService.CurrentSeason(seasonCode).subscribe((resp) => {
      this.currentSeason = resp as SeasonDto;
      this.initSeasons();
      this.initPlotReports(this.currentSeason.seasonId!);
    });
  }

  initPlotReports(seasonId: number) {
    let param1 = this.filter.nativeElement.value == "" ? null : this.filter.nativeElement.value;
    this.monitoringService.GetPlotReports(seasonId, this.forapproval, param1).subscribe((resp) => {
      this.plotReports = resp as unknown as IPlotReportViewDto[];
    });
  }

  onSearch() {
    this.initPlotReports(this.currentSeason.seasonId!);
  }

  allottedPlotForm() {
    this.fbPlotReport = this.formbuilder.group({
      plotReportId: [null],
      allottedPlotId: [''],
      seasonId: ['', (Validators.required)],
      cropTypeId: ['', (Validators.required)],
      offerNo: ['', (Validators.required)],
      farmerId: [{ value: '', disabled: true }, (Validators.required)],
      farmerName: [{ value: '', disabled: true }, (Validators.required)],
      fatherName: [{ value: '', disabled: true }, (Validators.required)],
      farmerDivision: [{ value: '', disabled: true }],
      farmerCircle: [{ value: '', disabled: true }],
      farmerSection: [{ value: '', disabled: true }],
      farmerVillage: [{ value: '', disabled: true }, (Validators.required)],
      plotDivision: [{ value: '', disabled: true }],
      plotCircle: [{ value: '', disabled: true }],
      plotSection: [{ value: '', disabled: true }],
      // plotVillage: [''],
      plotVillageName: [{ value: '', disabled: true }, (Validators.required)],
      plantTypeId: ['', (Validators.required)],
      plotNumber: [{ value: '', disabled: true }, (Validators.required)],
      surveyNo: ['', (Validators.required)],
      reportedArea: ['', (Validators.required)],
      plantingDate: ['', (Validators.required)],
      plantSubTypeId: ['', (Validators.required)],
      varietyId: ['', (Validators.required)],
      agreed: [{ value: '', disabled: true }],
      fieldName: [''],
      birnumber: ['', (Validators.required)],
      birdate: ['', (Validators.required)],
      plotTypeId: ['', (Validators.required)],
      demoPlotArea: [''],
      seedMaterialUsedId: ['', (Validators.required)],
      soilTypeId: ['', (Validators.required)],
      isNeedHotWaterTreatment: [null],
      isDustingApplied: [null],
      isTrashMulchingDone: [null],
      spacingId: [''],
      isPreviouslyRedPlot: [null],
      isBasalFertilization: [null],
      previousCropId: ['', (Validators.required)], /* previousLandUseId name is changed To previousCropId */
      sourceOfIrrigationId: [''],
      isCompositeFormYard: [null],
      isFilterPressMud: [null],
      isGreenManures: [null],
      profile: [''],
      totalArea: [''],
      cultivatedArea: [null],
      isActive: [false],
      methodOfIrrigationId: ['', (Validators.required)],
      distanceFromPlot: [''],
      plantingMethodId: ['', (Validators.required)],


    });
  }

  get FormControls() {
    return this.fbPlotReport.controls;
  }

  addPlotReport() {
    this.fbPlotReport.controls['seasonId'].enable();
    this.fbPlotReport.controls['offerNo'].enable();
    this.fbPlotReport.controls['seasonId'].setValue(this.currentSeason.seasonId);
    this.getPlotAllotmentsInSeason(this.currentSeason.seasonId || 0);

    this.showDialog = true;
  }

  editPlotReport(plotReport: IPlotReportViewDto) {
    this.getPlotAllotmentsInSeason(plotReport.seasonId);
    this.fbPlotReport.controls['seasonId'].disable();
    this.fbPlotReport.controls['offerNo'].setValue(plotReport.offerNo);
    this.fbPlotReport.controls['offerNo'].disable();
    this.fbPlotReport.controls['farmerId'].setValue(plotReport.farmerId);
    this.fbPlotReport.controls['farmerName'].setValue(plotReport.farmerName);
    this.fbPlotReport.controls['fatherName'].setValue(plotReport.fatherName);
    this.fbPlotReport.controls['farmerDivision'].setValue(plotReport.farmerDivisionName);
    this.fbPlotReport.controls['farmerCircle'].setValue(plotReport.farmerCircleName);
    this.fbPlotReport.controls['farmerSection'].setValue(plotReport.farmerSectionName);
    this.fbPlotReport.controls['farmerVillage'].setValue(plotReport.farmerVillageName);
    this.fbPlotReport.controls['plotDivision'].setValue(plotReport.plotDivisionName);
    this.fbPlotReport.controls['plotCircle'].setValue(plotReport.plotCircleName);
    this.fbPlotReport.controls['plotSection'].setValue(plotReport.plotSectionName);
    this.fbPlotReport.controls['plotVillageName'].setValue(plotReport.plotVillageName);

    this.fbPlotReport.controls['plantingDate'].setValue(new Date(plotReport.plantingDate?.toString() + ""));
    this.fbPlotReport.controls['birnumber'].setValue(plotReport.birNumber);
    this.fbPlotReport.controls['birdate'].setValue(new Date(plotReport.birDate?.toString() + ""));

    this.fbPlotReport.patchValue(plotReport);

    this.addFlag = false;
    this.submitLabel = 'Update Plot Report';
    this.showDialog = true;
  }

  editApproval(plotReport: any) {

  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  savePlotReport(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.monitoringService.CreatePlotReport(this.fbPlotReport.value)
    else return this.monitoringService.UpdatePlotReport(this.fbPlotReport.value)
  }

  onSubmit() {
    if (this.fbPlotReport.valid) {
      this.fbPlotReport.value.plantingDate = FORMAT_DATE(this.fbPlotReport.value.plantingDate);
      this.fbPlotReport.value.birdate = FORMAT_DATE(this.fbPlotReport.value.birdate);
      this.savePlotReport().subscribe(resp => {
        if (resp) {
          this.initPlotReports(this.currentSeason.seasonId!);
          this.fbPlotReport.reset();
          this.showDialog = false;
        }
      })
    }
    else {
      this.fbPlotReport.markAllAsTouched();
    }
  }

}
