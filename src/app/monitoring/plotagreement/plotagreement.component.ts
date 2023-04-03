import { LookupService } from 'src/app/_services/lookup.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormArray } from '@angular/forms';
import { Table } from 'primeng/table';
import { FarmersViewDto, LookupDetailViewDto, SeasonDto, SeasonViewDto } from 'src/app/_models/applicationmaster';
import { IAgreementedPlotsViewDto, IFarmerInPlotOfferDto, MaintDiseaseDto, MaintenanceItems, MaintFertilizerDto, MaintPestDto, MaintWeedicideDto, PlotAgreementDto, PlotInfoDto, PlotsDto } from 'src/app/_models/monitoring';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { MonitoringService } from 'src/app/_services/monitoring.service';
import { CURRENT_SEASON } from 'src/environments/environment';

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
  globalFilterFields: string[] = ["seasonName", "offerNo", "offerDate", "farmerId", "farmerVillageName", "farmerName", "plotVillageName", "plantType",
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
  farmers: FarmersViewDto[] = [];
  guarantor2Farmers: FarmersViewDto[] = [];
  guarantor3Farmers: FarmersViewDto[] = [];
  weedStatus: LookupDetailViewDto[] = [];
  crops: LookupDetailViewDto[] = [];
  maintanenceItems?: MaintenanceItems = {}

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
  }

  constructor(private formbuilder: FormBuilder,
    private appMasterService: AppMasterService,
    private monitoringService: MonitoringService,
    private lookupService: LookupService,) { }

  ngOnInit(): void {
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
      this.initPlotAgreements(this.currentSeason.seasonId!);
      this.initPlotNumbers(this.currentSeason.seasonId!);
    });
  }

  initPlotNumbers(season: number) {
    this.monitoringService.GetPlotsInSeason(season, 'Agreement').subscribe((resp) => {
      this.plotNumbers = resp as unknown as PlotInfoDto[];
    });
  }

  initPlotAgreements(seasonId: number) {
    let param1 = this.filter.nativeElement.value == "" ? null : this.filter.nativeElement.value;
    this.monitoringService.GetPlotAgreement(seasonId, param1).subscribe((resp) => {
      this.plotAgreements = resp as unknown as IFarmerInPlotOfferDto[];
      this.plotAgreements?.forEach((value) => {
        value.objAgreementedPlots = JSON.parse(value.agreementedPlots) as IAgreementedPlotsViewDto[];
      });
      console.log(this.plotAgreements);

    });
  }

  getPlotinfo(plotId: number) {
    this.monitoringService.GetPlotsinfo(plotId).subscribe((resp) => {
      this.plotInfo = resp as unknown as PlotsDto;
      if (this.plotInfo.farmerId) {
        this.farmers = this.farmers?.filter(x => x.farmerId != this.plotInfo.farmerId);
        this.fbPlotAgreement.controls['guarantor1'].setValue('');
        this.fbPlotAgreement.controls['guarantor2'].setValue('');
        this.fbPlotAgreement.controls['guarantor3'].setValue('');
      }
    });
  }

  getGuarantor2(farmerId: number) {
    this.guarantor2Farmers = this.farmers?.filter(x => x.farmerId != farmerId);
  }

  getGuarantor3Farmers(farmerId: number) {
    this.guarantor3Farmers = this.guarantor2Farmers?.filter(x => x.farmerId != farmerId);
    this.farmers = this.farmers?.filter(x => x.farmerId != farmerId);
  }

  onGuarantor3(farmerId: number) {
    this.guarantor2Farmers = this.guarantor2Farmers?.filter(x => x.farmerId != farmerId);
    this.farmers = this.farmers?.filter(x => x.farmerId != farmerId);
  }

  initRelationTypes() {
    this.lookupService.RelationTypes().subscribe((resp) => {
      this.relationTypes = resp as unknown as LookupDetailViewDto[];
    });
  }

  initFarmers() {
    this.appMasterService.GetFarmers().subscribe((resp) => {
      this.farmers = resp as unknown as FarmersViewDto[];
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

  initPlotAgreement(plotAgreementId: number = -1) {
    this.plotAgreement = new PlotAgreementDto();
    this.submitLabel = "Add Agreement";
    this.addFlag = true;
    this.showDialog = true;

    this.monitoringService.GetMaintenanceItemsForAssessment(plotAgreementId).subscribe((resp) => {
      this.maintanenceItems = resp as unknown as MaintenanceItems;
      this.initMaintanenceItems();
    });
  }

  initMaintanenceItems() {
    let weedicideArray = this.fbPlotAgreement.get("weedicides") as FormArray;

    this.maintanenceItems?.weedicides?.forEach(weedicide => {
      weedicideArray.push(this.createWeed(weedicide));
    })
    let fertilizerArray = this.fbPlotAgreement.get("fertilizers") as FormArray;

    this.maintanenceItems?.fertilizers?.forEach(fertilizer => {
      fertilizerArray.push(this.createFertlizer(fertilizer))
    })
    let pestArray = this.fbPlotAgreement.get("pests") as FormArray;

    this.maintanenceItems?.pests?.forEach(pest => {
      pestArray.push(this.createpests(pest))
    })
    let diseaseArray = this.fbPlotAgreement.get("diseases") as FormArray;

    this.maintanenceItems?.diseases?.forEach(disease => {
      diseaseArray.push(this.createDisease(disease))
    })
  }

  plotAgreementForm() {
    this.fbPlotAgreement = this.formbuilder.group({
      seasonId: ['', (Validators.required)],
      plotNumber: [null, (Validators.required)],
      agreementArea: [null, (Validators.required)],
      agreementDate: ['', (Validators.required)],
      weedStatusId: [null, (Validators.required)],
      interCropId: [null, (Validators.required)],
      micronutrientdeficiency: [null],
      trashmulching: [null],
      gapfillingdone: [null],
      nomineeDetails: this.formbuilder.group({
        nomineeDetailId: [null],
        plotAgreementId: [''],
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
    return this.fbPlotAgreement.get('nomineeDetails') as FormGroup;

  }

  getFormArrayControl(formGroupName: string): FormArray {
    return this.fbPlotAgreement.controls[formGroupName] as FormArray
  }

  createpests(pest: MaintPestDto): FormGroup {
    return this.formbuilder.group({
      pestId: [pest.pestId],
      plotAssessmentId: [pest.plotAssessmentId],
      name: [pest.name],
      remarks: [pest.remarks],
      identifiedDate: [pest.identifiedDate],
      controlDate: [pest.controlDate]
    })
  }
  createWeed(weed: MaintWeedicideDto): FormGroup {
    return this.formbuilder.group({
      weedicideId: [weed.weedicideId],
      plotAssessmentId: [weed.plotAssessmentId],
      name: [weed.name],
      checked: [weed.selected],
    });
  }
  createFertlizer(fertilizer: MaintFertilizerDto): FormGroup {
    return this.formbuilder.group({
      fertilizerId: [fertilizer.fertilizerId],
      plotAssessmentId: [fertilizer.plotAssessmentId],
      name: [fertilizer.name],
      checked: [fertilizer.selected],
    });
  }
  createDisease(disease: MaintDiseaseDto): FormGroup {
    return this.formbuilder.group({
      diseaseId: [disease.diseaseId],
      plotAssessmentId: [disease.plotAssessmentId],
      name: [disease.name],
      remarks: [disease.remarks],
      identifiedDate: [disease.identifiedDate],
      controlDate: [disease.controlDate]
    })
  }

  onSubmit() {
    if(this.fbPlotAgreement.valid){

    }
    else{
      this.fbPlotAgreement.markAllAsTouched();
    }
  }
}