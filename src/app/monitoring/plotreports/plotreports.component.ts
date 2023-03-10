import { AppMasterService } from 'src/app/_services/appmaster.service';
import { GeoMasterService } from './../../_services/geomaster.service';
import { LookupService } from './../../_services/lookup.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CommonService } from './../../_services/common.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { PlantSubTypeViewDto, plantTypeViewDto, SeasonDto, VarietyViewDto } from 'src/app/_models/applicationmaster';
import { VillagesViewDto } from 'src/app/_models/geomodels';

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
  plotReports: any;
  loading: boolean = false;
  globalFilterFields: any;
  @ViewChild('filter') filter!: ElementRef;
  seasons!: any[];
  cropTypes!: any[];
  currentSeason: SeasonDto = {};
  showDialog: boolean = false;
  fbPlotReport!: FormGroup;
  submitLabel: string = 'Add Plot Report';
  villages: VillagesViewDto[] = [];
  plantTypes: plantTypeViewDto[] = [];
  varieties: VarietyViewDto[] = [];
  plotTypes: any;
  seedMaterialUsed: any;
  plantSubTypes: PlantSubTypeViewDto[] = [];
  /* Later I will create model for lookups dropdown */
  soilTypes: any;
  spacingInfo: any;
  sourceofIrrigations: any;
  methodofIrrigations: any;
  plantingMethods: any;
  headers: IHeader[] = [
    { field: 'crop', header: 'crop', label: 'Crop' },
    { field: 'season', header: 'season', label: 'Season' },
    { field: 'cropType', header: 'cropType', label: 'Crop Type' },
    { field: 'offeredNo', header: 'offeredNo', label: 'Offered No' },
    { field: 'farmerCode', header: 'farmerCode', label: 'Farmer Code' },
    { field: 'farmerVillage', header: 'farmerVillage', label: 'Farmer Village' },
    { field: 'plotVillageName', header: 'plotVillageName', label: 'Plot Village' },
    { field: 'plantType', header: 'plantType', label: 'Plant Type' },
    { field: 'plotNo', header: 'plotNo', label: 'Plot No' },
    { field: 'surveyNo', header: 'surveyNo', label: 'Survey No' },
    { field: 'plantingDate', header: 'plantingDate', label: 'Planting Date' },
    { field: 'variety', header: 'variety', label: 'Variety' },
    { field: 'fieldName', header: 'fieldName', label: 'Field Name' },
    { field: 'plotType', header: 'plotType', label: 'Plot Type' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdDate', header: 'createdDate', label: 'Created Date' },
    { field: 'updatedDate', header: 'updatedDate', label: 'Updated Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ];
  constructor(private formbuilder: FormBuilder,
    private commonService: CommonService,
    private appMasterService: AppMasterService,
    private lookupService: LookupService,
    private geoMasterService: GeoMasterService) { }

  ngOnInit() {
    let currentSeason = '2020-21';
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
    this.initSourceofIrrigations();
    this.initMethodofIrrigations();
    this.initPlantingMethods();
    this.initCurrentSeason(currentSeason);
    this.allottedPlotForm();
  }

  initSeasons() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp as any;
    });
  }

  initCropTypes() {
    this.lookupService.CropTypes().subscribe((resp) => {
      this.cropTypes = resp as any;
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
      this.plotTypes = resp as any;
    });
  }

  initSeedMaterialUsed() {
    this.lookupService.SeedMaterialUsed().subscribe((resp) => {
      this.seedMaterialUsed = resp as any;
    });
  }

  initPlantSubTypes() {
    this.appMasterService.GetPlantSubType().subscribe((resp) => {
      this.plantSubTypes = resp as unknown as PlantSubTypeViewDto[];
    });
  }

  initSoilTypes() {
    this.lookupService.SoilTypes().subscribe((resp) => {
      this.soilTypes = resp as any;
    });
  }

  initSpacingInfo() {
    this.lookupService.SpacingInfo().subscribe((resp) => {
      this.spacingInfo = resp as any;
    });
  }

  initSourceofIrrigations() {
    this.lookupService.SourceofIrrigations().subscribe((resp) => {
      this.sourceofIrrigations = resp as any;
    });
  }

  initMethodofIrrigations() {
    this.lookupService.MethodofIrrigations().subscribe((resp) => {
      this.methodofIrrigations = resp as any;
    });
  }

  initPlantingMethods() {
    this.lookupService.PlantingMethods().subscribe((resp) => {
      this.plantingMethods = resp as any;
    });
  }

  initCurrentSeason(seasonCode: string) {
    this.appMasterService.CurrentSeason(seasonCode).subscribe((resp) => {
      this.currentSeason = resp as SeasonDto;
      this.initSeasons();
      this.initPlotReports(this.currentSeason.seasonId!);
    });
  }

  initPlotReports(seasonId: number) { }

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
      plotNo: ['', (Validators.required)],
      surveyNo: ['', (Validators.required)],
      reportedArea: ['', (Validators.required)],
      plantingDate: ['', (Validators.required)],
      plantSubTypeId: ['', (Validators.required)],
      varietyId: ['', (Validators.required)],
      agreed: [''],
      fieldName: [''],
      birNo: ['', (Validators.required)],
      birDate: ['', (Validators.required)],
      plotTypeId: ['', (Validators.required)],
      demoPlotArea: [''],
      seedMaterialUsedId: ['', (Validators.required)],
      soilType: ['', (Validators.required)],
      settsHotWaterTreatment: [''],
      dustApplied: [''],
      trashMulching: [''],
      spacingId: [''],
      previousRedPlot: [''],
      basalFertilization: [''],
      previousLandUseId: ['', (Validators.required)],
      sourceOfIrrigationId: [''],
      compositeFormYard: [''],
      filterPressMud: [''],
      greenManures: [''],
      profile: [''],
      totalArea: [''],
      cultivatedArea: [''],
      isActive: [''],
      methodOfIrrigationId: ['', (Validators.required)],
      distanceFromPlot: [''],
      plantingMethodId: ['', (Validators.required)]
    });
  }

  get FormControls() {
    return this.fbPlotReport.controls;
  }

  addPlotReport() {
    this.showDialog = true;
  }

  onSearch() { }

  editPlotReport(plotReport: any) { }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  onSubmit() {
    if (this.fbPlotReport.valid) {

    }
    else {
      this.fbPlotReport.markAllAsTouched();
    }
  }

}
