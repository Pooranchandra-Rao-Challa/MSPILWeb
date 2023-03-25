import { FertilizerComponent } from './../../masters/applicationmasters/fertilizer/fertilizer.component';
import { HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs/internal/Observable';
import {  LookupDetailDto,  SeasonDto, SeasonViewDto,} from 'src/app/_models/applicationmaster';
import { IFarmerInPlotOfferDto, IPlotReportViewDto, MaintenanceItems, MaintWeedicideDto, MaintDiseaseDto, MaintFertilizerDto, MaintPestDto, PlotAssessmentViewDto, plotAssessmentWeedicidesDto, PlotReportDto, PlotInfoDto, PlotsDto } from 'src/app/_models/monitoring';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { MonitoringService } from 'src/app/_services/monitoring.service';
import { CURRENT_SEASON } from 'src/environments/environment';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';


export interface IHeader {
  field: string;
  header: string;
  label: string;
}
@Component({
  selector: 'app-plotassesment',
  templateUrl: './plotassesment.component.html',
  styles: [
  ]
})

export class PlotassesmentComponent implements OnInit {
  showDialog: boolean = false;
  submitLabel!: string;
  filter: any;
  loading: boolean = true;
  addFlag: boolean = true;
  fbPlotAssesment!: FormGroup
  seasons: SeasonViewDto[] = [];
  currentSeason: SeasonDto = {};
  cropstypes: LookupDetailDto[] = [];
  weedstatus: LookupDetailDto[] = [];
  weedicideId: plotAssessmentWeedicidesDto[] = [];
  plotAssessments: IFarmerInPlotOfferDto[] = [];
  plotReports: PlotInfoDto[] = [];
  currentSeasonCode?: string;
  plotReportsinfo: IPlotReportViewDto[] = [];
  plotInfo:PlotsDto = {};
  mediumDate: string = MEDIUM_DATE;
  maintanenceItems?: MaintenanceItems = {}

  constructor(private formbuilder: FormBuilder,
    private appMasterService: AppMasterService,
    private lookupService: LookupService,
    private monitoringService: MonitoringService) { }
  farmerHeader: IHeader[] = [
    { field: 'season', header: 'season', label: 'Season' },
    { field: 'farmerCode', header: 'farmerCode', label: 'farmer Code' },
    { field: 'fatherName', header: 'fatherName', label: 'father Name' },
    { field: 'farmerVillageName', header: 'farmerVillageName', label: 'Village Name' }
  ];

  plotHeader: IHeader[] = [
    { field: 'cropType', header: 'cropType', label: 'Crop Type' },
    { field: 'OfferNo', header: 'OfferNo', label: 'OfferNo' },
    { field: 'plantType', header: 'PlantType', label: 'Plant Type' },
    { field: 'SurveyNo', header: 'SurveyNo', label: 'Survey No' },
    { field: 'PlotNumber', header: 'PlotNumber', label: 'Plot Number' },
    { field: 'PlantingDate', header: 'PlantingDate', label: 'Planting Date' },
    { field: 'Variety', header: 'Variety', label: 'Variety' },
    { field: 'FieldName', header: 'FieldName', label: 'Field Name' },
    { field: 'PlotType', header: 'PlotType', label: 'plot Type' },
    { field: 'AssessedArea', header: 'AssessedArea', label: 'Assessed Area' },
    { field: 'AssessedDate', header: 'AssessedDate', label: 'Assessed Date' },

  ];

  initPlotAssesment(plotAssessmentId: number = -1) {
    this.submitLabel = "Add Assesment";
    this.addFlag = true;
    this.showDialog = true;

    this.monitoringService.GetMaintenanceItemsForAssessment(plotAssessmentId).subscribe((resp) => {
      this.maintanenceItems = resp as unknown as MaintenanceItems;
      console.log(this.maintanenceItems);
      this.initMaintanenceItems();
    });
  }

  initMaintanenceItems() {
    const weedicideArray = this.fbPlotAssesment.get("weedicides") as FormArray;
    console.log(this.maintanenceItems?.weedicides);

    this.maintanenceItems?.weedicides?.forEach(weedicide => {
      weedicideArray.push(this.createWeed(weedicide))
    })
    const fertilizerArray = this.fbPlotAssesment.get("fertilizers") as FormArray;
    this.maintanenceItems?.fertilizers?.forEach(fertilizer => {
      fertilizerArray.push(this.createFertlizer(fertilizer))
    })
    const pestArray = this.fbPlotAssesment.get("pests") as FormArray;
    this.maintanenceItems?.pests?.forEach(pest => {
      pestArray.push(this.createpests(pest))
    })
    const diseaseArray = this.fbPlotAssesment.get("diseases") as FormArray;
    this.maintanenceItems?.diseases?.forEach(disease => {
      diseaseArray.push(this.createDisease(disease))
    })
  }

  ngOnInit(): void {
    this.currentSeasonCode = CURRENT_SEASON()
    console.log(this.currentSeasonCode);

    this.plotAssesmentForm();
    this.initCurrentSeasons();
    this.initSeasons();
    this.initCropType();
    this.initweedstatus();
  }
  initSeasons() {
    this.appMasterService.Getseason().subscribe((resp) => {
      this.seasons = resp as unknown as SeasonViewDto[];
    });
  }
  initCurrentSeasons() {
    this.appMasterService.CurrentSeason(this.currentSeasonCode!).subscribe((resp) => {
      this.currentSeason = resp as unknown as SeasonDto;
      console.log(this.currentSeason);
      this.initPlotReports(this.currentSeason.seasonId!);
      this.initPlotAssesments(this.currentSeason.seasonId!);
    });
  }
  getPlotinfo(plotId:number){
  this.monitoringService.GetPlotsinfo(plotId).subscribe((resp)=>{
   this.plotInfo = resp as unknown as PlotsDto;
   console.log(this.plotInfo)
  })
  }
  initPlotReports(season: number){
  this.monitoringService.GetPlotsInSeason(season,'Assessment').subscribe((resp)=>{
  console.log(resp)
  this.plotReports = resp as unknown as PlotInfoDto[];
})
  }

  initPlotAssesments(seasonId: number) {
    this.monitoringService.GetPlotAssessments(seasonId).subscribe((resp) => {
      this.plotAssessments = resp as unknown as IFarmerInPlotOfferDto[];
      this.plotAssessments.forEach((farmer) => {
        farmer.ObjMeasuredPlots = JSON.parse(farmer.measuredPlots) as PlotAssessmentViewDto[]
      })
      console.log(this.plotAssessments)
    })
  }
  onSearch() {
    this.initPlotAssesments(this.currentSeason.seasonId!);
  }

  plotAssesmentForm() {
    this.fbPlotAssesment = this.formbuilder.group({
      seasonId: [{ value: this.currentSeason.seasonId }, (Validators.required)],
      plotId: [, (Validators.required)],
      assessedArea: ['', Validators.required],
      assessedDate: ['', Validators.required],
      demoplotarea: [true],
      weedStatusId: ['', Validators.required],
      interCropId: ['', Validators.required],
      micronutrientdeficiency: [true],
      trashmulching: [true],
      gapfillingdone: [true],
      weedicides: this.formbuilder.array([]),
      pests: this.formbuilder.array([]),
      fertilizers: this.formbuilder.array([]),
      diseases: this.formbuilder.array([]),
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
  get FormControls() {
    return this.fbPlotAssesment.controls;
  }

  getFormArrayControl(formGroupName: string): FormArray {
    return this.fbPlotAssesment.controls[formGroupName] as FormArray
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
  createFertlizer(fertlizer: MaintFertilizerDto): FormGroup {
    return this.formbuilder.group({
      fertlizerId: [fertlizer.fertilizerId],
      plotAssessmentId: [fertlizer.plotAssessmentId],
      name: [fertlizer.name],
      checked: [fertlizer.selected],
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
  savePlotAssessment(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.monitoringService.CreatePlotReport(this.fbPlotAssesment.value)
    else return this.monitoringService.UpdatePlotReport(this.fbPlotAssesment.value)
  }
  onSubmit() {
    if (this.fbPlotAssesment.valid) {
      console.log(this.fbPlotAssesment.value);
    }
    else {
      this.fbPlotAssesment.markAllAsTouched();
    }
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

}
