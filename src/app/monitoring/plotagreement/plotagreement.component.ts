import { NomineeDetailsDto } from './../../_models/monitoring';
import { LookupService } from 'src/app/_services/lookup.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Table } from 'primeng/table';
import { FarmersViewDto, LookupDetailViewDto, SeasonDto, SeasonViewDto } from 'src/app/_models/applicationmaster';
import { IAgreementedPlotsViewDto, IFarmerInPlotOfferDto, MaintDiseaseDto, MaintenanceItems, MaintFertilizerDto, MaintPestDto, MaintWeedicideDto, PlotAgreementDto, PlotInfoDto, PlotsDto } from 'src/app/_models/monitoring';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { MonitoringService } from 'src/app/_services/monitoring.service';
import { CURRENT_SEASON } from 'src/environments/environment';
import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JWTService } from 'src/app/_services/jwt.service';

export interface IHeader {
  field: string;
  header: string;
  label: string;
}
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
  seasons: SeasonViewDto[] = [];
  showDialog: boolean = false;
  submitLabel!: string;
  fbPlotAgreement!: FormGroup
  addFlag: boolean = true;
  plotInfo: PlotsDto = {};
  currentSeason: SeasonDto = {};
  plotNumbers: PlotInfoDto[] = [];
  relationTypes: LookupDetailViewDto[] = [];
  guarantor1Farmers: FarmersViewDto[] = [];
  guarantor2Farmers: FarmersViewDto[] = [];
  guarantor3Farmers: FarmersViewDto[] = [];
  weedStatus: LookupDetailViewDto[] = [];
  crops: LookupDetailViewDto[] = [];
  maintanenceItems?: MaintenanceItems = {}
  activeIndex?= 0;
  activeIndex1?= 0;
  activeIndex2?= 0;
  todayDate = new Date();
  permissions: any;

  farmerHeaders: IHeader[] = [
    { field: 'season', header: 'season', label: 'Season' },
    { field: 'farmerCode', header: 'farmerCode', label: 'Farmer Code' },
    { field: 'farmerName', header: 'farmerName', label: 'Farmer Name' },
    { field: 'farmerVillageName', header: 'farmerVillageName', label: 'Farmer Village' },
    { field: 'fatherName', header: 'fatherName', label: 'Father Name' },
  ];

  plotHeaders: IHeader[] = [
    { field: 'crop', header: 'crop', label: 'Crop' },
    { field: 'cropType', header: 'cropType', label: 'Crop Type' },
    { field: 'plotVillageName', header: 'plotVillageName', label: 'Plot Village' },
    { field: 'plantType', header: 'plantType', label: 'Plant Type' },
    { field: 'plotNumber', header: 'plotNumber', label: 'Plot No' },
    { field: 'surveyNo', header: 'surveyNo', label: 'Survey No' },
    { field: 'plantingDate', header: 'plantingDate', label: 'Planting Date' },
    { field: 'variety', header: 'variety', label: 'Variety' },
    { field: 'plotType', header: 'plotType', label: 'Plot Type' },
    { field: 'measuredArea', header: 'measuredArea', label: 'Measured Area' },
    { field: 'agreementedArea', header: 'agreementedArea', label: 'Area' },
    { field: 'agreementedDate', header: 'agreementedDate', label: 'Agreemented Date' },
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
    private jwtService: JWTService,) {
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
      this.initPlotNumbers(this.currentSeason.seasonId!, -1);
      this.initPlotAgreements(this.currentSeason.seasonId!);
    });
  }

  initPlotNumbers(season: number, plotId: number) {
    debugger
    console.log('plotId', plotId);
    this.plotNumbers = [];
    this.monitoringService.GetPlotsInSeason(season, 'Agreement', plotId).subscribe((resp) => {
      this.plotNumbers = resp as unknown as PlotInfoDto[];
      console.log(this.plotNumbers);

    });
  }

  initPlotAgreements(seasonId: number) {
    let param1 = this.filter.nativeElement.value == "" ? null : this.filter.nativeElement.value;
    this.monitoringService.GetPlotAgreement(seasonId, param1).subscribe((resp) => {
      this.plotAgreements = resp as unknown as IFarmerInPlotOfferDto[];
      this.plotAgreements?.forEach((value) => {
        value.objAgreementedPlots = JSON.parse(value.agreementedPlots) as IAgreementedPlotsViewDto[];
      });
    });
  }

  getPlotinfo(plotId: number) {
    debugger
    this.monitoringService.GetPlotsinfo(plotId).subscribe((resp) => {
      this.plotInfo = resp as unknown as PlotsDto;
      this.plotInfo.plantingDate = this.plotInfo.plantingDate && new Date(this.plotInfo.plantingDate?.toString() + "");

      this.FormControls['plotId'].setValue(this.plotInfo.plotId);
      if (this.plotInfo.farmerId) {
        this.guarantor1Farmers = this.guarantor1Farmers?.filter(x => x.farmerId != this.plotInfo.farmerId);
        this.fcNomineeDetails.controls['guarantor1'].setValue(null);
        this.fcNomineeDetails.controls['guarantor2'].setValue(null);
        this.fcNomineeDetails.controls['guarantor3'].setValue(null);
      }
    });
  }

  getGuarantor2(farmerId: number) {
    this.guarantor2Farmers = this.guarantor1Farmers?.filter(x => x.farmerId != farmerId);
  }

  getGuarantor3Farmers(farmerId: number) {
    this.guarantor3Farmers = this.guarantor2Farmers?.filter(x => x.farmerId != farmerId);
    this.guarantor1Farmers = this.guarantor1Farmers?.filter(x => x.farmerId != farmerId);
  }

  onGuarantor3(farmerId: number) {
    this.guarantor2Farmers = this.guarantor2Farmers?.filter(x => x.farmerId != farmerId);
    this.guarantor1Farmers = this.guarantor1Farmers?.filter(x => x.farmerId != farmerId);
  }

  initRelationTypes() {
    this.lookupService.RelationTypes().subscribe((resp) => {
      this.relationTypes = resp as unknown as LookupDetailViewDto[];
    });
  }

  initFarmers() {
    this.appMasterService.GetFarmers().subscribe((resp) => {
      this.guarantor1Farmers = resp as unknown as FarmersViewDto[];
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
    this.submitLabel = "Add Agreement";
    this.addFlag = true;
    this.showDialog = true;
    this.fbPlotAgreement.get('seasonId')?.patchValue(this.currentSeason.seasonId);
    this.getMaintenanceItemsForAgreement();
  }

  getMaintenanceItemsForAgreement(plotAgreementId: number = -1) {
    this.monitoringService.GetMaintenanceItemsForAgreement(plotAgreementId).subscribe((resp) => {
      this.maintanenceItems = resp as unknown as MaintenanceItems;
      console.log(this.maintanenceItems);

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
      agreementedDate: [null, (Validators.required)],
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
        relationTypeId: ['', (Validators.required)],
        nominee: ['', (Validators.required)],
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

  onSearch() {
    this.initPlotAgreements(this.currentSeason.seasonId!);
  }

  editPlotAgreement(plotAgreement: IAgreementedPlotsViewDto) {
    this.initPlotNumbers(this.currentSeason.seasonId!, plotAgreement.plotId);
    this.fbPlotAgreement.controls['seasonId'].setValue(this.currentSeason.seasonId!);
    this.fbPlotAgreement.controls['plotId'].setValue(plotAgreement.plotId);
    this.fbPlotAgreement.controls['agreementedArea'].setValue(plotAgreement.agreementedArea);
    this.fbPlotAgreement.controls['agreementedDate'].setValue(plotAgreement.agreementedDate && new Date(plotAgreement.agreementedDate?.toString() + ""));
    this.fcNomineeDetails.controls['nomineeDetailId'].setValue(plotAgreement.nomineeId);
    this.fcNomineeDetails.controls['plotAgreementId'].setValue(plotAgreement.plotAgreementId);
    this.fcNomineeDetails.controls['relationTypeId'].setValue(plotAgreement.relationTypeId);
    this.fcNomineeDetails.controls['nominee'].setValue(plotAgreement.nominee);
    this.fcNomineeDetails.controls['guarantor1'].setValue(plotAgreement.guarantor1);
    this.fcNomineeDetails.controls['guarantor2'].setValue(plotAgreement.guarantor2);
    this.fcNomineeDetails.controls['guarantor3'].setValue(plotAgreement.guarantor3);

    this.fbPlotAgreement.patchValue(plotAgreement);
    this.getPlotinfo(plotAgreement.plotId);
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
      console.log(this.fbPlotAgreement.value);
      this.savePlotAgreement().subscribe(resp => {
        if (resp) {
          this.initPlotAgreements(this.currentSeason.seasonId!);
          this.fbPlotAgreement.reset();
          this.showDialog = false;
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
  }
}
