import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { SeasonDto, SeasonViewDto } from "src/app/_models/applicationmaster";
import { ITableHeader } from "src/app/_models/common";
import { IPlotOfferViewDto } from "src/app/_models/monitoring";
import { CircleforUserDto, DivisionsforUserDto, FarmersInPlotsForUserDto, GetCuttingOrderViewDto, PlantTypeForUserDto, PlotCuttingOrderViewDto, PlotsForUserDto, SeasonCuttingOrderViewDto, SectionforUserDto, VarietiesForUserDto, VillageforUserDto } from "src/app/_models/permits";
import { AppMasterService } from "src/app/_services/appmaster.service";
import { MonitoringService } from "src/app/_services/monitoring.service";
import { permitService } from "src/app/_services/permit.service";
import { CURRENT_SEASON } from "src/environments/environment";

@Component({
  selector: 'app-cuttingorder',
  templateUrl: './cuttingorder.component.html',
  styles: [],
})
export class CuttingOrderComponent implements OnInit {
  globalFilterFields: string[] = ['seasonName', 'cuttingOrderNo', 'cuttingOrderDate', 'fromSchGroupNo', 'toSchGroupNo', 'fromDOP', 'toDOP', 'fromCCS', 'toCCS',
    'fromBrix', 'toBrix', 'fromPol', 'toPol', 'fromPurity', 'toPurity', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy'];
  seasons: SeasonViewDto[] = [];
  fbCuttingOrder!: FormGroup;
  currentSeason: SeasonDto = {};
  divisions: DivisionsforUserDto[] = [];
  sections: SectionforUserDto[] = [];
  circles: CircleforUserDto[] = [];
  showForm: boolean = false;
  villages: VillageforUserDto[] = [];
  filterDivisions: DivisionsforUserDto[] = [];
  filterCircles: CircleforUserDto[] = [];
  filterSections: SectionforUserDto[] = [];
  filterVillages: VillageforUserDto[] = [];
  farmers: FarmersInPlotsForUserDto[] = [];
  plots: PlotsForUserDto[] = [];
  allottedPlots: IPlotOfferViewDto[] = [];
  planttypes: PlantTypeForUserDto[] = [];
  varieties: VarietiesForUserDto[] = [];
  seasoncuttingOrders: SeasonCuttingOrderViewDto[] = [];
  plotcuttingOrders: PlotCuttingOrderViewDto[] = [];
  cuttingorders: GetCuttingOrderViewDto[] = [];
  loading: boolean = true;
  showTable: boolean = true;
  showDialog: boolean = false;
  forapproval: boolean = false;
  @ViewChild('filter') filter!: ElementRef;
  submitLabel!: string;

  constructor(private formbuilder: FormBuilder,
    private permitService: permitService,
    private appMasterService: AppMasterService) { }

  seasonCuttingOrder: ITableHeader[] = [
    { field: 'seasonName', header: 'seasonName', label: 'Season' },
    { field: 'cuttingOrderNo', header: 'cuttingOrderNo', label: 'Cutting Order No' },
    { field: 'cuttingOrderDate', header: 'cuttingOrderDate', label: 'Cutting Order Date' },
    { field: 'fromSchGroupNo', header: 'fromSchGroupNo', label: 'From SchGroup No' },
    { field: 'toSchGroupNo', header: 'toSchGroupNo', label: 'To SchGroup No' },
    { field: 'fromDOP', header: 'fromDOP', label: 'From DOP' },
    { field: 'toDOP', header: 'toDOP', label: 'To DOP' },
    { field: 'fromCCS', header: 'fromCCS', label: 'From CSS' },
    { field: 'toCCS', header: 'toCCS', label: 'To CSS' },
    { field: 'fromBrix', header: 'fromBrix', label: 'From Brix' },
    { field: 'toBrix', header: 'toBrix', label: 'To Brix' },
    { field: 'fromPol', header: 'fromPol', label: 'From Pol' },
    { field: 'toPol', header: 'toPol', label: 'To Pol' },
    { field: 'fromPurity', header: 'fromPurity', label: 'From Purity' },
    { field: 'toPurity', header: 'toPurity', label: 'To Purity' },
    { field: 'createdAt', header: 'createdAt', label: 'Created At' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated At' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ];
  plotCuttingOrder: ITableHeader[] = [
    { field: 'farmerCode', header: 'farmerCode', label: 'Farmer Code' },
    { field: 'farmerName', header: 'farmerName', label: 'Farmer Name' },
    { field: 'divisionName', header: 'divisionName', label: 'Division Name' },
    { field: 'circleName', header: 'circleName', label: 'Circle Name' },
    { field: 'sectionName', header: 'sectionName', label: 'Section Name' },
    { field: 'villageName', header: 'villageName', label: 'Village Name' },
    { field: 'netArea', header: 'netArea', label: 'Net Area' },
    { field: 'estimatedTon', header: 'estimatedTon', label: 'Estimated Ton' },
    // { field: 'assessedArea', header:'assessedArea', label: 'Assessed Area' },
    // { field: 'assessedDate', header:'assessedDate', label: 'Assessed Date' },
    // { field: 'offerNo', header: 'offerNo', label: 'OfferNo' },
    // { field: 'weedStatusName', header: 'weedStatusName  ', label: 'Weed Status' },
    // { field: 'interCropName', header: 'interCropName', label: 'Inter Croping' },
  ];
  toggleTab() {
    this.showForm = !this.showForm;
  }
  initSeasons() {
    this.appMasterService.Getseason().subscribe((resp) => {
      this.seasons = resp as unknown as SeasonViewDto[];
    });
  }
  initCurrentSeason(seasonCode: string) {
    this.appMasterService.CurrentSeason(seasonCode).subscribe((resp) => {
      this.currentSeason = resp as SeasonDto;
      this.initSeasons();
      this.initdropdownsbinding()
      this.initSeasonCuttingOrders(this.currentSeason.seasonId!);
    });
  }
  initDivisions(seasonId: any) {
    this.permitService.GetDivisionsforUser(seasonId, 'CuttingOrders').subscribe((resp) => {
      this.divisions = resp as unknown as DivisionsforUserDto[];
      console.log('initDivisions', this.divisions)
    });
  }
  initCircles(seasonId: any) {
    this.permitService.GetCirclesforUser(seasonId, 'CuttingOrders').subscribe((resp) => {
      this.circles = resp as unknown as CircleforUserDto[];
      console.log('initCircles', this.circles);
    });
  }
  initSections(seasonId: any) {
    this.permitService.GetSectionsforUser(seasonId, 'CuttingOrders').subscribe((resp) => {
      this.sections = resp as unknown as SectionforUserDto[];
      console.log('initSections', this.sections)
    });
  }
  initVillages(seasonId: any) {
    this.permitService.GetVillagesforUser(seasonId, 'CuttingOrders').subscribe((resp) => {
      this.villages = resp as unknown as VillageforUserDto[];
      console.log('initVillages', this.villages);
    });
  }
  initFarmers(seasonId: any) {
    var villageId = this.fbCuttingOrder.value.villageId;
    this.permitService.GetFarmersInPlotsForUser(seasonId, villageId, 'ScheduleGroups').subscribe((resp) => {
      this.farmers = resp as unknown as FarmersInPlotsForUserDto[];
      console.log('initFarmers', this.farmers);
    })
  }
  initPlots(seasonId: any) {
    var farmerId = this.fbCuttingOrder.value.farmerId
    var villageId = this.fbCuttingOrder.value.villageId
    this.permitService.GetPlotsForUser(seasonId, farmerId, villageId, 'ScheduleGroups').subscribe((resp) => {
      this.plots = resp as unknown as PlotsForUserDto[];
      console.log('initPlots', this.plots);
    })
  }
  initPlantType(seasonId: any) {
    var farmerId = this.fbCuttingOrder.value.farmerId
    var villageId = this.fbCuttingOrder.value.villageId
    var plotId = this.fbCuttingOrder.value.plotId
    this.permitService.GetPlantTypeForUser(seasonId, farmerId, villageId, plotId).subscribe((resp) => {
      this.planttypes = resp as unknown as PlantTypeForUserDto[];
      console.log('initPlantType', this.planttypes);
    })
  }
  initVarieties(seasonId: any) {
    var farmerId = this.fbCuttingOrder.value.farmerId
    var villageId = this.fbCuttingOrder.value.villageId
    var plotId = this.fbCuttingOrder.value.plotId
    this.permitService.GetVarietiesForUser(seasonId, farmerId, villageId, plotId).subscribe((resp) => {
      this.varieties = resp as unknown as VarietiesForUserDto[];
      console.log('initVarieties', this.varieties);
    })
  }
  SetAllDivisionChilds(values: number[]) {
    if (values.length == 0) {
      this.filterDivisions = Object.assign([], this.divisions);
      this.filterCircles = Object.assign([], this.circles);
      this.filterSections = Object.assign([], this.sections);
      this.filterVillages = Object.assign([], this.villages);
    }
    else {
      // this.divisionIds =  values.join(','); 
      this.filterDivisions = this.circles.filter(division => values.indexOf(division.divisionId!) != -1);
      this.filterCircles = this.circles.filter(circle => values.indexOf(circle.divisionId!) != -1);
      this.filterSections = this.sections.filter(section => values.indexOf(section.divisionId!) != -1)
      this.filterVillages = this.villages.filter(village => values.indexOf(village.divisionId!) != -1)
    }
  }
  SetAllCircleChilds(values: number[]) {
    if (values.length == 0) {
      this.filterSections = Object.assign([], this.sections);
      this.filterVillages = Object.assign([], this.villages);
    }
    else {
      // this.circleIds =  values.join(',');
      this.filterSections = this.sections.filter(section => values.indexOf(section.circleId!) != -1)
      this.filterVillages = this.villages.filter(village => values.indexOf(village.circleId!) != -1)
    }
  }
  SetAllSectionChilds(values: number[]) {
    if (values.length == 0) {
      this.filterVillages = Object.assign([], this.villages);
    }
    else {
      // this.sectionIds =  values.join(',');
      this.filterVillages = this.villages.filter(village => values.indexOf(village.sectionId!) != -1)
    }
  }
  initdropdownsbinding() {
    this.initDivisions(this.currentSeason.seasonId!);
    this.initSections(this.currentSeason.seasonId!);
    this.initCircles(this.currentSeason.seasonId!);
    this.initVillages(this.currentSeason.seasonId!);
    this.initPlots(this.currentSeason.seasonId!);
    this.initPlantType(this.currentSeason.seasonId);
    this.initVarieties(this.currentSeason.seasonId!);
    this.initFarmers(this.currentSeason.seasonId!);
  }
  get FormControls() {
    return this.fbCuttingOrder.controls
  }
  getcuttingoderForm() {
    this.fbCuttingOrder = this.formbuilder.group({
      seasonId: [null, (Validators.required)],
      cuttingOrderDate: [null, (Validators.required)],
      fromSchGroupNo: [0, (Validators.required)],
      toSchGroupNo: [0, (Validators.required)],
      fromCCS: [0, (Validators.required)],
      toCCS: [0, (Validators.required)],
      fromBrix: [null, (Validators.required)],
      toBrix: [null, (Validators.required)],
      fromPol: [null, (Validators.required)],
      toPol: [null, (Validators.required)],
      fromPurity: [null, (Validators.required)],
      toPurity: [null, (Validators.required)],
      fromPlantingDate: [null, (Validators.required)],
      toPlantingDate: [null, (Validators.required)],
      farmerId: [null, (Validators.required)],
      plotId: [null, (Validators.required)],
      divisionId: [null, (Validators.required)],
      circleId: [null, (Validators.required)],
      sectionId: [null, (Validators.required)],
      villageId: [null, (Validators.required)],
      plantTypeId: [null, (Validators.required)],
      varietyId: [null, (Validators.required)],
    });
  }
  get FormControals() {
    return this.fbCuttingOrder.controls
  }
  ngOnInit(): void {
    this.initCurrentSeason(CURRENT_SEASON());
    this.getcuttingoderForm();
    this.initCuttingOrder();
  }
  initSeasonCuttingOrders(seasonId: number) {
    this.permitService.GetSeasonCuttingOrder(seasonId).subscribe((resp) => {
      this.seasoncuttingOrders = resp as unknown as SeasonCuttingOrderViewDto[];
      console.log(' initSeasonCuttingOrders', this.seasoncuttingOrders);
    });
  }
  initPlotCuttingOrders(source: any) {
    var data = source.data as SeasonCuttingOrderViewDto;
    this.permitService.GetPlotCuttingOrder(data.seasonId, data.seasonCuttingOrderId).subscribe(resp => {
      data.objPlotCuttingOrder = resp as unknown as PlotCuttingOrderViewDto[];
      console.log(' objPlotCuttingOrder', data.objPlotCuttingOrder);
    });
  }
  initCuttingOrder() {
    debugger
    this.permitService.GetCuttingOrder(this.fbCuttingOrder.value).subscribe((resp) => {
      this.cuttingorders = resp as unknown as GetCuttingOrderViewDto[];
      console.log('initCuttingOrder', this.cuttingorders);
    })
  }
  onSubmit() {
    this.submitLabel = 'Get Order';
    this.showDialog = true;
  }
  addCuttingOrder() {
    this.showDialog = true;
  }
}