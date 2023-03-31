import { ThisReceiver } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators ,FormBuilder, FormArray} from '@angular/forms';
import { Table } from 'primeng/table';
import { LookupDetailDto, SeasonDto, SeasonViewDto } from 'src/app/_models/applicationmaster';
import { MaintDiseaseDto, MaintenanceItems, MaintFertilizerDto, MaintPestDto, MaintWeedicideDto, PlotInfoDto, PlotsDto } from 'src/app/_models/monitoring';
import { AppMasterService } from 'src/app/_services/appmaster.service';
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

  globalFilterFields: string[] = ["seasonName", "offerNo", "offerDate", "farmerId", "farmerVillageName", "farmerName", "plotVillageName", "plantType",
  "expectedArea", "varietyId", "plantingDate"];
  @ViewChild('filter') filter!: ElementRef;
  seasons: SeasonViewDto[] = [];
  currentSeasonCode?: string;
  currentSeason: SeasonDto = {};
  showDialog: boolean = false;
  submitLabel!: string;
  fbPlotYield!: FormGroup
  addFlag: boolean = true;
  plotInfo: PlotsDto = {};
  plotReports: PlotInfoDto[] = [];
  actionPlan: LookupDetailDto[] = [];
  perishedArea: LookupDetailDto[] = [];
  cropstypes: LookupDetailDto[] = [];
  weedstatus: LookupDetailDto[] = [];
  maintanenceItems?: MaintenanceItems = {};
  activeIndex?=0;
  activeIndex1?=0;
  activeIndex2?=0;

farmerHeaders: IHeader[] = [
  { field: 'seasonName', header: 'seasonName', label: 'Season' },
  { field: 'farmerCode', header: 'farmerCode', label: 'Farmer Code' },
  { field: 'farmerName', header: 'farmerName', label: 'Farmer Name' },
  { field: 'farmerVillageName', header: 'farmerVillageName', label: 'Farmer Village' },
];

plotHeaders: IHeader[] = [
  { field: 'OfferNo', header: 'OfferNo', label: 'Offer No' },
  { field: 'OfferDate', header: 'OfferDate', label: 'Offer Date' },
  { field: 'PlotVillageName', header: 'PlotVillageName', label: 'Plot Village' },
  { field: 'PlantType', header: 'PlantType', label: 'Plant Type' },
  { field: 'ExpectedArea', header: 'ExpectedArea', label: 'Area' },
  { field: 'VarietyId', header: 'VarietyId', label: 'Variety' },
  { field: 'PlantingDate', header: 'PlantingDate', label: 'Planting Date' },
];

clear(table: Table) {

  table.clear();
  this.filter.nativeElement.value = '';
}
constructor(private formbuilder: FormBuilder,
  private appMasterService: AppMasterService,
  private monitoringService: MonitoringService,
  private lookupService: LookupService,) { }

plotYieldForm() {
  this.fbPlotYield = this.formbuilder.group({
    seasonId:[(Validators.required)],
    plotReportId:[,(Validators.required)],
    actionPlan: ['',Validators.required],
    inspectionDate: ['',Validators.required],
    weedStatusId: ['',Validators.required],
    interCropId: ['',Validators.required],
    micronutrientdeficiency: [null],
    trashmulching: [null],
    gapfillingdone: [null],
    weedicides:this.formbuilder.array([]),
    pests:this.formbuilder.array([]),
    fertilizers:this.formbuilder.array([]),
    diseases:this.formbuilder.array([]),
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
    console.log(this.currentSeason)
    this.initPlotReports(this.currentSeason.seasonId!);
  });
}
 getPlotinfo(plotId: number) {
    this.monitoringService.GetPlotsinfo(plotId).subscribe((resp) => {
      this.plotInfo = resp as unknown as PlotsDto;
      console.log(this.plotInfo)
    })
  }
initPlotReports(season: number) {
  this.monitoringService.GetPlotsInSeason(season, 'Assessment').subscribe((resp) => {
    console.log(resp)
    this.plotReports = resp as unknown as PlotInfoDto[];    
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
ngOnInit(): void {
  this.currentSeasonCode = CURRENT_SEASON()
  
  this.plotYieldForm();
  this.initSeasons();
  this.initCurrentSeasons();
  this.initActionPlan();
  this.initPerishedArea();
  this.initweedstatus();
  this.initCropType();
}
getFormArrayControl(formGroupName: string): FormArray {
  return this.fbPlotYield.controls[formGroupName] as FormArray
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
initPlotyield(plotAssessmentId:number = -1){
  this.submitLabel = "Add Plot Yield";
  this.addFlag = true;
  this.showDialog = true;

  this.monitoringService.GetMaintenanceItemsForAssessment(plotAssessmentId).subscribe((resp) => {
    this.maintanenceItems = resp as unknown as MaintenanceItems;
    console.log(this.maintanenceItems);
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
ClearForm(){
  var temp = Object.assign({}, this.currentSeason);
  this.fbPlotYield.reset();
  this.plotInfo ={};
  (this.fbPlotYield.get("weedicides") as FormArray).clear();
  (this.fbPlotYield.get("fertilizers") as FormArray).clear();
  (this.fbPlotYield.get("pests") as FormArray).clear();
  (this.fbPlotYield.get("diseases") as FormArray).clear();
  this.activeIndex = this.activeIndex1 = this.activeIndex2 =0;
  this.currentSeason = Object.assign({}, temp);
  this.fbPlotYield.get('seasonId')?.patchValue(this.currentSeason.seasonId);
}
onSubmit(){
  if (this.fbPlotYield.valid) {
  }
  else {
    this.fbPlotYield.markAllAsTouched();
  }
}

}
