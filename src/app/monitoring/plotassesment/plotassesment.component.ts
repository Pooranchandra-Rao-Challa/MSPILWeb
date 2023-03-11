import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Table } from 'primeng/table';
import { FarmersViewDto, LookupDetailDto, plantTypeDto, SeasonDto, SeasonViewDto } from 'src/app/_models/applicationmaster';
import { PlotAssessmentViewDto, plotAssessmentWeedicidesDto } from 'src/app/_models/monitoring';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { MonitoringService } from 'src/app/_services/monitoring.service';



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
  crops:LookupDetailDto[] =[];
  cropstypes:LookupDetailDto[] =[];
  planttypes:plantTypeDto[]=[];
  varitytype:LookupDetailDto[] =[];
  plottype:LookupDetailDto[] =[];
  weedstatus:LookupDetailDto[] =[];
  weedicideId:plotAssessmentWeedicidesDto[] =[];
  plotAssessments:PlotAssessmentViewDto[] =[];

  constructor(private formbuilder: FormBuilder,
    private appMasterService: AppMasterService,
    private lookupService: LookupService,
    private monitoringService:MonitoringService) { }
  initAssesments() {
    this.submitLabel = "Add Assesment";
    this.addFlag = true;
    this.showDialog = true;
  }

  ngOnInit(): void {
    // let currentSeason = '2019-2020';
//  this.initCurrentSeason(currentSeason);
 this.plotAssesmentForm();
 this.initSeasons();
 this.initFarmers();
 this.initCrop();
 this.initCropType();
 this.initPlanttype();
 this.initVarity();
 this.initplottype();
 this.initweedstatus();
 this.disabledFormControls();
  }

  initSeasons() {
    this.appMasterService.Getseason().subscribe((resp) => {
      this.seasons = resp as unknown as SeasonViewDto[];

    });
  }
  initFarmers() {
    this.appMasterService.GetFarmers().subscribe((resp) => {
      this.farmers = resp as unknown as FarmersViewDto[];
      this.loading = false;
    })
  }
  initCropType(){
    this.lookupService.Crops().subscribe((resp) => {
      this.cropstypes = resp as unknown as LookupDetailDto[];
    });
  }
  initCrop(){
    this.lookupService.CropTypes().subscribe((resp) => {
      this.crops = resp as unknown as LookupDetailDto[];
    });
  }
  initPlanttype(){
    this.appMasterService.GetPlantTypeForPlantSubType().subscribe((resp) => {
      this.planttypes = resp as unknown as plantTypeDto[];
    });
  }
  initVarity(){
    this.lookupService.VarietyTypes().subscribe((resp) => {
      this.varitytype = resp as unknown as LookupDetailDto[];
    });
  }
  initplottype(){
    this.lookupService.PlotTypes().subscribe((resp) => {
      this.plottype = resp as unknown as LookupDetailDto[];
    });
  }
initweedstatus(){
    this.lookupService.WeedStatuses().subscribe((resp) => {
      this.weedstatus = resp as unknown as LookupDetailDto[];
    });
  }
  // initCurrentSeason(seasonCode: string) {
  //   this.appMasterService.CurrentSeason(seasonCode).subscribe((resp) => {
  //     this.currentSeason = resp as SeasonDto;
  //     this.initSeasons();
  //     this.initPlotAssesments(this.currentSeason.seasonId!);
  //   });
  // }
  initPlotAssesments(seasonId: number) {
    let param1 = this.filter.nativeElement.value == "" ? null : this.filter.nativeElement.value;
    this.monitoringService.GetPlotAssessments(seasonId, param1).subscribe((resp) => {
      this.plotAssessments = resp as unknown as PlotAssessmentViewDto[];
      console.log(this.plotAssessments);
    });
  }
  onSearch() {
    this.initPlotAssesments(this.currentSeason.seasonId!);
  }

  plotAssesmentForm(){
    this.fbPlotAssesment = this.formbuilder.group({
      seasonId:[null],
      plotReportId:[null], 
      croptype:[],
      crop:[],
      offeredno:[],
      farmerId:[],
      farmername:[],
      fathername:[],
      division:[],
      circle:[],
      section:[],
      farmervillage:[],
      plotareavillage:[],
      planttype:[],
      plottype:[],
      surveyno:[],
      reportedarea:[],
      plantingdate:[],
      variety:[],
      agreedton:[],
      fieldname:[],
      birnumber:[],
      birdate:[],
      measurearea:[],
      inspectiondate:[],
      demoplotarea:[true],
      isactive:[true],
      weedstatus:[],
      intercroping:[],
      micronutrientdeficiency:[true],
      trashmulching:[true],
      gapfillingdone:[true]
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
  onSubmit(){
          
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

}
