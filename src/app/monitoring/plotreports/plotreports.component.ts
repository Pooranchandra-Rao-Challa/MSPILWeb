import { IPlotOfferViewDto } from 'src/app/_models/monitoring';
import { MonitoringService } from 'src/app/_services/monitoring.service';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { CommonService } from 'src/app/_services/common.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { LookupDetailViewDto, PlantSubTypeViewDto, plantTypeViewDto, SeasonDto, VarietyViewDto } from 'src/app/_models/applicationmaster';
import { VillagesViewDto } from 'src/app/_models/geomodels';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { FORMAT_DATE } from 'src/app/_helpers/date.format.pipe';
import { ActivatedRoute } from '@angular/router';
import { IFarmerInPlotReportsViewDto, IPlotReportViewDto, PlotReportDto } from 'src/app/_models/monitoring';
import { JWTService } from 'src/app/_services/jwt.service';
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { LazyLoadEvent } from 'primeng/api';
import { ITableHeader } from 'src/app/_models/common';
import { RG_ALPHA_NUMERIC, RG_SURVEY_NO } from 'src/app/_shared/regex';

@Component({
  selector: 'app-plotreports',
  templateUrl: './plotreports.component.html',
  styles: [
  ]
})
export class PlotreportsComponent implements OnInit {
  plotReports: IFarmerInPlotReportsViewDto[] = [];
  plotReport: PlotReportDto = new PlotReportDto();
  addFlag: boolean = true;
  globalFilterFields: any;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild('dtPlotReports') dtPlotReports!: Table;
  seasons!: any[];
  currentSeason: SeasonDto = {};
  showDialog: boolean = false;
  showApprovalDialog: boolean = false;
  approveOrDenyFlag?: boolean;
  fbPlotReport!: FormGroup;
  submitLabel!: string;
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
  seasonPlotOffers: any[] = [];
  plotOffer: any;
  plotOfferDto: IPlotOfferViewDto = {}
  autoDisplayDrowdown: boolean = false;
  permissions: any;
  selectAll: boolean = false;
  selectedplotReports: IFarmerInPlotReportsViewDto[] = [];
  totalRecords: number = 0;
  loading: boolean = false;
  plantFrom!: Date;
  plantTo!: Date;

  farmerHeaders: ITableHeader[] = [
    { field: 'seasonCode', header: 'seasonCode', label: 'Season' },
    { field: 'farmerCode', header: 'farmerCode', label: 'Farmer Code' },
    { field: 'farmerName', header: 'farmerName', label: 'Farmer Name' },
    { field: 'farmerVillageName', header: 'farmerVillageName', label: 'Farmer Village' },
  ];

  plotHeaders: ITableHeader[] = [
    { field: 'plotNumber', header: 'plotNumber', label: 'Plot No' },
    { field: 'plotVillageName', header: 'plotVillageName', label: 'Plot Village' },
    { field: 'plantingDate', header: 'plantingDate', label: 'Planting Date' },
    { field: 'previousCropName', header: 'previousCropName', label: 'Previous Crop' },
    { field: 'cropTypeName', header: 'cropTypeName', label: 'Crop Type' },
    { field: 'offerNo', header: 'offerNo', label: 'Offer No' },
    { field: 'plantTypeName', header: 'plantTypeName', label: 'Plant Type' },
    { field: 'surveyNo', header: 'surveyNo', label: 'Survey No' },
    { field: 'varietyName', header: 'varietyName', label: 'Variety' },
    { field: 'plotTypeName', header: 'plotTypeName', label: 'Plot Type' },
    { field: 'fieldName', header: 'fieldName', label: 'Field Name' },
  ];
  currentSeasonId?: number;

  constructor(private formbuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private commonService: CommonService,
    private appMasterService: AppMasterService,
    private lookupService: LookupService,
    private geoMasterService: GeoMasterService,
    private monitoringService: MonitoringService,
    private jwtService: JWTService,
    private alertMessage: AlertMessage,) { }

  ngOnInit() {
    this.permissions = this.jwtService.Permissions;
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

  get CurrentSeasonCode(): string {
    let fullYear = new Date().getFullYear();
    let shortYear = parseInt(fullYear.toString().substring(2, 4));
    let month = new Date().getMonth();
    if (month >= 10) {
      return `${fullYear}-${shortYear + 1}`;
    }
    else {
      return `${fullYear - 1}-${shortYear}`;
    }
  }

  clearForm() {
    this.fbPlotReport.reset();
    this.plotOfferDto = {};
  }

  getPlotOffersInSeason(seasonId: number, plotId: number) {
    this.plotOfferDto = {};
    this.fbPlotReport.controls["plantingDate"].setValue(null);
    this.fbPlotReport.controls["farmerId"].setValue(null);
    this.fbPlotReport.controls["varietyId"].setValue(null);
    this.fbPlotReport.controls["plantTypeId"].setValue(null);
    this.mainPlot.get('villageId')?.setValue(null);
    this.monitoringService.PlotOffersInSeason(seasonId, plotId).subscribe((resp) => {
      this.seasonPlotOffers = resp as any;
      this.seasonPlotOffers.forEach(s => {
        s.DisplayValue = `${s.offerNo}-${s.farmerCode}-${s.farmerName}-${s.plotVillageName}`
      });
     this.seasons?.forEach((value) => {
        if (value.seasonId == seasonId) {
          this.plantFrom = value.plantFrom && new Date(value.plantFrom?.toString() + "");
          this.plantTo = value.plantTo && new Date(value.plantTo?.toString() + "");
        }
      });
    });
  }


  getOfferInfo(plotOfferId: number) {
    this.plotOfferDto = {};
    this.monitoringService.GetOfferInfo(plotOfferId).subscribe((resp) => {
      let plotOffer2 = resp as any;
      if (plotOffer2 && plotOffer2.length) {
        this.plotOfferDto = plotOffer2[0];
        this.fbPlotReport.controls['farmerId'].setValue(this.plotOfferDto.farmerId);
        this.mainPlot.get('villageId')?.setValue(this.plotOfferDto.plotVillageId);
        this.fbPlotReport.controls['varietyId'].setValue(this.plotOfferDto.expectedVarietyId);
        this.fbPlotReport.patchValue(this.plotOfferDto);
        this.getPlotNumber(plotOfferId);
      }
    });
  }

  getPlotNumber(plotOfferId: number) {
    this.monitoringService.GetPlotNumber(plotOfferId).subscribe((resp) => {
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
      this.currentSeasonId = this.currentSeason.seasonId;
      this.initSeasons();
      this.initPlotReports(this.currentSeason.seasonId!);
    });
  }

  initPlotReports(seasonId: number) {
    this.dtPlotReports.expandedRowKeys = {};
    let param1 = this.filter.nativeElement.value == "" ? null : this.filter.nativeElement.value;
    this.monitoringService.GetPlotReports(seasonId, this.forapproval, param1).subscribe((resp) => {
      this.plotReports = resp as unknown as IFarmerInPlotReportsViewDto[];
    });
  }

  onRowExpand(source: any) {
    var data = source.data as IFarmerInPlotReportsViewDto;
    this.monitoringService.GetFarmerPlotsInReport(data.seasonId, data.farmerId).subscribe(resp => {
      data.objReportedPlots = resp as unknown as IPlotReportViewDto[];
      console.log('plots' , data.objReportedPlots);
    });
  }

  onSearch() {
    this.dtPlotReports.expandedRowKeys = {};
    this.initPlotReports(this.currentSeason.seasonId!);
  }

  allottedPlotForm() {
    this.fbPlotReport = this.formbuilder.group({
      plotReportId: [null],
      plotId: [null],
      seasonId: [null, (Validators.required)],
      cropTypeId: [null, (Validators.required)],
      plotOfferId: [null, (Validators.required)],
      farmerId: [null],
      farmerName: [{ value: '', disabled: false }],
      fatherName: [{ value: '', disabled: false }],
      farmerDivision: [{ value: '', disabled: false }],
      farmerCircle: [{ value: '', disabled: false }],
      farmerSection: [{ value: '', disabled: false }],
      farmerVillage: [{ value: '', disabled: false }],
      plotDivision: [{ value: '', disabled: false }],
      plotCircle: [{ value: '', disabled: false }],
      plotSection: [{ value: '', disabled: false }],
      plotVillageName: [{ value: '', disabled: true }],

      plantTypeId: [null, (Validators.required)],
      plotNumber: [null, (Validators.required)],
      surveyNo: new FormControl(null, [Validators.required, Validators.pattern(RG_SURVEY_NO)]),
      reportedArea: [null, (Validators.required)],
      plantingDate: [null, (Validators.required)],
      plantSubTypeId: [null, (Validators.required)],
      varietyId: [null, (Validators.required)],
      agreed: [{ value: null, disabled: true }],
      fieldName: [null],
      birnumber: [null, ],
      birdate: [null, ],
      plotTypeId: [null, (Validators.required)],
      demoPlotArea: [null],
      seedMaterialUsedId: [null, (Validators.required)],
      profile: [null],
      totalArea: [null],
      cultivatedArea: [null],
      distanceFromPlot: [null],
      enabledValidation: [false],
      methodOfIrrigationId: [null, (Validators.required)],
      plantingMethodId: [null, (Validators.required)],

      plotReportsAdditionalInfo: this.formbuilder.group({
        plotReportAddlInfoId: [null],
        plotReportId: [null],
        soilTypeId: [null],
        isNeedHotWaterTreatment: [null],
        isDustingApplied: [null],
        isTrashMulchingDone: [null],
        spacingId: [null],
        isPreviouslyRedPlot: [null],
        isBasalFertilization: [null],
        previousCropId: [null], /* previousLandUseId name is changed To previousCropId */
        sourceOfIrrigationId: [null],
        isCompositeFormYard: [null],
        isFilterPressMud: [null],
        isGreenManures: [null],
      }),

      plot: this.formbuilder.group({
        plotId: [null],
        plotOfferId: [null],
        seasonId: [null],
        cropTypeId: [null],
        plotTypeId: [null],
        plantTypeId: [null],
        plotNumber: [''],
        plantingDate: [null],
        farmerId: [null],
        villageId: [null]
      }),

      remarks: [''],
    });
  }

  get FormControls() {
    return this.fbPlotReport.controls;
  }


  get insideFormControls() {
    return this.fbPlotReport.get('plotReportsAdditionalInfo') as FormGroup;
  }

  addPlotReport() {
    this.fbPlotReport.controls['seasonId'].setValue(this.currentSeasonId);
    this.getPlotOffersInSeason(this.currentSeasonId || 0, -1);
    this.onValidations();
    this.submitLabel = 'Add Plot Report';
    this.showDialog = true;
    this.addFlag = true;
  }


  editPlotReport(plotReport: IPlotReportViewDto, farmer: IFarmerInPlotReportsViewDto) {
    this.addFlag = false;
    this.getPlotOffersInSeason(this.currentSeason.seasonId || 0, plotReport.plotId);
    this.plotOfferDto = JSON.parse(JSON.stringify(farmer));
    this.plotOfferDto.plotSectionName = plotReport.plotSectionName;
    this.plotOfferDto.plotCircleName = plotReport.plotCircleName;
    this.plotOfferDto.plotDivisionName = plotReport.plotDivisionName;
    this.plotOfferDto.plotVillageName = plotReport.plotVillageName;
    this.fbPlotReport.controls['seasonId'].setValue(farmer.seasonId);
    this.fbPlotReport.controls['farmerId'].setValue(farmer.farmerId);
    this.fbPlotReport.controls['farmerName'].setValue(farmer.farmerName);
    this.fbPlotReport.controls['plotOfferId'].setValue(plotReport.plotOfferId);
    // this.getOfferInfo(plotReport.plotOfferId);

    this.fbPlotReport.controls['plotNumber'].setValue(plotReport.plotNumber);
    this.fbPlotReport.controls['birnumber'].setValue(plotReport.birNumber);
    this.fbPlotReport.controls['profile'].setValue(plotReport.profile);
    this.fbPlotReport.controls['totalArea'].setValue(plotReport.totalArea);
    this.fbPlotReport.controls['cultivatedArea'].setValue(plotReport.cultivatedArea);
    this.fbPlotReport.controls['methodOfIrrigationId'].setValue(plotReport.methodOfIrrigationId);
    this.fbPlotReport.controls['distanceFromPlot'].setValue(plotReport.distanceFromPlot);
    this.fbPlotReport.controls['plantingMethodId'].setValue(plotReport.plantingMethodId);
    if (plotReport.plotReportAddlInfoId) {
      this.fbPlotReport.controls['enabledValidation'].setValue(true);
      this.onValidations();
    }
    this.subPlot.get('plotReportAddlInfoId')?.setValue(plotReport.plotReportAddlInfoId);
    this.subPlot.get('plotReportId')?.setValue(plotReport.plotReportId);
    this.subPlot.get('soilTypeId')?.setValue(plotReport.soilTypeId);
    this.subPlot.get('isNeedHotWaterTreatment')?.setValue(plotReport.isNeedHotWaterTreatment);
    this.subPlot.get('isDustingApplied')?.setValue(plotReport.isDustingApplied);
    this.subPlot.get('isTrashMulchingDone')?.setValue(plotReport.isTrashMulchingDone);
    this.subPlot.get('spacingId')?.setValue(plotReport.spacingId);
    this.subPlot.get('isPreviouslyRedPlot')?.setValue(plotReport.isPreviouslyRedPlot);
    this.subPlot.get('isBasalFertilization')?.setValue(plotReport.isBasalFertilization);
    this.subPlot.get('previousCropId')?.setValue(plotReport.previousCropId);
    this.subPlot.get('sourceOfIrrigationId')?.setValue(plotReport.sourceOfIrrigationId);
    this.subPlot.get('isCompositeFormYard')?.setValue(plotReport.isCompositeFormYard);
    this.subPlot.get('isFilterPressMud')?.setValue(plotReport.isFilterPressMud);
    this.subPlot.get('isGreenManures')?.setValue(plotReport.isGreenManures);

    this.mainPlot.get('plotOfferId')?.setValue(plotReport.plotOfferId);
    this.mainPlot.get('villageId')?.setValue(plotReport.plotVillageId);
    this.fbPlotReport.patchValue(plotReport);
    this.fbPlotReport.controls['plantTypeId'].setValue(plotReport.plantTypeId);
    this.fbPlotReport.controls['varietyId'].setValue(plotReport.varietyId);
    this.fbPlotReport.controls['birdate'].setValue(plotReport.birDate && new Date(plotReport.birDate?.toString() + ""));
    this.fbPlotReport.controls['plantingDate'].setValue(plotReport.plantingDate && new Date(plotReport.plantingDate?.toString() + ""));

    this.submitLabel = 'Update Plot Report';
    this.showDialog = true;
    this.onCalculation();
  }

  editApproval(plotReport: IPlotReportViewDto, farmer: IFarmerInPlotReportsViewDto) {
    this.editPlotReport(plotReport, farmer);
    this.showDialog = false;
    this.showApprovalDialog = true;
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
    this.onSearch();
  }

  savePlotReport(): Observable<HttpEvent<any>> {
    var temp = this.fbPlotReport.value;
    if (!temp.enabledValidation)
      temp.plotReportsAdditionalInfo = null;

    if (this.addFlag) {
      return this.monitoringService.CreatePlotReport(temp)
    }
    else return this.monitoringService.UpdatePlotReport(this.fbPlotReport.value)
  }

  onSubmit() {
    if (this.fbPlotReport.valid) {
      if (!this.subPlot.get('plotReportAddlInfoId')?.value) {
        this.fbPlotReport.value.plotReportAddlInfoId = null;
      }
      this.plotInfo();
      if (this.fbPlotReport.value.plantingDate != undefined || this.fbPlotReport.value.plantingDate != null)
        this.fbPlotReport.value.plantingDate = FORMAT_DATE(new Date(this.fbPlotReport.value.plantingDate));
      if (this.fbPlotReport.value.birdate != undefined || this.fbPlotReport.value.birdate != null)
        this.fbPlotReport.value.birdate = FORMAT_DATE(new Date(this.fbPlotReport.value.birdate));
      this.savePlotReport().subscribe(resp => {
        if (resp) {
          this.dtPlotReports.expandedRowKeys = {};
          this.initPlotReports(this.currentSeason.seasonId!);
          this.fbPlotReport.reset();
          this.showDialog = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMOPR001" : "SMOPR002"]);
        }
      })
    }
    else {
      this.fbPlotReport.markAllAsTouched();
    }
  }

  plotInfo() {
    this.mainPlot.get('plotId')?.setValue(this.fbPlotReport.value.plotId);
    this.mainPlot.get('plotOfferId')?.setValue(this.fbPlotReport.value.plotOfferId);
    this.mainPlot.get('seasonId')?.setValue(this.fbPlotReport.value.seasonId);
    this.mainPlot.get('cropTypeId')?.setValue(this.fbPlotReport.value.cropTypeId);
    this.mainPlot.get('plotTypeId')?.setValue(this.fbPlotReport.value.plotTypeId);
    this.mainPlot.get('plantTypeId')?.setValue(this.fbPlotReport.value.plantTypeId);
    this.mainPlot.get('plotNumber')?.setValue(this.fbPlotReport.value.plotNumber);
    this.mainPlot.get('plantingDate')?.setValue(FORMAT_DATE(this.fbPlotReport.value.plantingDate && new Date(this.fbPlotReport.value.plantingDate)));
    this.mainPlot.get('farmerId')?.setValue(this.fbPlotReport.value.farmerId);
  }

  get subPlot() {
    return this.fbPlotReport.controls['plotReportsAdditionalInfo'];
  }

  get mainPlot() {
    return this.fbPlotReport.controls['plot'];
  }

  onValidations() {
    if (this.fbPlotReport.controls['enabledValidation']?.value) {
      this.subPlot.get('soilTypeId')?.setValidators(Validators.required);
      this.subPlot.get('soilTypeId')?.updateValueAndValidity();
    }
    else {
      this.subPlot.get('soilTypeId')?.clearValidators();
      this.subPlot.get('soilTypeId')?.updateValueAndValidity();
    }
  }

  onCalculation() {
    const plantTypeId = this.FormControls['plantTypeId'].value;
    this.plantTypes?.forEach((value) => {
      if (value.plantTypeId == plantTypeId) {
        const reportedArea = this.fbPlotReport.controls['reportedArea'].value;
        const estimatedTon = value.estimatedTon;
        let cal = (estimatedTon || 0) * (reportedArea);
        this.fbPlotReport.controls['agreed'].setValue(cal);
      }
    });
  }

  saveApproveOrDeny(): Observable<HttpEvent<any>> {
    if (this.approveOrDenyFlag) return this.monitoringService.ApprovePlotOffer(this.fbPlotReport.value)
    else return this.monitoringService.DenyPlotOffer(this.fbPlotReport.value)
  }

  onApproveOrDenyPlotOffer() {
    if (this.fbPlotReport.valid) {
      this.saveApproveOrDeny().subscribe(resp => {
        if (resp) {
          this.dtPlotReports.expandedRowKeys = {};
          this.initPlotReports(this.currentSeason.seasonId!);
          this.fbPlotReport.reset();
          this.showApprovalDialog = false;
          this.approveOrDenyFlag = undefined;
        }
      });
    }
    else {
      this.fbPlotReport.markAllAsTouched();
    }
  }

  onApprovalSubmit(data: string) {
    if (data == 'denied') {
      this.approveOrDenyFlag = false;
      this.fbPlotReport.controls['remarks'].setValidators(Validators.required);
      this.fbPlotReport.controls['remarks'].updateValueAndValidity();
    }
    else if (data == 'approve') {
      this.approveOrDenyFlag = true;
      this.fbPlotReport.controls['remarks'].clearValidators();
      this.fbPlotReport.controls['remarks'].updateValueAndValidity();
    }
    this.onApproveOrDenyPlotOffer();
  }

  loadPlotReports(event: LazyLoadEvent) {
    this.loading = true;

    setTimeout(() => {
      let param1 = this.filter.nativeElement.value == "" ? null : this.filter.nativeElement.value;
      this.monitoringService.GetPlotReports(this.currentSeason.seasonId?this.currentSeason.seasonId:1, this.forapproval, param1).subscribe((resp) => {
        this.plotReports = resp as unknown as IFarmerInPlotReportsViewDto[];
        this.totalRecords = this.plotReports.length;
        this.loading = false;
      });
    }, 1000);
}

onSelectionChange(value = []) {
    this.selectAll = value.length === this.totalRecords;
    this.selectedplotReports = value;
}

onSelectAllChange(event: any) {
    const checked = event.checked;

    if (checked) {
      let param1 = this.filter.nativeElement.value == "" ? null : this.filter.nativeElement.value;
      this.monitoringService.GetPlotReports(this.currentSeason.seasonId?this.currentSeason.seasonId:1, this.forapproval, param1).subscribe((resp) => {
            this.selectedplotReports = resp as unknown as IFarmerInPlotReportsViewDto[];
            this.selectAll = true;
        });
    } else {
        this.selectedplotReports = [];
        this.selectAll = false;
    }
}

}
