import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Table } from 'primeng/table';
// import { WeedicideDto } from 'src/app/_models/monitoring';
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
  constructor(private formbuilder: FormBuilder,
    private monitoringService: MonitoringService,) { }
  initAssesments() {
    this.submitLabel = "Add Assesment";
    this.addFlag = true;
    this.showDialog = true;
  }
  ngOnInit(): void {
 this. plotAssesmentForm()
  }
  plotAssesmentForm(){
    this.fbPlotAssesment = this.formbuilder.group({
      seasonId:[null],
      plotReportId:[null], 
      croptype:[],
      crop:[],
      offeredno:[],
      farmercode:[],
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
  onSubmit(){
  console.log(this.fbPlotAssesment.value);
  }
// initWeed(){
//   this.monitoringService.GetAllWeed().subscribe(resp => {
//     this.weed.Weedicide = resp as unknown as WeedicideDto[];
//   })
// }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

}
