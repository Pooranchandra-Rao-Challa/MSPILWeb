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
import { IFarmerInPlotReportsViewDto, IPlotReportViewDto, PlotReportDto } from 'src/app/_models/monitoring';

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
  plotReports: IFarmerInPlotReportsViewDto[] = [];
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
  autoDisplayDrowdown:boolean = false;

  farmerHeaders: IHeader[] = [
    { field: 'season', header: 'season', label: 'Season' },
    { field: 'farmerCode', header: 'farmerCode', label: 'Farmer Code' },
    { field: 'farmerName', header: 'farmerName', label: 'Farmer Name' },
    { field: 'farmerVillageName', header: 'farmerVillageName', label: 'Farmer Village' },
  ];

  plotHeaders: IHeader[] = [
    { field: 'previousCrop', header: 'previousCrop', label: 'Previous Crop' },
    { field: 'cropType', header: 'cropType', label: 'Crop Type' },
    { field: 'offerNo', header: 'offerNo', label: 'Offer No' },
    { field: 'plotVillageName', header: 'plotVillageName', label: 'Plot Village' },
    { field: 'plantType', header: 'plantType', label: 'Plant Type' },
    { field: 'plotNumber', header: 'plotNumber', label: 'Plot No' },
    { field: 'surveyNo', header: 'surveyNo', label: 'Survey No' },
    { field: 'plantingDate', header: 'plantingDate', label: 'Planting Date' },
    { field: 'variety', header: 'variety', label: 'Variety' },
    { field: 'plotType', header: 'plotType', label: 'Plot Type' },
    { field: 'fieldName', header: 'fieldName', label: 'Field Name' },
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

  // getPlotAllotmentsInSeason(seasonId: number) {
  //   this.monitoringService.GetPlotsInSeason(seasonId,'Reported').subscribe((resp) => {
  //     this.offeredNo = resp as any;
  //     console.log(resp);
  //   });
  // }

  getPlotOffersInSeason(seasonId: number) {
    this.monitoringService.PlotOffersInSeason(seasonId).subscribe((resp) => {
      this.offeredNo = resp as any;
    });
  }


  getOfferInfo(offerNo: number) {
    // this.offeredNo.forEach((value) => {
    //   if (value.offerNo == offerNo) {
    //     this.fbPlotReport.controls['allottedPlotId'].setValue(value.allottedPlotId);
    //   }
    // });
    this.monitoringService.GetOfferInfo(offerNo).subscribe((resp) => {
      this.allottedPlotByAllottedPlotId = resp as any;
      if (this.allottedPlotByAllottedPlotId) {
        this.fbPlotReport.controls['farmerId'].setValue(this.allottedPlotByAllottedPlotId[0]?.farmerId);
        this.fbPlotReport.controls['farmerName'].setValue(this.allottedPlotByAllottedPlotId[0]?.farmerName);
        this.fbPlotReport.controls['fatherName'].setValue(this.allottedPlotByAllottedPlotId[0]?.fatherName);
        this.fbPlotReport.controls['farmerDivision'].setValue(this.allottedPlotByAllottedPlotId[0]?.farmerDivision);
        this.fbPlotReport.controls['farmerCircle'].setValue(this.allottedPlotByAllottedPlotId[0]?.farmerCircle);
        this.fbPlotReport.controls['farmerSection'].setValue(this.allottedPlotByAllottedPlotId[0]?.farmerSection);
        this.fbPlotReport.controls['farmerVillage'].setValue(this.allottedPlotByAllottedPlotId[0]?.farmerVillage);
        this.fbPlotReport.controls['plotDivision'].setValue(this.allottedPlotByAllottedPlotId[0]?.plotDivision);
        this.fbPlotReport.controls['plotCircle'].setValue(this.allottedPlotByAllottedPlotId[0]?.plotCircle);
        this.fbPlotReport.controls['plotSection'].setValue(this.allottedPlotByAllottedPlotId[0]?.plotSection);
        this.fbPlotReport.controls['plotVillageName'].setValue(this.allottedPlotByAllottedPlotId[0]?.plotVillage);
        this.getPlotNumber(offerNo);
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
      console.log(this.methodofIrrigations);

    });
  }

  initPlantingMethods() {
    this.lookupService.PlantingMethods().subscribe((resp) => {
      this.plantingMethods = resp as unknown as LookupDetailViewDto[];
      console.log(this.plantingMethods );

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
      this.plotReports = resp as unknown as IFarmerInPlotReportsViewDto[];
      this.plotReports.forEach((value) => {
        value.objReportedPlots = JSON.parse(value.reportedPlots) as IPlotReportViewDto[];
      });
    });
  }

  onSearch() {
    this.initPlotReports(this.currentSeason.seasonId!);
  }

  allottedPlotForm() {
    this.fbPlotReport = this.formbuilder.group({
      plotReportId: [null],
      plotId: [0],
      seasonId: ['', (Validators.required)],
      cropTypeId: ['', (Validators.required)],
      offerNo: ['', (Validators.required)],
      farmerId: [{ value: '', disabled: false }, (Validators.required)],
      farmerName: [{ value: '', disabled: false }, (Validators.required)],
      fatherName: [{ value: '', disabled: false }, (Validators.required)],
      farmerDivision: [{ value: '', disabled: false }],
      farmerCircle: [{ value: '', disabled: false }],
      farmerSection: [{ value: '', disabled: false }],
      farmerVillage: [{ value: '', disabled: false }, (Validators.required)],
      plotDivision: [{ value: '', disabled: false }],
      plotCircle: [{ value: '', disabled: false }],
      plotSection: [{ value: '', disabled: false }],
      // plotVillage: [''],
      plotVillageName: [{ value: '', disabled: true }, (Validators.required)],
      plantTypeId: ['', (Validators.required)],
      plotNumber: [{ value: '', disabled: true }, (Validators.required)],
      surveyNo: ['', (Validators.required)],
      reportedArea: [null, (Validators.required)],
      plantingDate: ['', (Validators.required)],
      plantSubTypeId: ['', (Validators.required)],
      varietyId: ['', (Validators.required)],
      agreed: [{ value: '', disabled: true }],
      fieldName: [''],
      birnumber: ['', (Validators.required)],
      birdate: ['', (Validators.required)],
      plotTypeId: ['', (Validators.required)],
      demoPlotArea: [null],
      seedMaterialUsedId: ['', (Validators.required)],
      profile: [''],
      totalArea: [''],
      cultivatedArea: [null],
      isActive: [false],
      methodOfIrrigationId: ['', Validators.required],
      distanceFromPlot: [''],
      plantingMethodId: ['', Validators.required],

      plotReportsAdditionalInfo: this.formbuilder.group({

        enabledValidation: [false],
        soilTypeId: [''],
        isNeedHotWaterTreatment: [null],
        isDustingApplied: [null],
        isTrashMulchingDone: [null],
        spacingId: [''],
        isPreviouslyRedPlot: [null],
        isBasalFertilization: [null],
        previousCropId: [''], /* previousLandUseId name is changed To previousCropId */
        sourceOfIrrigationId: [''],
        isCompositeFormYard: [null],
        isFilterPressMud: [null],
        isGreenManures: [null],
        enabledValidation: [false],
      }),

      plot: this.formbuilder.group({
        plotId: [null],
        seasonId: [''],
        cropTypeId: [''],
        plotTypeId: [''],
        plantTypeId: [''],
        plotNumber: [''],
        plantingDate: [''],
      }),
    });
  }

  get FormControls() {
    return this.fbPlotReport.controls;
  }

  get PlotFormControls() {
    return this.fbPlotReport.get('plot') as FormGroup;
  }

  get insideFormControls() {
    return this.fbPlotReport.get('plotReportsAdditionalInfo') as FormGroup;

  }

  addPlotReport() {
    this.fbPlotReport.controls['seasonId'].enable();
    this.fbPlotReport.controls['offerNo'].enable();
    this.fbPlotReport.controls['seasonId'].setValue(this.currentSeason.seasonId);
    this.getPlotOffersInSeason(this.currentSeason.seasonId || 0);

    this.showDialog = true;
  }

  editPlotReport(plotReport: IPlotReportViewDto, farmer: IFarmerInPlotReportsViewDto) {
    this.getPlotOffersInSeason(this.currentSeason.seasonId || 0);
    this.fbPlotReport.controls['seasonId'].setValue(farmer.seasonId);
    this.fbPlotReport.controls['seasonId'].disable();
    this.fbPlotReport.controls['offerNo'].setValue(plotReport.offerNo);
    this.fbPlotReport.controls['offerNo'].disable();
    this.fbPlotReport.controls['farmerId'].setValue(farmer.farmerId);
    this.fbPlotReport.controls['farmerName'].setValue(farmer.farmerName);
    this.fbPlotReport.controls['fatherName'].setValue(farmer.fatherName);
    this.fbPlotReport.controls['farmerDivision'].setValue(farmer.farmerDivisionName);
    this.fbPlotReport.controls['farmerCircle'].setValue(farmer.farmerCircleName);
    this.fbPlotReport.controls['farmerSection'].setValue(farmer.farmerSectionName);
    this.fbPlotReport.controls['farmerVillage'].setValue(farmer.farmerVillageName);
    this.fbPlotReport.controls['plotDivision'].setValue(plotReport.plotDivisionName);
    this.fbPlotReport.controls['plotCircle'].setValue(plotReport.plotCircleName);
    this.fbPlotReport.controls['plotSection'].setValue(plotReport.plotSectionName);
    this.fbPlotReport.controls['plotVillageName'].setValue(plotReport.plotVillageName);

    this.fbPlotReport.controls['plantingDate'].setValue(plotReport.plantingDate && new Date(plotReport.plantingDate?.toString() + ""));
    this.fbPlotReport.controls['birnumber'].setValue(plotReport.birNumber);
    this.fbPlotReport.controls['birdate'].setValue(plotReport.birDate && new Date(plotReport.birDate?.toString() + ""));
    this.fbPlotReport.controls['profile'].setValue(plotReport.profile);
    this.fbPlotReport.controls['totalArea'].setValue(plotReport.totalArea);
    this.fbPlotReport.controls['cultivatedArea'].setValue(plotReport.cultivatedArea);
    this.fbPlotReport.controls['methodOfIrrigationId'].setValue(plotReport.methodOfIrrigationId);
    this.fbPlotReport.controls['distanceFromPlot'].setValue(plotReport.distanceFromPlot);
    this.fbPlotReport.controls['plantingMethodId'].setValue(plotReport.plantingMethodId);


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

    this.fbPlotReport.patchValue(plotReport);
    this.onCalculation();
    this.addFlag = false;
    this.submitLabel = 'Update Plot Report';
    this.showDialog = true;
  }

  editApproval(plotReport: IPlotReportViewDto, farmer: IFarmerInPlotReportsViewDto) {

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
    this.fbPlotReport.controls['seasonId'].enable();
    this.fbPlotReport.controls['offerNo'].enable();
    if (this.fbPlotReport.valid) {
      this.plotInfo();
      console.log(this.fbPlotReport.value.plantingDate);
      console.log(new Date(this.fbPlotReport.value.plantingDate));

      if(this.fbPlotReport.value.plantingDate != undefined || this.fbPlotReport.value.plantingDate != null)
      this.fbPlotReport.value.plantingDate = FORMAT_DATE(new Date(this.fbPlotReport.value.plantingDate));
      if(this.fbPlotReport.value.birdate != undefined || this.fbPlotReport.value.birdate != null)
      this.fbPlotReport.value.birdate = FORMAT_DATE(new Date(this.fbPlotReport.value.birdate));
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

  plotInfo(){
    this.mainPlot.get('plotId')?.setValue(this.fbPlotReport.value.plotId);
    this.mainPlot.get('seasonId')?.setValue(this.fbPlotReport.value.seasonId);
    this.mainPlot.get('cropTypeId')?.setValue(this.fbPlotReport.value.cropTypeId);
    this.mainPlot.get('plotTypeId')?.setValue(this.fbPlotReport.value.plotTypeId);
    this.mainPlot.get('plantTypeId')?.setValue(this.fbPlotReport.value.plantTypeId);
    this.mainPlot.get('plotNumber')?.setValue(this.fbPlotReport.value.plotNumber);
    this.mainPlot.get('plantingDate')?.setValue(this.fbPlotReport.value.plantingDate);
  }

  get subPlot() {
    return this.fbPlotReport.controls['plotReportsAdditionalInfo'];
  }

  get mainPlot() {
    return this.fbPlotReport.controls['plot'];
  }

  onValidations() {
    if (this.subPlot.get('enabledValidation')?.value) {
      this.subPlot.get('soilTypeId')?.setValidators(Validators.required);
      this.subPlot.get('soilTypeId')?.updateValueAndValidity();

      this.subPlot.get('methodOfIrrigationId')?.setValidators(Validators.required);
      this.subPlot.get('methodOfIrrigationId')?.updateValueAndValidity();

      this.subPlot.get('plantingMethodId')?.setValidators(Validators.required);
      this.subPlot.get('plantingMethodId')?.updateValueAndValidity();

      this.subPlot.get('previousCropId')?.setValidators(Validators.required);
      this.subPlot.get('previousCropId')?.updateValueAndValidity();
    }
    else {
      this.subPlot.get('soilTypeId')?.clearValidators();
      this.subPlot.get('soilTypeId')?.updateValueAndValidity();

      this.subPlot.get('methodOfIrrigationId')?.clearValidators();
      this.subPlot.get('methodOfIrrigationId')?.updateValueAndValidity();

      this.subPlot.get('plantingMethodId')?.clearValidators();
      this.subPlot.get('plantingMethodId')?.updateValueAndValidity();

      this.subPlot.get('previousCropId')?.clearValidators();
      this.subPlot.get('previousCropId')?.updateValueAndValidity();
    }
  }

  onCalculation() {
    const plantTypeId = this.FormControls['plantTypeId'].value;
    this.plantTypes?.forEach((value) => {
      if (value.plantTypeId == plantTypeId) {
        const reportedArea = this.FormControls['reportedArea'].value;
        const estimatedTon = value.estimatedTon;
        let cal = (estimatedTon || 0) * (reportedArea);
        this.FormControls['agreed'].setValue(cal);
      }
    });
  }

}
