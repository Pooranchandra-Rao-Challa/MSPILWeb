import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { FarmersViewDto, LookupDetailDto, plantTypeDto, SeasonDto, SeasonViewDto } from 'src/app/_models/applicationmaster';
import { PlotAssessmentViewDto, plotAssessmentWeedicidesDto, PlotReportDto } from 'src/app/_models/monitoring';
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
  farmers: FarmersViewDto[] = [];
  crops: LookupDetailDto[] = [];
  cropstypes: LookupDetailDto[] = [];
  planttypes: plantTypeDto[] = [];
  varitytype: LookupDetailDto[] = [];
  plottype: LookupDetailDto[] = [];
  weedstatus: LookupDetailDto[] = [];
  weedicideId: plotAssessmentWeedicidesDto[] = [];
  plotAssessments: PlotAssessmentViewDto[] = [];
  weedicides:LookupDetailDto[] =[]
  plotReports: PlotReportDto[] =[];
  currentSeasonCode?: string;
  pests:LookupDetailDto[] =[];
  fertilizers:LookupDetailDto[] =[];
  Diseases:LookupDetailDto[] =[];
  

  constructor(private formbuilder: FormBuilder,
    private appMasterService: AppMasterService,
    private lookupService: LookupService,
    private monitoringService: MonitoringService) { }
    headers: IHeader[] = [
      { field: 'cropType', header: 'cropType', label: 'Crop' },
      { field: 'season', header: 'season', label:'Season' },
      { field: 'offerNo', header: 'offerNo', label: 'OfferNo' },
      { field: 'farmerCode', header: 'farmerCode', label: 'farmer Name' },
      { field: 'farmerVillageName', header: 'farmerVillageName', label: 'Village Name' },
      { field: 'plantType', header: 'plantType', label: 'Plant Type' },
      { field: 'surveyNo', header: 'surveyNo', label: 'Survey No' },
      { field: 'plotNumber', header: 'plotNumber', label: 'Plot Number' },
      { field: 'plantingDate', header: 'plantingDate', label: 'Planting Date' },
      { field: 'variety', header: 'variety', label: 'Variety' },
      { field: 'fieldName', header: 'fieldName', label: 'Field Name' },
      { field: 'plotType', header: 'plotType', label: 'plot Type'},
      { field: 'assessedArea', header: 'assessedArea', label: 'Measured Area' },
      { field: 'assessedDate', header: 'assessedDate', label: 'Measured Date'},
  
    ];
  initPlotAssesment() {
    this.submitLabel = "Add Assesment";
    this.addFlag = true;
    this.showDialog = true;

    this.fbPlotAssesment.patchValue({"seasonId":this.currentSeason.seasonId});
    const formArray = this.fbPlotAssesment.get("weedicides") as FormArray;
    this.weedicides.forEach(weed =>{
      console.log(weed);

      formArray.push(this.createWeed(weed));
    })
  this.pest();
  this.Fertilizer();
  this.Disease();
  }

  pest(){
  this.fbPlotAssesment.patchValue({"seasonId":this.currentSeason.seasonId});
    const formArray = this.fbPlotAssesment.get("pests") as FormArray;
    this.pests.forEach(pest =>{
      console.log(pest);

      formArray.push(this.createpests(pest));
    })
  }
  Fertilizer(){
    this.fbPlotAssesment.patchValue({"seasonId":this.currentSeason.seasonId});
    const formArray = this.fbPlotAssesment.get("fertilizers") as FormArray;
    this.fertilizers.forEach(fertilizer=>{
      console.log(fertilizer);

      formArray.push(this.createFertlizer(fertilizer));
    })
  }
  Disease(){
    this.fbPlotAssesment.patchValue({"seasonId":this.currentSeason.seasonId});
    const formArray = this.fbPlotAssesment.get("diseases") as FormArray;
    this.Diseases.forEach(diseases=>{
      console.log(diseases);

      formArray.push(this.createDisease(diseases));
    })
  }
  
  ngOnInit(): void {
    this.currentSeasonCode = CURRENT_SEASON()
    console.log(this.currentSeasonCode);
   
   
    this.plotAssesmentForm();
    this.initCurrentSeasons();
    this.initSeasons();
    this.initFarmers();
    this.initCrop();
    this.initCropType();
    this.initPlanttype();
    this.initVarity();
    this.initplottype();
    this.initweedstatus();
    this.disabledFormControls();
    this.initWeedicides();
    this.initPests();
    this.initFertlizers();
    this.initDisease();
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

  initPlotReports(season: number){
    this.monitoringService.GetPlotReportsInSeason(season).subscribe((resp)=>{
      console.log(resp);

      this.plotReports = resp as unknown as PlotReportDto[];
    })
  }

  initFarmers() {
    this.appMasterService.GetFarmers().subscribe((resp) => {
      this.farmers = resp as unknown as FarmersViewDto[];
      this.loading = false;
    })
  }
  initCropType() {
    this.lookupService.Crops().subscribe((resp) => {
      this.cropstypes = resp as unknown as LookupDetailDto[];
    });
  }
  initCrop() {
    this.lookupService.CropTypes().subscribe((resp) => {
      this.crops = resp as unknown as LookupDetailDto[];
    });
  }
  initPlanttype() {
    this.appMasterService.GetPlantTypeForPlantSubType().subscribe((resp) => {
      this.planttypes = resp as unknown as plantTypeDto[];
    });
  }
  initVarity() {
    this.lookupService.VarietyTypes().subscribe((resp) => {
      this.varitytype = resp as unknown as LookupDetailDto[];
    });
  }
  initplottype() {
    this.lookupService.PlotTypes().subscribe((resp) => {
      this.plottype = resp as unknown as LookupDetailDto[];
    });
  }
  initweedstatus() {
    this.lookupService.WeedStatuses().subscribe((resp) => {
      this.weedstatus = resp as unknown as LookupDetailDto[];
    });
  }

  initWeedicides() {
    this.lookupService.Weeds().subscribe((resp) => {
      this.weedicides = resp as unknown as LookupDetailDto[];
    });
  }
  initPests(){
    this.lookupService.Pests().subscribe((resp) => {
      this.pests = resp as unknown as LookupDetailDto[];
      // console.log(resp)
    });
  }
  initFertlizers(){
    this.lookupService.Fertilizers().subscribe((resp) => {
      this.fertilizers = resp as unknown as LookupDetailDto[];
      // console.log(resp)
  })
}
initDisease(){
  this.lookupService.Diseases().subscribe((resp) => {
    this.Diseases = resp as unknown as LookupDetailDto[];
    // console.log(resp)
  })
}
  initPlotAssesments(seasonId: number) {
    this.monitoringService.GetPlotAssessments(seasonId).subscribe((resp) => {
      this.plotAssessments = resp as unknown as PlotAssessmentViewDto[];
      console.log(resp)
    })
  }
 
  onSearch() {
    this.initPlotAssesments(this.currentSeason.seasonId!);
  }

  plotAssesmentForm() {
    this.fbPlotAssesment = this.formbuilder.group({
      seasonId: ['', Validators.required],
      plotReportId: ['',Validators.required],
      croptype: ['',Validators.required],
      crop: [],
      offeredno: [],
      farmerId: [],
      farmername: [],
      fathername: [],
      division: [],
      circle: [],
      section: [],
      farmervillage: [],
      plotareavillage: [],
      planttype: [],
      plottype: [],
      surveyno: [],
      reportedarea: [],
      plantingdate: [],
      variety: [],
      agreedton: [],
      fieldname: [],
      birnumber: [],
      birdate: [],
      measurearea: [],
      inspectiondate: [],
      demoplotarea: [true],
      isactive: [true],
      weedstatus: [],
      intercroping: [],
      micronutrientdeficiency: [true],
      trashmulching: [true],
      gapfillingdone: [true],
      weedicides:this.formbuilder.array([]),
      pests:this.formbuilder.array([]),
      fertilizers:this.formbuilder.array([]),
      diseases:this.formbuilder.array([]),
    })
  }

  getFormArrayControl(formGroupName: string):FormArray{
    return this.fbPlotAssesment.controls[formGroupName] as FormArray
  }
  
  createpests(pest:LookupDetailDto,plotAssessmentpests?:any):  FormGroup {
    return this.formbuilder.group({
      pestsId: [pest.lookupId],
      plotAssessmentpestsId:[plotAssessmentpests?.pestid==pest.lookupId ? plotAssessmentpests?.id:''],
      name :[pest.name],
      remarks: [pest.remarks],
      // identifieddate:[],
      // controldate:[],
    })
  }
  createWeed(weed: LookupDetailDto,plotAssessmentWeeds?:any): FormGroup {
    return this.formbuilder.group({
      weedicideId: [weed.lookupDetailId],
      plotAssessmentWeedicideId: [plotAssessmentWeeds?.weedid==weed.lookupId ? plotAssessmentWeeds?.id:''],
      name: [weed.name],
      checked:[plotAssessmentWeeds?.weedid==weed.lookupId],
    });
  }
  createFertlizer(fertlizer: LookupDetailDto,plotAssessmentfertlizers?:any): FormGroup {
    return this.formbuilder.group({
      fertlizerId: [fertlizer.lookupDetailId],
      plotAssessmentfertlizerId: [plotAssessmentfertlizers?.fertlizerid==fertlizer.lookupId ? plotAssessmentfertlizers?.id:''],
      name: [fertlizer.name],
      checked:[plotAssessmentfertlizers?.fertlizerid==fertlizer.lookupId],
    });
  }
  createDisease(disease:LookupDetailDto,plotAssessmentdiseases?:any):  FormGroup {
    return this.formbuilder.group({
      diseaseId: [disease.lookupId],
      plotAssessmentdiseasesId:[plotAssessmentdiseases?. diseaseId==disease.lookupId ? plotAssessmentdiseases?.id:''],
      name :[disease.name],
      remarks: [disease.remarks],
      // identifieddate:[],
      // controldate:[],
    })
  }
  onSelectedFarmer(farmerId: number) {
    this.farmers.forEach((value) => {
      if (value.farmerId == farmerId) {
        this.fbPlotAssesment.controls['farmername'].setValue(value.farmerName);
        this.fbPlotAssesment.controls['fathername'].setValue(value.fatherName);
        this.fbPlotAssesment.controls['farmervillage'].setValue(value.villageName);
        this.fbPlotAssesment.controls['division'].setValue(value.divisionName);
        this.fbPlotAssesment.controls['circle'].setValue(value.circleName);
        this.fbPlotAssesment.controls['section'].setValue(value.sectionName);
      }
    });
  }
  disabledFormControls() {
    this.fbPlotAssesment.controls['farmername'].disable();
    this.fbPlotAssesment.controls['fathername'].disable();
    this.fbPlotAssesment.controls['farmervillage'].disable();
    this.fbPlotAssesment.controls['division'].disable();
    this.fbPlotAssesment.controls['circle'].disable();
    this.fbPlotAssesment.controls['section'].disable();
  }
  onSubmit() {
    console.log(this.fbPlotAssesment.value);

  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {

    table.clear();
    this.filter.nativeElement.value = '';

  }

}
