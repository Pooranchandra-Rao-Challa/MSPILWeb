import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators ,FormBuilder} from '@angular/forms';
import { Table } from 'primeng/table';
import { SeasonViewDto } from 'src/app/_models/applicationmaster';
import { PlotsDto } from 'src/app/_models/monitoring';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { MonitoringService } from 'src/app/_services/monitoring.service';

export interface IHeader {
  field: string;
  header: string;
  label: string;
}
@Component({
  selector: 'app-plotaggrement',
  templateUrl: './plotaggrement.component.html',
  styles: [
  ]
})
export class PlotaggrementComponent implements OnInit {
  globalFilterFields: string[] = ["seasonName", "offerNo", "offerDate", "farmerId", "farmerVillageName", "farmerName", "plotVillageName", "plantType",
    "expectedArea", "varietyId", "plantingDate"];
    @ViewChild('filter') filter!: ElementRef;
    seasons: SeasonViewDto[] = [];
    showDialog: boolean = false;
    submitLabel!: string;
    fbPlotAggrement!: FormGroup
    addFlag: boolean = true;
    plotInfo: PlotsDto = {};

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
    private monitoringService: MonitoringService,) { }

  plotAggrementForm() {
    this.fbPlotAggrement = this.formbuilder.group({
      seasonId:[(Validators.required)],
      plotReportId:[,(Validators.required)],
      aggrementArea: ['',Validators.required],
      aggrementDate: ['',Validators.required],
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
    return this.fbPlotAggrement.controls;
  }
    initSeasons() {
    this.appMasterService.Getseason().subscribe((resp) => {
      this.seasons = resp as unknown as SeasonViewDto[];
    });
  }
  // initPlotReports(season: number) {
  //   this.monitoringService.GetPlotsInSeason(season, 'Assessment').subscribe((resp) => {
  //     console.log(resp)
  //     this.plotReports = resp as unknown as PlotInfoDto[];
  //   })
  // }

  ngOnInit(): void {
    this.plotAggrementForm();
  }
  initPlotAggrement(){
    this.submitLabel = "Add Aggrement";
    this.addFlag = true;
    this.showDialog = true;
  }

  onSubmit(){

  }
}
