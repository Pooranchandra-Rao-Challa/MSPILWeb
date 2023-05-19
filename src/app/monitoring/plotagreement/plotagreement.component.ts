import { LookupService } from 'src/app/_services/lookup.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { Table } from 'primeng/table';
import { FarmersViewDto, LookupDetailViewDto, SeasonDto, SeasonViewDto } from 'src/app/_models/applicationmaster';
import {
  IAgreementedPlotsViewDto, IFarmerInPlotOfferDto, MaintDiseaseDto, MaintenanceItems, MaintFertilizerDto, MaintPestDto, MaintWeedicideDto,
  PlotAgreementDto, PlotInfoDto, PlotsDto
} from 'src/app/_models/monitoring';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { MonitoringService } from 'src/app/_services/monitoring.service';
import { CURRENT_SEASON } from 'src/environments/environment';
import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JWTService } from 'src/app/_services/jwt.service';
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { FORMAT_DATE, MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { ITableHeader, MaxLength } from 'src/app/_models/common';
import { MIN_LENGTH_2, RG_ALPHA_ONLY } from 'src/app/_shared/regex';

@Component({
  selector: 'app-plotagreement',
  templateUrl: './plotagreement.component.html',
  styles: [
  ]
})
export class PlotagreementComponent implements OnInit {
  plotAgreements: IFarmerInPlotOfferDto[] = [];
  plotAgreement: PlotAgreementDto = {};
  globalFilterFields: string[] = ["seasonName", "offerNo", "agreementedDate", "farmerId", "farmerVillageName", "farmerName", "plotVillageName", "plantType",
    "expectedArea", "varietyId", "plantingDate"];
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild('dtPlotAgreements') dtPlotAgreements!: Table;
  seasons: SeasonViewDto[] = [];
  showDialog: boolean = false;
  submitLabel!: string;
  fbPlotAgreement!: FormGroup
  addFlag: boolean = true;
  plotInfo: PlotsDto = {};
  currentSeason: SeasonDto = {};
  plotNumbers: PlotInfoDto[] = [];
  relationTypes: LookupDetailViewDto[] = [];
  farmers: FarmersViewDto[] = [];
  guarantor1Farmers: FarmersViewDto[] = [];
  guarantor2Farmers: FarmersViewDto[] = [];
  guarantor3Farmers: FarmersViewDto[] = [];
  weedStatus: LookupDetailViewDto[] = [];
  crops: LookupDetailViewDto[] = [];
  maintanenceItems?: MaintenanceItems = {}
  mediumDate: string = MEDIUM_DATE;
  activeIndex?= 0;
  activeIndex1?= 0;
  activeIndex2?= 0;
  todayDate = new Date();
  permissions: any;
  maxLength: MaxLength = new MaxLength();

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
    { field: 'cropName', header: 'cropName', label: 'Crop' },
    { field: 'cropTypeName', header: 'cropTypeName', label: 'Crop Type' },
    { field: 'plantTypeName', header: 'plantTypeName', label: 'Plant Type' },
    { field: 'surveyNo', header: 'surveyNo', label: 'Survey No' },
    { field: 'varietyName', header: 'varietyName', label: 'Variety' },
    { field: 'plotTypeName', header: 'plotTypeName', label: 'Plot Type' },
    { field: 'agreementedArea', header: 'agreementedArea', label: 'Agreemented Area' },
    { field: 'agreementedDate', header: 'agreementedDate', label: 'Agreemented Date' },

  ];
  currentSeasonId?: number;

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
    private alertMessage: AlertMessage,) {
  }

  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    this.initSeasons();
    this.initCurrentSeason(CURRENT_SEASON());
    this.initRelationTypes();
    this.initFarmers();
    this.initweedstatus();
    this.initCrops();
    this.plotAgreementForm();
  }

  initSeasons() {
    this.appMasterService.Getseason().subscribe((resp) => {
      this.seasons = resp as unknown as SeasonViewDto[];

    });
  }

  initCurrentSeason(seasonCode: string) {
    this.appMasterService.CurrentSeason(seasonCode).subscribe((resp) => {
      this.currentSeason = resp as SeasonDto;
      this.currentSeasonId = this.currentSeason.seasonId;
      this.initPlotNumbers(this.currentSeason.seasonId!, -1);
      this.initPlotAgreements(this.currentSeason.seasonId!);
    });
  }

  initPlotNumbers(season: number, plotId: number) {
    this.plotNumbers = [];
    this.plotInfo = {};
    this.fbPlotAgreement.controls['agreementDate'].setValue(null);
    this.monitoringService.GetPlotsInSeason(season, 'Agreement', plotId).subscribe((resp) => {
      this.plotNumbers = resp as unknown as PlotInfoDto[];
    });
  }

  initPlotAgreements(seasonId: number) {
    this.dtPlotAgreements.expandedRowKeys = {};
    let param1 = this.filter.nativeElement.value == "" ? null : this.filter.nativeElement.value;
    this.monitoringService.GetPlotAgreement(seasonId, param1).subscribe((resp) => {
      this.plotAgreements = resp as unknown as IFarmerInPlotOfferDto[];
    });
  }

  onRowExpand(source: any) {
    var data = source.data as IFarmerInPlotOfferDto;
    this.monitoringService.GetFarmerPlotsInAgreement(data.seasonId, data.farmerId).subscribe(resp => {
      data.objAgreementedPlots = resp as unknown as IAgreementedPlotsViewDto[];
    });
  }

  getPlotinfo(plotId: number, add = true) {
    this.monitoringService.GetPlotsinfo(plotId).subscribe((resp) => {
      this.plotInfo = resp as unknown as PlotsDto;
      this.plotInfo.measuredDate = this.plotInfo.measuredDate && new Date(this.plotInfo.measuredDate?.toString() + "");
      this.plotInfo.plantingDate = this.plotInfo.plantingDate && new Date(this.plotInfo.plantingDate?.toString() + "");
      this.FormControls['plotId'].setValue(this.plotInfo.plotId);
      if (this.plotInfo.farmerCode && add) {
        this.guarantor1Farmers = this.guarantor1Farmers?.filter(x => x.code != this.plotInfo.farmerCode);
        this.fcNomineeDetails.controls['guarantor1'].setValue(null);
        this.fcNomineeDetails.controls['guarantor2'].setValue(null);
        this.fcNomineeDetails.controls['guarantor3'].setValue(null);
      }
    });
  }

  getGuarantor2(farmerCode: string) {
    this.guarantor2Farmers = this.guarantor1Farmers?.filter(x => x.code != farmerCode);
  }

  getGuarantor3Farmers(farmerCode: string) {
    this.guarantor3Farmers = this.guarantor2Farmers?.filter(x => x.code != farmerCode);
    this.guarantor1Farmers = this.guarantor1Farmers?.filter(x => x.code != farmerCode);
  }

  onGuarantor3(farmerCode: string) {
    this.guarantor2Farmers = this.guarantor2Farmers?.filter(x => x.code != farmerCode);
    this.guarantor1Farmers = this.guarantor1Farmers?.filter(x => x.code != farmerCode);
  }

  initRelationTypes() {
    this.lookupService.RelationTypes().subscribe((resp) => {
      this.relationTypes = resp as unknown as LookupDetailViewDto[];
    });
  }

  initFarmers() {
    this.appMasterService.GetFarmers().subscribe((resp) => {
      this.farmers = resp as unknown as FarmersViewDto[];
      if(this.farmers) this.guarantor1Farmers = this.farmers;
    })
  }

  initweedstatus() {
    this.lookupService.WeedStatuses().subscribe((resp) => {
      this.weedStatus = resp as unknown as LookupDetailViewDto[];
    });
  }

  initCrops() {
    this.lookupService.Crops().subscribe((resp) => {
      this.crops = resp as unknown as LookupDetailViewDto[];
    });
  }

  addPlotAgreement() {
    this.fbPlotAgreement.controls['seasonId'].enable();
    this.fbPlotAgreement.controls['plotId'].enable();
    this.fbPlotAgreement.controls['seasonId'].setValue(this.currentSeasonId);
    this.initPlotNumbers(this.currentSeasonId!, -1);
    this.submitLabel = "Add Agreement";
    this.addFlag = true;
    this.showDialog = true;
    this.getMaintenanceItemsForAgreement();
  }

  getMaintenanceItemsForAgreement(plotAgreementId: number = -1) {
    this.monitoringService.GetMaintenanceItemsForAgreement(plotAgreementId).subscribe((resp) => {
      this.maintanenceItems = resp as unknown as MaintenanceItems;
      this.initMaintanenceItems();
    });
  }

  initMaintanenceItems() {
    let weedicideArray = this.fbPlotAgreement.get("weedicides") as FormArray;

    this.maintanenceItems?.weedicides?.forEach(weedicide => {
      if (!this.addFlag) weedicide.plotAgreementId = this.fbPlotAgreement.controls['plotAgreementId'].value;
      weedicideArray.push(this.createWeed(weedicide));
    })
    let fertilizerArray = this.fbPlotAgreement.get("fertilizers") as FormArray;

    this.maintanenceItems?.fertilizers?.forEach(fertilizer => {
      if (!this.addFlag) fertilizer.plotAgreementId = this.fbPlotAgreement.controls['plotAgreementId'].value;
      fertilizerArray.push(this.createFertlizer(fertilizer))
    })
    let pestArray = this.fbPlotAgreement.get("pests") as FormArray;

    this.maintanenceItems?.pests?.forEach(pest => {
      if (!this.addFlag) pest.plotAgreementId = this.fbPlotAgreement.controls['plotAgreementId'].value;
      pestArray.push(this.createpests(pest))
    })
    let diseaseArray = this.fbPlotAgreement.get("diseases") as FormArray;

    this.maintanenceItems?.diseases?.forEach(disease => {
      if (!this.addFlag) disease.plotAgreementId = this.fbPlotAgreement.controls['plotAgreementId'].value;
      diseaseArray.push(this.createDisease(disease))
    })

  }

  plotAgreementForm() {
    this.fbPlotAgreement = this.formbuilder.group({
      plotAgreementId: [null],
      plotId: [null, (Validators.required)],
      seasonId: [null, (Validators.required)],
      agreementedArea: [null, (Validators.required)],
      agreementDate: [null, (Validators.required)],
      interCropingId: [null],
      hasMicroNutrientDeficiency: [null],
      isTrashMulchingDone: [null],
      isGapsFillingDone: [null],
      weedStatusId: [null],
      bioFertilizersAppliedArea: [null],
      deepPloughedArea: [null],
      deTrashingArea: [null],
      earthingUpArea: [null],
      ratoonManagedUsedArea: [null],
      trashShedderArea: [null],
      loadShedderArea: [null],
      nomineeInfo: this.formbuilder.group({
        nomineeDetailId: [null],
        plotAgreementId: [null],
        relationTypeId: [null, (Validators.required)],
        nominee: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
        guarantor1: [null, (Validators.required)],
        guarantor2: [null],
        guarantor3: [null]
      }),
      weedicides: this.formbuilder.array([]),
      pests: this.formbuilder.array([]),
      fertilizers: this.formbuilder.array([]),
      diseases: this.formbuilder.array([]),
    })
  }

  get FormControls() {
    return this.fbPlotAgreement.controls;
  }

  get fcNomineeDetails() {
    return this.fbPlotAgreement.get('nomineeInfo') as FormGroup;

  }

  getFormArrayControl(formGroupName: string): FormArray {
    return this.fbPlotAgreement.controls[formGroupName] as FormArray
  }

  createpests(pest: MaintPestDto): FormGroup {
    return this.formbuilder.group({
      plotPestId: [pest.plotPestId],
      pestId: [pest.pestId],
      plotAgreementId: [pest.plotAgreementId],
      pestName: [pest.pestName],
      remarks: [pest.remarks],
      identifiedDate: [pest.identifiedDate && FORMAT_DATE(new Date(pest.identifiedDate))],
      controlDate: [pest.controlDate && FORMAT_DATE(new Date(pest.controlDate))]
    })
  }

  createWeed(weed: MaintWeedicideDto): FormGroup {
    return this.formbuilder.group({
      plotWeedicideId: [weed.plotWeedicideId],
      weedicideId: [weed.weedicideId],
      plotAgreementId: [weed.plotAgreementId],
      weedicideName: [weed.weedicideName],
      checked: [weed.selected],
    });
  }

  createFertlizer(fertilizer: MaintFertilizerDto): FormGroup {
    return this.formbuilder.group({
      plotFertilizerId: [fertilizer.plotFertilizerId],
      fertilizerId: [fertilizer.fertilizerId],
      plotAgreementId: [fertilizer.plotAgreementId],
      fertilizerName: [fertilizer.fertilizerName],
      checked: [fertilizer.selected],
    });
  }

  createDisease(disease: MaintDiseaseDto): FormGroup {
    return this.formbuilder.group({
      plotDiseaseId: [disease.plotDiseaseId],
      diseaseId: [disease.diseaseId],
      plotAgreementId: [disease.plotAgreementId],
      diseaseName: [disease.diseaseName],
      remarks: [disease.remarks],
      identifiedDate: [disease.identifiedDate && FORMAT_DATE(new Date(disease.identifiedDate))],
      controlDate: [disease.controlDate && FORMAT_DATE(new Date(disease.controlDate))]
    })
  }

  onSearch() {
    this.dtPlotAgreements.expandedRowKeys = {};
    this.initPlotAgreements(this.currentSeason.seasonId!);
  }

  editPlotAgreement(plotAgreement: IAgreementedPlotsViewDto) {
    this.initPlotNumbers(this.currentSeason.seasonId!, plotAgreement.plotId);
    this.getPlotinfo(plotAgreement.plotId, false);
    this.getGuarantor2(plotAgreement.guarantor1);
    this.getGuarantor3Farmers(plotAgreement.guarantor2);
    this.onGuarantor3(plotAgreement.guarantor3);
    this.fbPlotAgreement.controls['seasonId'].setValue(this.currentSeason.seasonId!);
    this.fbPlotAgreement.controls['seasonId'].disable();
    this.fbPlotAgreement.controls['plotId'].setValue(plotAgreement.plotId);
    this.fbPlotAgreement.controls['plotId'].disable();
    this.fbPlotAgreement.controls['agreementedArea'].setValue(plotAgreement.agreementedArea);
    this.fbPlotAgreement.controls['agreementDate'].setValue(plotAgreement.agreementedDate && new Date(plotAgreement.agreementedDate?.toString() + ""));
    this.fcNomineeDetails.controls['nomineeDetailId'].setValue(plotAgreement.nomineeId);
    this.fcNomineeDetails.controls['plotAgreementId'].setValue(plotAgreement.plotAgreementId);
    this.fcNomineeDetails.controls['relationTypeId'].setValue(plotAgreement.relationTypeId);
    this.fcNomineeDetails.controls['nominee'].setValue(plotAgreement.nomineeName);
    this.fcNomineeDetails.controls['guarantor1'].setValue(plotAgreement.guarantor1);
    this.fcNomineeDetails.controls['guarantor2'].setValue(plotAgreement.guarantor2);
    this.fcNomineeDetails.controls['guarantor3'].setValue(plotAgreement.guarantor3);
    this.fbPlotAgreement.patchValue(plotAgreement);
    this.getMaintenanceItemsForAgreement(plotAgreement.plotAgreementId);
    this.addFlag = false;
    this.submitLabel = 'Update Plot Agreement';
    this.showDialog = true;
  }

  savePlotAgreement(): Observable<HttpEvent<PlotAgreementDto>> {
    var postValues = this.fbPlotAgreement.value;
    postValues.weedicides = postValues.weedicides.filter((weed: any) => weed.checked == true)
    postValues.pests = postValues.pests.filter((pest: any) => pest.identifiedDate != undefined || pest.controlDate != undefined)
    postValues.fertilizers = postValues.fertilizers.filter((fertilizer: any) => fertilizer.checked == true)
    postValues.diseases = postValues.diseases.filter((disease: any) => disease.identifiedDate != undefined || disease.controlDate != undefined)
    if (this.addFlag) return this.monitoringService.CreatePlotAgreement(postValues)
    else return this.monitoringService.UpdatePlotAgreement(postValues)
  }

  onSubmit() {
    if (this.fbPlotAgreement.valid) {
      this.fbPlotAgreement.controls['seasonId'].enable();
      this.fbPlotAgreement.controls['plotId'].enable();
      this.savePlotAgreement().subscribe(resp => {
        if (resp) {
          this.dtPlotAgreements.expandedRowKeys = {};
          this.initPlotAgreements(this.currentSeason.seasonId!);
          this.fbPlotAgreement.reset();
          this.showDialog = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMOPAG001" : "SMOPAG002"]);
        }
      })
    }
    else {
      this.fbPlotAgreement.markAllAsTouched();
    }
  }

  clearForm() {
    var temp = Object.assign({}, this.currentSeason);
    this.fbPlotAgreement.reset();
    this.plotInfo = {};
    (this.fbPlotAgreement.get("weedicides") as FormArray).clear();
    (this.fbPlotAgreement.get("fertilizers") as FormArray).clear();
    (this.fbPlotAgreement.get("pests") as FormArray).clear();
    (this.fbPlotAgreement.get("diseases") as FormArray).clear();
    this.activeIndex = this.activeIndex1 = this.activeIndex2 = 0;
    this.currentSeason = Object.assign({}, temp);
    this.fbPlotAgreement.get('seasonId')?.patchValue(this.currentSeason.seasonId);
    this.guarantor1Farmers = this.farmers;
    this.guarantor2Farmers = [];
    this.guarantor3Farmers = [];
  }
}
