import { formatDate } from "@angular/common";
import { ThisReceiver } from "@angular/compiler";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Table } from 'primeng/table';
import { MEDIUM_DATE } from "src/app/_helpers/date.format.pipe";
import { plantTypeDto, SeasonDto, SeasonViewDto, VarietyViewDto } from "src/app/_models/applicationmaster";
import { IPlotsofFarmerViewDto, PlotAgreementDto, PlotInfoDto } from "src/app/_models/monitoring";
import { CircleforUserDto, DivisionsforUserDto, ExcessTonViewDto, FarmersInPlantingDatesDto, FarmersInPlotsForUserDto, IPlotScheduleViewDto, ISeasonScheduleGroupViewDto, PlantTypeForUserDto, PlotsForUserDto, ScheduleGroupPlotsDto, SectionforUserDto, VarietiesForUserDto, VillageforUserDto, } from "src/app/_models/permits";
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
  seasons: SeasonViewDto[] = [];
  scheduleGroupings: ISeasonScheduleGroupViewDto[] = [];
  scheduleGrouping: PlotAgreementDto = {};
  fbScheduleGrouping!: FormGroup;
  scheduleGroupingPlots: ScheduleGroupPlotsDto[] = [];
  schedule: ScheduleGroupPlotsDto[] = [];
  currentSeason: SeasonDto = {};
  loading: boolean = true;
  showTable: boolean = true;
  showDialog: boolean = false;
  showDialog1: boolean = false
  globalFilterFields: any
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild('dtSchedulegrouping') dtSchedulegrouping!: Table;
  submitLabel!: string;
  permissions: any;
  showForm: boolean = false;
  todayDate = new Date();
  addFlag: boolean = true;
  mediumDate: string = MEDIUM_DATE;
  planttypes: PlantTypeForUserDto[] = [];
  varieties: VarietiesForUserDto[] = [];
  farmers: FarmersInPlotsForUserDto[] = [];
  plots: PlotsForUserDto[] = [];
  objPlotSchedule: IPlotScheduleViewDto[] = []
  divisions: DivisionsforUserDto[] = [];
  sections: SectionforUserDto[] = [];
  circles: CircleforUserDto[] = [];
  villages: VillageforUserDto[] = [];
  filterCircles: CircleforUserDto[] = [];
  filterSections: SectionforUserDto[] = [];
  filterVillages: VillageforUserDto[] = [];
  filterFarmers: FarmersInPlotsForUserDto[] = [];
  filterPlots: PlotsForUserDto[] = []
  filterPlantTypes: PlantTypeForUserDto[] = [];
  filterVarieties: VarietiesForUserDto[] = [];
  excessTons: ExcessTonViewDto[] = [];

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
    { field: 'plantTypeName', header: 'plantTypeName', label: 'Plant Type' },
    { field: 'varietyName', header: 'varietyName', label: 'Variety' },
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
    this.initDivisions();
    this.initSections();
    this.initCircles();
    this.initVillages();
  }

  scheduleGroupingForm() {
    this.fbScheduleGrouping = this.formbuilder.group({
      seasonId: new FormControl(null, [Validators.required]),
      scheduleGroupNo: new FormControl(null, [Validators.required]),
      fromDOP: new FormControl(null, [Validators.required]),
      toDOP: new FormControl(null, [Validators.required]),
      farmerId: new FormControl('', [Validators.required]),
      plotId: new FormControl(null, [Validators.required]),
      divisionId: new FormControl('', [Validators.required]),
      circleId: new FormControl('', [Validators.required]),
      sectionId: new FormControl('', [Validators.required]),
      villageId: new FormControl('', [Validators.required]),
      plantTypeId: new FormControl(null, [Validators.required]),
      varietyId: new FormControl(null, [Validators.required]),
    })
  }

  initSeasons() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp as any;
    });
  }
  initCurrentSeason(seasonCode: string) {
    this.appMasterService.CurrentSeason(seasonCode).subscribe((resp) => {
      this.currentSeason = resp as unknown as SeasonDto;
      this.initSeasons();
      this.initScheduleGroups(this.currentSeason.seasonId!);
      this.initVarieties(this.currentSeason.seasonId!);
      this.initPlantType(this.currentSeason.seasonId!)
    });
  }
  initScheduleGroups(seasonId: number) {
    this.permitService.GetSeasonScheduleGroups(seasonId).subscribe((resp) => {
      this.scheduleGroupings = resp as unknown as ISeasonScheduleGroupViewDto[];
    });
  }

  initDivisions() {
    this.permitService.GetDivisionsforUser().subscribe((resp) => {
      this.divisions = resp as unknown as DivisionsforUserDto[];

    });
  }
  initSections() {
    this.permitService.GetSectionsforUser().subscribe((resp) => {
      this.sections = resp as unknown as SectionforUserDto[];
    });
  }
  initCircles() {
    this.permitService.GetCirclesforUser().subscribe((resp) => {
      this.circles = resp as unknown as CircleforUserDto[];
    });
  }
  initVillages() {
    this.permitService.GetVillagesforUser().subscribe((resp) => {
      this.villages = resp as unknown as VillageforUserDto[];
      console.log(this.villages)
    });
  }
  initVarieties(seasonId: number) {
    this.permitService.GetVarietiesForUser(seasonId).subscribe((resp) => {
      this.varieties = resp as unknown as VarietiesForUserDto[];
    });
  }

  initPlantType(seasonId: number) {
    this.permitService.GetPlantTypeForUser(seasonId).subscribe((resp) => {
      this.planttypes = resp as unknown as PlantTypeForUserDto[];
      
    });
  }
  toggleTab() {
    this.showForm = !this.showForm;
  }
  GetFarmers() {
    if (this.fbScheduleGrouping.value.seasonId != null && this.fbScheduleGrouping.value.villageId != null) {
      var seasonId = this.fbScheduleGrouping.value.seasonId;
      var villageId = this.fbScheduleGrouping.value.villageId
      this.permitService.GetFarmersInPlotsForUser(seasonId, villageId).subscribe((resp) => {
        this.farmers = resp as unknown as FarmersInPlotsForUserDto[];
        console.log('farmers', this.farmers);
      })
    }
  }
  GetPlots() {
    if (this.fbScheduleGrouping.value.seasonId != null && this.fbScheduleGrouping.value.farmerId != null) {
      var seasonId = this.fbScheduleGrouping.value.seasonId;
      var farmerId = this.fbScheduleGrouping.value.farmerId
      this.permitService.GetPlotsForUser(seasonId, farmerId).subscribe((resp) => {
        this.plots = resp as unknown as PlotsForUserDto[];
        console.log('plots', this.plots);
      })
    }
  }


  SetAllDivisionChilds(values: number[]) {
    if (values.length == 0) {
      this.filterCircles = Object.assign([], this.circles);
      this.filterSections = Object.assign([], this.sections);
      this.filterVillages = Object.assign([], this.villages);
      this.filterFarmers = Object.assign([], this.farmers);
      this.filterPlots = Object.assign([], this.plots);
      this.filterPlantTypes = Object.assign([], this.planttypes);
      this.filterVarieties = Object.assign([], this.varieties);
    }
    else {
      this.filterCircles = this.circles.filter(circle => values.indexOf(circle.divisionId!) != -1);
      this.filterSections = this.sections.filter(section => values.indexOf(section.divisionId!) != -1)
      this.filterVillages = this.villages.filter(village => values.indexOf(village.divisionId!) != -1)
      this.filterFarmers = this.farmers.filter(farmer => values.indexOf(farmer.divisionId!) != -1)
      this.filterPlots = this.plots.filter(plot => values.indexOf(plot.divisionId!) != -1)
      this.filterPlantTypes = this.planttypes.filter(planttype => values.indexOf(planttype.divisionId!) != -1)
      this.filterVarieties = this.varieties.filter(variety => values.indexOf(variety.divisionId!) != -1)
    }
  }

  SetAllCircleChilds(values: number[]) {
    if (values.length == 0) {
      this.filterSections = Object.assign([], this.sections);
      this.filterVillages = Object.assign([], this.villages);
      this.filterFarmers = Object.assign([], this.farmers);
      this.filterPlots = Object.assign([], this.plots);
      this.filterPlantTypes = Object.assign([], this.planttypes);
      this.filterVarieties = Object.assign([], this.varieties);
    }
    else {
      this.filterSections = this.sections.filter(section => values.indexOf(section.circleId!) != -1)
      this.filterVillages = this.villages.filter(village => values.indexOf(village.circleId!) != -1)
      this.filterFarmers = this.farmers.filter(farmer => values.indexOf(farmer.circleId!) != -1)
      this.filterPlots = this.plots.filter(plot => values.indexOf(plot.circleId!) != -1)
      this.filterPlantTypes = this.planttypes.filter(planttype => values.indexOf(planttype.circleId!) != -1)
      this.filterVarieties = this.varieties.filter(variety => values.indexOf(variety.circleId!) != -1)
    }
  }

  SetAllSectionChilds(values: number[]) {
    if (values.length == 0) {
      this.filterVillages = Object.assign([], this.villages);
      this.filterFarmers = Object.assign([], this.farmers);
      this.filterPlots = Object.assign([], this.plots);
      this.filterPlantTypes = Object.assign([], this.planttypes);
      this.filterVarieties = Object.assign([], this.varieties);
    }
    else {
      this.filterVillages = this.villages.filter(village => values.indexOf(village.sectionId!) != -1)
      this.filterFarmers = this.farmers.filter(farmer => values.indexOf(farmer.sectionId!) != -1)
      this.filterPlots = this.plots.filter(plot => values.indexOf(plot.sectionId!) != -1)
      this.filterPlantTypes = this.planttypes.filter(planttype => values.indexOf(planttype.sectionId!) != -1)
      this.filterVarieties = this.varieties.filter(variety => values.indexOf(variety.sectionId!) != -1)
    }
  }
  SetAllVillageChilds(values: number[]) {
    if (values.length == 0) {
      this.filterFarmers = Object.assign([], this.farmers);
      this.filterPlots = Object.assign([], this.plots);
      this.filterPlantTypes = Object.assign([], this.planttypes);
      this.filterVarieties = Object.assign([], this.varieties);

    }
    else {
      this.filterFarmers = this.farmers.filter(farmer => values.indexOf(farmer.villageId!) != -1)
      this.filterPlots = this.plots.filter(plot => values.indexOf(plot.villageId!) != -1)
      this.filterPlantTypes = this.planttypes.filter(planttype => values.indexOf(planttype.villageId!) != -1)
      this.filterVarieties = this.varieties.filter(variety => values.indexOf(variety.villageId!) != -1)
    }
  }

  SetAllFarmerChilds(values: number[]) {
    if (Array.isArray(values) && values.length === 0) {
      this.filterPlots = Object.assign([], this.plots);
      this.filterPlantTypes = Object.assign([], this.planttypes);
      this.filterVarieties = Object.assign([], this.varieties);
    } else {
      this.filterPlots = this.plots.filter(plot => Array.isArray(values) && values.indexOf(plot.farmerId!) !== -1);
      this.filterPlantTypes = this.planttypes.filter(planttype => Array.isArray(values) && values.indexOf(planttype.farmerId!) !== -1);
      this.filterVarieties = this.varieties.filter(variety => Array.isArray(values) && values.indexOf(variety.farmerId!) !== -1);
    }
  }
  SetAllPlotsChilds(values: number[]) {
    if (values.length == 0) {
      this.filterPlantTypes = Object.assign([], this.planttypes);
      this.filterVarieties = Object.assign([], this.varieties);
    } else {
      this.filterPlantTypes = this.planttypes.filter(planttype =>  Array.isArray(values) && values.indexOf(planttype.plotId!) != -1);
      this.filterVarieties = this.varieties.filter(variety => Array.isArray(values) &&  values.indexOf(variety.plotId!) != -1);
    }
  }
  SetAllPlanttypeChilds(values: number[]) {
    if (values.length == 0) {
      this.filterVarieties = Object.assign([], this.varieties);
    } else {
      this.filterVarieties = this.varieties.filter(variety => Array.isArray(values) &&  values.indexOf(variety.planttypeId!) != -1);
    }
  }

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

  get FormControls() {
    return this.fbScheduleGrouping.controls
  }
  onSearch() {
    this.dtSchedulegrouping.expandedRowKeys = {};
    this.initScheduleGroups(this.currentSeason.seasonId!);
  }
  getScheduleGrouping() {
    this.showDialog = true;
    this.showDialog1 = false
  }

  onSubmit() {
     let obj = this.fbScheduleGrouping.getRawValue();
    //  obj.fromDOP =  formatDate(obj.fromDOP, 'yyyy-mm-dd', 'en-US');
    //  obj.toDOP =  formatDate(obj.toDOP, 'yyyy-mm-dd', 'en-US');
 
   let obj2 = {
      "seasonId": this.fbScheduleGrouping.value.seasonId,
      "divisionId": this.fbScheduleGrouping.value.divisionId.map((a:any) => JSON.stringify(a)).join(),
      "circleId": this.fbScheduleGrouping.value.circleId.map((a:any) => JSON.stringify(a)).join(),
      "sectionId": this.fbScheduleGrouping.value.sectionId.map((a:any) => JSON.stringify(a)).join(),
      "villageId": this.fbScheduleGrouping.value.villageId.map((a:any) => JSON.stringify(a)).join(),
      "fromDOP":formatDate(obj.fromDOP, 'yyyy-MM-dd', 'en-US'),
      "toDOP":formatDate(obj.toDOP,'yyyy-MM-dd', 'en-US'),
      "farmerId": this.fbScheduleGrouping.value.farmerId.toString(),
      "plotId": this.fbScheduleGrouping.value.plotId.toString(),
      "plantTypeId": this.fbScheduleGrouping.value.plantTypeId.toString(),
      "varietyId":this.fbScheduleGrouping.value.varietyId.toString(),
    }
    console.log(obj2);
    this.permitService.GetScheduleGroupPlots(obj2).subscribe((resp) => {
          this.schedule = resp as unknown as ScheduleGroupPlotsDto[];
          console.log(this.schedule);
          
          });
        }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }


}
