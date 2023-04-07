
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Table } from 'primeng/table';
import { SeasonDto } from "src/app/_models/applicationmaster";
import { IAgreementedPlotsViewDto, IFarmerInPlotOfferDto, IPlotOfferViewDto, PlotAgreementDto, PlotInfoDto } from "src/app/_models/monitoring";
import { SeasonScheduleGroupViewDto } from "src/app/_models/permits";
import { AppMasterService } from "src/app/_services/appmaster.service";
import { BillMasterService } from "src/app/_services/billmaster.service";
import { CommonService } from "src/app/_services/common.service";
import { JWTService } from "src/app/_services/jwt.service";
import { LookupService } from "src/app/_services/lookup.service";
import { MonitoringService } from "src/app/_services/monitoring.service";
import { CURRENT_SEASON } from "src/environments/environment";
import { permitService } from '../../_services/permit.service';

export class ScheduleGroupingDto {
  SeasonCode?: number;
  SchGroupNo?: number;
  FromDOP?: number;
  ToDOP?: number;
  NetArea?: number;
  EstimatedTon?: number;

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
  scheduleGroupings: SeasonScheduleGroupViewDto[] = [];
  scheduleGrouping: PlotAgreementDto = {};
  fbScheduleGrouping!: FormGroup;
  currentSeason: SeasonDto = {};
  allottedPlots: IPlotOfferViewDto[] = [];
  loading: boolean = true;
  showTable: boolean = true;
  showDialog: boolean = false;
  forapproval: boolean = false;
  globalFilterFields: string[] = ["seasonName", "offerNo", "agreementedDate", "farmerId", "farmerVillageName", "farmerName", "plotVillageName", "plantType",
    "expectedArea", "varietyId", "plantingDate"];
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild('dtSchedulegrouping') dtSchedulegrouping!: Table;
  submitLabel!: string;
  scheduleGroupingDto: ScheduleGroupingDto[] = [];
  scheduleGroupingFromDto: ScheduleGroupingFromDto[] = [];
  permissions: any;
  plotNumbers: PlotInfoDto[] = [];
  fbPlotAgreement!: FormGroup;
  todayDate = new Date();
  addFlag: boolean = true;


  farmerHeaders: IHeader[] = [
    { field: 'SeasonId', header: 'SeasonId', label: 'Season' },
    { field: 'GroupNo', header: 'GroupNo', label: 'Group No' },
    { field: 'ToDOP', header: 'ToDOP', label: 'To DOP' },
    { field: 'FromDOP', header: 'FromDOP', label: 'From DOP' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },

  ];

  plotHeaders: IHeader[] = [
    { field: 'plotNumber', header: 'plotNumber', label: 'Plot No' },
    { field: 'plotVillageName', header: 'plotVillageName', label: 'Plot Village' },
    { field: 'plantingDate', header: 'plantingDate', label: 'Planting Date' },
    { field: 'crop', header: 'crop', label: 'Crop' },
    { field: 'cropType', header: 'cropType', label: 'Crop Type' },
    { field: 'plantType', header: 'plantType', label: 'Plant Type' },
    { field: 'surveyNo', header: 'surveyNo', label: 'Survey No' },
    { field: 'variety', header: 'variety', label: 'Variety' },
    { field: 'plotType', header: 'plotType', label: 'Plot Type' },
    { field: 'measuredArea', header: 'measuredArea', label: 'Measured Area' },
    { field: 'agreementedArea', header: 'agreementedArea', label: 'Area' },
    { field: 'agreementedDate', header: 'agreementedDate', label: 'Agreemented Date' },
  ];


  constructor(private formbuilder: FormBuilder,
    private billMasterService: BillMasterService,
    private commonService: CommonService,
    private appMasterService: AppMasterService,
    private monitoringService: MonitoringService,
    private lookupService: LookupService,
    private scheduleService: permitService

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
    this.scheduleService.GetSeasonScheduleGroups(seasonId).subscribe((resp) => {
      this.scheduleGroupings = resp as unknown as SeasonScheduleGroupViewDto[];
      console.log(this.scheduleGroupings)
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
    var data = source.data as IFarmerInPlotOfferDto;
    this.monitoringService.GetFarmerPlotsInAgreement(data.seasonId, data.farmerId).subscribe(resp => {
      console.log(resp)
      data.objAgreementedPlots = resp as unknown as IAgreementedPlotsViewDto[];
    });
  }


  editPlotAgreement(scheduleGrouping: IAgreementedPlotsViewDto) {
    this.fbPlotAgreement.patchValue(scheduleGrouping);
    this.addFlag = false;
    this.submitLabel = 'Update Plot Agreement';
    this.showDialog = true;
  }


  onSearch() {
    this.dtSchedulegrouping.expandedRowKeys = {};
    // this.initScheduleGroups(this.currentSeason.seasonId!);
  }
  getScheduleGrouping() {
    this.showDialog = true;
  }

  onSubmit() {

  }


  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
    this.onSearch();
  }


}