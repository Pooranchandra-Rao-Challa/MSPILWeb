import { ThisReceiver } from "@angular/compiler";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { SeasonDto } from "src/app/_models/applicationmaster";
import { IPlotOfferViewDto } from "src/app/_models/monitoring";
import { AppMasterService } from "src/app/_services/appmaster.service";
import { BillMasterService } from "src/app/_services/billmaster.service";
import { CommonService } from "src/app/_services/common.service";
import { LookupService } from "src/app/_services/lookup.service";
import { MonitoringService } from "src/app/_services/monitoring.service";

export class ScheduleGroupingDto {
  SeasonCode?: number;
  SchGroupNo?: number;
  FromDOP?: number;
  ToDOP?: number; 
  NetArea?: number;
  EstimatedTon?: number;
  CreatedDate?: Date;
  CreatedBy?: string;
  UpdatedDate?: Date;
  UpdatedBy?: string;

}
export interface IHeader {
  field: string;
  header: string;
  label: string;
}

export class ScheduleGroupingFromDto {
  FarmerCode?: string;
  FarmerName?: string;
  PlotNo?: string;
  Division?: string;
  Circle?: string;
  Section?: string;
  Village?: string;
  NetArea?: number;
  EstimatedTon?: number;
  PlantingDate?: Date;
  NoOFSamples?: number;
  PlantType?: string;
  Variety?: string;

}

export interface IFromHeader {
  field: string;
  header: string;
  label: string;
}
@Component({
    selector: 'app-schedulegrouping',
    templateUrl: './schedulegrouping.component.html',
    styles: [],
  })
  export class ScheduleGroupingComponent implements OnInit {
    seasons!: any[];
    fbScheduleGrouping!: FormGroup;
    currentSeason: SeasonDto = {};
    allottedPlots: IPlotOfferViewDto[] = [];
    loading: boolean = true;
    showTable: boolean = true;
    showDialog: boolean = false;
    forapproval: boolean = false;
    @ViewChild('filter') filter!: ElementRef;
    submitLabel!: string;
    scheduleGroupingDto: ScheduleGroupingDto[] = [];
    scheduleGroupingFromDto: ScheduleGroupingFromDto[] = [];

    constructor(private formbuilder: FormBuilder,
        private billMasterService: BillMasterService,
        private commonService: CommonService,
        private appMasterService: AppMasterService,
        private monitoringService: MonitoringService,
        private lookupService:LookupService,
       
      ) { }

      headers: IHeader[] = [
        { field: 'SeasonCode', header: 'SeasonCode', label: 'Season Code' },
        { field: 'SchGroupNo', header: 'SchGroupNo', label: 'SchGroupNo' },
        { field: 'FromDOP', header: 'FromDOP', label: 'From DOP' },
        { field: 'ToDOP', header: 'ToDOP', label: 'To DOP' }, 
        { field: 'NetArea', header: 'NetArea', label: 'Net Area' },
        { field: 'EstimatedTon', header: 'EstimatedTon', label: 'Estimated Ton' },
        { field: 'CreatedDate', header: 'CreatedDate', label: 'Created Date' },
        { field: 'CreatedBy', header: 'CreatedBy', label: 'Created By' },
        { field: 'UpdatedDate', header: 'UpdatedDate', label: 'Updated Date' },
        { field: 'UpdatedBy', header: 'UpdatedBy', label: 'Updated By' },
    
      ];

      header: IHeader[] = [
        { field: 'FarmerCode', header: 'FarmerCode', label: 'FarmerCode' },
        { field: 'FarmerName', header: 'FarmerName', label: 'FarmerName' },
        { field: 'PlotNo', header: 'PlotNo', label: 'PlotNo' },
        { field: 'Division', header: 'Division', label: 'Division' },
        { field: 'Circle', header: 'Circle', label: 'Circle' },
        { field: 'Section', header: 'Section', label: 'Section' },
        { field: 'Village', header: 'Village', label: 'Village' },
        { field: 'NetArea', header: 'NetArea', label: 'Net Area' },
        { field: 'EstimatedTon', header: 'EstimatedTon', label: 'Estimated Ton' },
        { field: 'PlantingDate', header: 'PlantingDate', label: 'PlantingDate' }, 
        { field: 'NoOFSamples', header: 'NoOFSamples', label: 'NoOFSamples' },
        { field: 'PlantType', header: 'PlantType', label: 'PlantType' },
        { field: 'Variety', header: 'Variety', label: 'Variety' },
        
      ];


      getScheduleGrouping(){
        this.showDialog = true;
      }

      initSeasons() {
        this.commonService.GetSeasons().subscribe((resp) => {
          this.seasons = resp as any;
        });
      }
      initAllottedPlots(seasonId: number) {
        let param1 = this.filter.nativeElement.value == "" ? null : this.filter.nativeElement.value;
        this.monitoringService.GetPlotOffers(seasonId, this.forapproval, param1).subscribe((resp) => {
          this.allottedPlots = resp as unknown as IPlotOfferViewDto[];
          this.loading = false;
        });
      }
      initCurrentSeason(seasonCode: string) {
        this.appMasterService.CurrentSeason(seasonCode).subscribe((resp) => {
          this.currentSeason = resp as SeasonDto;
          this.initSeasons();
          this.initAllottedPlots(this.currentSeason.seasonId!);
        });
      }
     
      getFilterPermitQuota() {
        this.fbScheduleGrouping = this.formbuilder.group({
          seasonId: new FormControl('', [Validators.required]),
          scheduleGroupNo: new FormControl('', [Validators.required]),
          fromDOP: new FormControl('', [Validators.required]),
          toDOP: new FormControl('', [Validators.required]),
          ryotNo: new FormControl('', [Validators.required]),
          plot: new FormControl('', [Validators.required]),
          division: new FormControl('', [Validators.required]),
          circle: new FormControl('', [Validators.required]),
          section: new FormControl('', [Validators.required]),
          village: new FormControl('', [Validators.required]),
          plantType: new FormControl('', [Validators.required]),
          variety: new FormControl('', [Validators.required]),
          
        });
      }
      ngOnInit(): void {
   
        this.initSeasons();
        this.fillData();
        this.fillFromData();
      }
      onSubmit(){

      }

      fillData() {
        for (var i of [1, 2]) {
          this.scheduleGroupingDto.push(
            {
              SeasonCode: i,
              SchGroupNo: 1,
              FromDOP: 2,
              ToDOP: 1,
              NetArea: 1,
              EstimatedTon: 1,
              CreatedDate: new Date(),
              CreatedBy: 'CreatedBy' + i,
              UpdatedDate: new Date(),
              UpdatedBy: 'UpdatedBy' + i,

            }
          )
        }
      }
      
      fillFromData() {
        for (var i of [1, 2]) {
          this.scheduleGroupingFromDto.push(
            {
              FarmerCode: "Code",
              FarmerName: "name",
              PlotNo : '',
              Division: 'Division',
              Circle: '',
              Section: '',  
              Village: '',
              NetArea: 5,
              EstimatedTon: 4525,
              PlantingDate: new Date(),
              NoOFSamples: 2,
              PlantType: '',
              Variety: ''
            
            }
          )
        }
      }

  }