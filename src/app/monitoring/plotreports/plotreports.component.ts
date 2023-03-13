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
import { IAllottedPlotViewDto } from 'src/app/_models/monitoring';
import { ActivatedRoute } from '@angular/router';

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
  plotReports: IAllottedPlotViewDto[] = [];
  loading: boolean = false;
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
  offeredNo: any;
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
    { field: 'varietyName', header: 'varietyName', label: 'Variety' },
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
    let currentSeason = '2020-21';
    this.forapproval = this.activatedRoute.snapshot.params['paramUrl'] == ':forapproval';
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
    this.initCurrentSeason(currentSeason);
    this.allottedPlotForm();
  }

  getPlotAllotmentsInSeason(seasonId: number) {
    this.monitoringService.GetPlotAllotmentsInSeason(seasonId).subscribe((resp) => {
      this.offeredNo = resp;
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
      this.plotReports = resp as unknown as IAllottedPlotViewDto[];
      this.loading = false;
    });
  }

  onSearch() {
    this.initPlotReports(this.currentSeason.seasonId!);
  }

  allottedPlotForm() {
    this.fbPlotReport = this.formbuilder.group({
      plotReportId: [null],
      seasonId: ['', (Validators.required)],
      cropTypeId: ['', (Validators.required)],
      offerNo: ['', (Validators.required)],
      ryotNo: ['', (Validators.required)],
      ryotName: ['', (Validators.required)],
      fatherName: ['', (Validators.required)],
      farmerDivision: [''],
      farmerCircle: [''],
      farmerSection: [''],
      farmerVillage: ['', (Validators.required)],
      plotDivision: [''],
      plotCircle: [''],
      plotSection: [''],
      plotVillage: [''],
      caneAreaVillageId: ['', (Validators.required)],
      plantTypeId: ['', (Validators.required)],
      plotNumber: ['', (Validators.required)],
      surveyNo: ['', (Validators.required)],
      reportedArea: ['', (Validators.required)],
      plantingDate: ['', (Validators.required)],
      plantSubTypeId: ['', (Validators.required)],
      varietyId: ['', (Validators.required)],
      agreed: [''],
      fieldName: [''],
      birnumber: ['', (Validators.required)],
      birdate: ['', (Validators.required)],
      plotTypeId: ['', (Validators.required)],
      demoPlotArea: [''],
      seedMaterialUsedId: ['', (Validators.required)],
      soilTypeId: ['', (Validators.required)],
      isNeedHotWaterTreatment: [''],
      isDustingApplied: [''],
      isTrashMulchingDone: [''],
      spacingId: [''],
      isPreviouslyRedPlot: [''],
      isBasalFertilization: [''],
      previousCropId: ['', (Validators.required)], /* previousLandUseId name is changed To previousCropId */
      sourceOfIrrigationId: [''],
      isCompositeFormYard: [''],
      isFilterPressMud: [''],
      isGreenManures: [''],
      profile: [''],
      totalArea: [''],
      cultivatedArea: [''],
      isActive: [''],
      methodOfIrrigationId: ['', (Validators.required)],
      distanceFromPlot: [''],
      plantingMethodId: ['', (Validators.required)],

      allottedPlotId: [''],

    });
  }

  get FormControls() {
    return this.fbPlotReport.controls;
  }

  addPlotReport() {
    this.showDialog = true;
  }

  editPlotReport(plotReport: any) {
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
      this.fbPlotReport.value.offerDate = FORMAT_DATE(this.fbPlotReport.value.birdate);
      return
      this.savePlotReport().subscribe(resp => {
        if (resp) {
          // this.initPlotReports(this.currentSeason.seasonId!);
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
