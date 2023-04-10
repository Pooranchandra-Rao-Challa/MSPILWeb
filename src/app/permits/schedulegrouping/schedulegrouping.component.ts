
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Table } from 'primeng/table';
import { MEDIUM_DATE } from "src/app/_helpers/date.format.pipe";
import { SeasonDto } from "src/app/_models/applicationmaster";
import {  PlotAgreementDto, PlotInfoDto } from "src/app/_models/monitoring";
import { IPlotScheduleViewDto, ISeasonScheduleGroupViewDto, } from "src/app/_models/permits";
import { AppMasterService } from "src/app/_services/appmaster.service";
import { CommonService } from "src/app/_services/common.service";
import { JWTService } from "src/app/_services/jwt.service";
import { CURRENT_SEASON } from "src/environments/environment";
import { permitService } from '../../_services/permit.service';


export interface IHeader {
  field: string;
  header: string;
  label: string;
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
  scheduleGroupings: ISeasonScheduleGroupViewDto[] = [];
  scheduleGrouping: PlotAgreementDto = {};
  fbScheduleGrouping!: FormGroup;
  currentSeason: SeasonDto = {};
  loading: boolean = true;
  showTable: boolean = true;
  showDialog: boolean = false;
  globalFilterFields: any
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild('dtSchedulegrouping') dtSchedulegrouping!: Table;
  submitLabel!: string;
  permissions: any;
  plotNumbers: PlotInfoDto[] = [];
  todayDate = new Date();
  addFlag: boolean = true;
  mediumDate: string = MEDIUM_DATE;
  objPlotSchedule:IPlotScheduleViewDto[]=[]

  farmerHeaders: IHeader[] = [
    { field: 'seasonName', header: 'seasonName', label: 'Season' },
    { field: 'groupNo', header: 'groupNo', label: 'Group No' },
    { field: 'toDOP', header: 'ToDOP', label: 'To DOP' },
    { field: 'fromDOP', header: 'fromDOP', label: 'From DOP' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },

  ];
  plotHeaders: IHeader[] = [
    { field: 'divisionName', header: 'divisionName', label: 'Division Name' },
    { field: 'circleName', header: 'circleName', label: 'Circle Name' },
    { field: 'sectionName', header: 'sectionName', label: 'Section Name' },
    { field: 'villageName', header: 'villageName', label: 'Village Name' },
    { field: 'farmerName', header: 'farmerName', label: 'Farmer Name' },
    { field: 'plantType', header: 'plantType', label: 'Plant Type' },
    { field: 'variety', header: 'variety', label: 'Variety' },
    { field: 'netArea', header: 'netArea', label: 'Net Area' },
    { field: 'estimatedTon', header: 'estimatedTon', label: 'Estimated Ton' },
  ];

  constructor(private formbuilder: FormBuilder,
    private commonService: CommonService,
    private appMasterService: AppMasterService,
    private permitService: permitService

  ) { }

  ngOnInit(): void {
    this.initCurrentSeason(CURRENT_SEASON());
    this.scheduleGroupingForm();
  }

  scheduleGroupingForm() {
    this.fbScheduleGrouping = this.formbuilder.group({
      seasonId: new FormControl(null, [Validators.required]),
      scheduleGroupNo: new FormControl(null, [Validators.required]),
      fromDOP: new FormControl(null, [Validators.required]),
      toDOP: new FormControl(null, [Validators.required]),
      ryotNo: new FormControl(null, [Validators.required]),
      plot: new FormControl(null, [Validators.required]),
      division: new FormControl(null, [Validators.required]),
      circle: new FormControl(null, [Validators.required]),
      section: new FormControl(null, [Validators.required]),
      village: new FormControl(null, [Validators.required]),
      plantType: new FormControl(null, [Validators.required]),
      variety: new FormControl(null, [Validators.required]),

    })
  }

  initSeasons() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp as any;
    });
  }
  initCurrentSeason(seasonCode: string) {
    this.appMasterService.CurrentSeason(seasonCode).subscribe((resp) => {
      this.currentSeason = resp as SeasonDto;
      this.initSeasons()
      // this.initPlotNumbers(this.currentSeason.seasonId!, -1);
      this.initScheduleGroups(this.currentSeason.seasonId!);
    });
  }
  initScheduleGroups(seasonId: number) {
    this.permitService.GetSeasonScheduleGroups(seasonId).subscribe((resp) => {
      this.scheduleGroupings = resp as unknown as ISeasonScheduleGroupViewDto[];
    });
  }


  // initPlotNumbers(season: number, plotId: number) {
  //   this.plotNumbers = [];
  //   this.monitoringService.GetPlotsInSeason(season, 'Agreement', plotId).subscribe((resp) => {
  //     this.plotNumbers = resp as unknown as PlotInfoDto[];
  //     console.log(this.plotNumbers)
  //   });
  // }


  onRowExpand(source: any) {
    var data = source.data as ISeasonScheduleGroupViewDto;
    this.permitService.GetFarmerPlotsInSchedule(data.seasonId, data.seasonScheduleId).subscribe(resp => {
      data.objPlotSchedule = resp as unknown as IPlotScheduleViewDto[];
    });
  }
  editscheduleGrouping(scheduleGrouping: ISeasonScheduleGroupViewDto) {
    this.fbScheduleGrouping.patchValue(scheduleGrouping);

    this.addFlag = false;
    this.submitLabel = 'Update Plot Agreement';
    this.showDialog = true;
  }
  onSearch() {
    this.dtSchedulegrouping.expandedRowKeys = {};
    this.initScheduleGroups(this.currentSeason.seasonId!);
  }
  getScheduleGrouping() {
    this.showDialog = true;
  }

  onSubmit() {
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';

  }


}