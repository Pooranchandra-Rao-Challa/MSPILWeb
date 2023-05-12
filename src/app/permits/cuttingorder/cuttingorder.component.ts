import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Table } from "primeng/table";
import { AlertMessage, ALERT_CODES } from "src/app/_alerts/alertMessage";
import { SeasonDto, SeasonViewDto } from "src/app/_models/applicationmaster";
import { ITableHeader } from "src/app/_models/common";
import { IPlotOfferViewDto } from "src/app/_models/monitoring";
import { CircleforUserDto, DivisionsforUserDto, FarmersInPlotsForUserDto, GetCuttingOrderViewDto, PlantTypeForUserDto, PlotCuttingOrderViewDto, PlotsForUserDto, SeasonCuttingOrderViewDto, SectionforUserDto, VarietiesForUserDto, VillageforUserDto } from "src/app/_models/permits";
import { AppMasterService } from "src/app/_services/appmaster.service";
import { permitService } from "src/app/_services/permit.service";
import { CURRENT_SEASON } from "src/environments/environment";

@Component({
  selector: 'app-cuttingorder',
  templateUrl: './cuttingorder.component.html',
  styles: [],
})
export class CuttingOrderComponent implements OnInit {
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
  filterFarmers: FarmersInPlotsForUserDto[] = [];
  filterPlots: PlotsForUserDto[] = []
  filterPlantTypes: PlantTypeForUserDto[] = [];
  filterVarieties: VarietiesForUserDto[] = [];
  farmers: FarmersInPlotsForUserDto[] = [];
  plots: PlotsForUserDto[] = [];
  allottedPlots: IPlotOfferViewDto[] = [];
  planttypes: PlantTypeForUserDto[] = [];
  varieties: VarietiesForUserDto[] = [];
  seasoncuttingOrders: SeasonCuttingOrderViewDto[] = [];
  plotcuttingOrders: PlotCuttingOrderViewDto[] = [];
  cuttingorders: GetCuttingOrderViewDto[] = [];
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild('filters') filters!: ElementRef;
  @ViewChild('dtseasoncuttingOrders') dtseasoncuttingOrders!: Table;
  @ViewChild('dtcuttingorders') dtcuttingorders!: Table;
  showDialog: boolean = false;
  fromScheduleNo: any;
  toScheduleNo: any;
  error: boolean = false;

  constructor(private formbuilder: FormBuilder,
    private permitService: permitService,
    private appMasterService: AppMasterService,
    private alertMessage: AlertMessage) { }

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
    { field: 'plotNumber', header: 'plotNumber', label: 'Plot Number' },
    { field: 'plantTypeName', header: 'plantTypeName', label: 'Plant Type' },
    { field: 'varietyName', header: 'varietyName', label: 'Variety Name' },
    { field: 'netArea', header: 'netArea', label: 'Net Area' },
    { field: 'estimatedTon', header: 'estimatedTon', label: 'Estimated Ton' },
    { field: 'cuttingOrderNo', header: 'cuttingOrderNo', label: 'Cutting Order No' },
    { field: 'orderQuantity', header: 'orderQuantity ', label: 'Order Quantity' },
  ];
  
  CuttingOrder: ITableHeader[] = [
    { field: 'farmerCode', header: 'farmerCode', label: 'Farmer Code' },
    { field: 'farmerName', header: 'farmerName', label: 'Farmer Name' },
    { field: 'divisionName', header: 'divisionName', label: 'Division Name' },
    { field: 'circleName', header: 'circleName', label: 'Circle Name' },
    { field: 'sectionName', header: 'sectionName', label: 'Section Name' },
    { field: 'villageName', header: 'villageName', label: 'Village Name' },
    { field: 'plantTypeName', header: 'plantTypeName', label: 'Plant Type' },
    { field: 'plotNumber', header: 'plotNumber', label: 'Plot Number' },
    { field: 'varietyName', header: 'varietyName', label: 'Variety Name' },
    { field: 'plantingDate', header: 'plantingDate ', label: 'Planting Date ' },
    { field: 'netArea', header: 'netArea', label: 'Net Area' },
    { field: 'estimatedTon', header: 'estimatedTon', label: 'Estimated Ton' },
    { field: 'ccs', header: 'ccs', label: 'CCS' },
    { field: 'brix', header: 'brix ', label: 'Brix' },
    { field: 'pol', header: 'pol', label: 'Pol' },
    { field: 'purity', header: 'purity', label: 'Purity' },
    { field: 'scheduleGroupNo', header: 'scheduleGroupNo', label: 'Schedule Group No' },
    { field: 'noOfSample', header: 'noOfSample', label: 'No Of Sample ' },
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
      this.filterDivisions = Object.assign([], this.divisions);
    });
  }
  initCircles(seasonId: any) {
    this.permitService.GetCirclesforUser(seasonId, 'CuttingOrders').subscribe((resp) => {
      this.circles = resp as unknown as CircleforUserDto[];
      this.filterCircles = Object.assign([], this.circles);
    });
  }
  initSections(seasonId: any) {
    this.permitService.GetSectionsforUser(seasonId, 'CuttingOrders').subscribe((resp) => {
      this.sections = resp as unknown as SectionforUserDto[];
      this.filterSections = Object.assign([], this.sections);
    });
  }
  initVillages(seasonId: any) {
    this.permitService.GetVillagesforUser(seasonId, 'CuttingOrders').subscribe((resp) => {
      this.villages = resp as unknown as VillageforUserDto[];
      this.filterVillages = Object.assign([], this.villages);
    });
  }
  initFarmers(seasonId: any) {
    var villageId = this.fbCuttingOrder.value.villageId;
    this.permitService.GetFarmersInPlotsForUser(seasonId, villageId, 'CuttingOrder').subscribe((resp) => {
      this.farmers = resp as unknown as FarmersInPlotsForUserDto[];
      this.filterFarmers = Object.assign([], this.farmers);
    })
  }
  initPlots(seasonId: any) {
    var farmerId = this.fbCuttingOrder.value.farmerId
    var villageId = this.fbCuttingOrder.value.villageId
    this.permitService.GetPlotsForUser(seasonId, farmerId, villageId,'CuttingOrder').subscribe((resp) => {
      this.plots = resp as unknown as PlotsForUserDto[];
      this.filterPlots = Object.assign([], this.plots);
    })
  }
  initPlantType(seasonId: any) {
    var farmerId = this.fbCuttingOrder.value.farmerId
    var villageId = this.fbCuttingOrder.value.villageId
    var plotId = this.fbCuttingOrder.value.plotId
    this.permitService.GetPlantTypeForUser(seasonId, farmerId, villageId, plotId).subscribe((resp) => {
      this.planttypes = resp as unknown as PlantTypeForUserDto[];
      this.filterPlantTypes = Object.assign([], this.planttypes);
    })
  }
  initVarieties(seasonId: any) {
    var farmerId = this.fbCuttingOrder.value.farmerId
    var villageId = this.fbCuttingOrder.value.villageId
    var plotId = this.fbCuttingOrder.value.plotId
    this.permitService.GetVarietiesForUser(seasonId, farmerId, villageId, plotId).subscribe((resp) => {
      this.varieties = resp as unknown as VarietiesForUserDto[];
      this.filterVarieties = Object.assign([], this.varieties);
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
      fromSchGroupNo: [null, (Validators.required)],
      toSchGroupNo: [null, (Validators.required)],
      fromCCS: [null, (Validators.required)],
      toCCS: [null, (Validators.required)],
      fromBrix: [null],
      toBrix: [null],
      fromPol: [null],
      toPol: [null],
      fromPurity: [null],
      toPurity: [null],
      fromDOP: [null],
      toDOP: [null],
      farmerId: [null],
      plotId: [null],
      divisionId: [null],
      circleId: [null],
      sectionId: [null], 
      villageId: [null],
      plantTypeId: [null],
      varietyId: [null],
      plotCuttingOrders: this.formbuilder.array([])
    })
  }

  plotCuttingOrderForm(rowData: any) {
    return this.formbuilder.group({
      plotCuttingOrderId: 0,
      seasonCuttingOrderId: 0,
      cuttingOrderNo: 0,
      orderQuantity: 0,
      plotYieldId: rowData.plotYieldId,
      divisionId: rowData.divisionId,
      circleId: rowData.circleId,
      sectionId: rowData.sectionId,
      farmerId: rowData.farmerId,
      plotId:rowData.plotId,
      plantTypeId: rowData.plantTypeId,
      varietyId: rowData.varietyId,
      villageId: rowData.villageId,
    })
  };

  get CuttingOrderControls() {
    return this.fbCuttingOrder.get('plotCuttingOrders') as FormArray;
  }
  addPlot(rowData: any) {
    const formArray = this.fbCuttingOrder.get('plotCuttingOrders') as FormArray;
    formArray.push(this.plotCuttingOrderForm(rowData));
  }
  removePlot(index: any) {
    const formArray = this.fbCuttingOrder.get('plotCuttingOrders') as FormArray;
    formArray.removeAt(index);
  }
  onRowSelect(event: any, CuttingOrder: any) {
    console.log(CuttingOrder);
    if (event.checked) {
      this.addPlot(CuttingOrder);
    } else {
      let index = this.CuttingOrderControls.value.findIndex((s: any) => s.farmerId == CuttingOrder.farmerId && s.plotYieldId == CuttingOrder.plotId)
      this.removePlot(index);
    }
    console.log(this.CuttingOrderControls.value);
  }
  get FormControals() {
    return this.fbCuttingOrder.controls
  }
  ngOnInit(): void {
    this.initCurrentSeason(CURRENT_SEASON());
    this.getcuttingoderForm();
  }
  initSeasonCuttingOrders(seasonId: number) {
 this.permitService.GetSeasonCuttingOrder(seasonId).subscribe((resp) => {
      this.seasoncuttingOrders = resp as unknown as SeasonCuttingOrderViewDto[];
    });
  }
  initPlotCuttingOrders(source: any) {
    var data = source.data as SeasonCuttingOrderViewDto;
    this.permitService.GetPlotCuttingOrder(data.seasonId, data.seasonCuttingOrderId).subscribe(resp => {
      data.objPlotCuttingOrder = resp as unknown as PlotCuttingOrderViewDto[];
      console.log(data.objPlotCuttingOrder);  
    });
  }
  initCuttingOrder() {
    this.permitService.GetCuttingOrder(this.fbCuttingOrder.value).subscribe((resp) => {
      this.cuttingorders = resp as unknown as GetCuttingOrderViewDto[];
    })
  }
  checkValue() {
    if (this.fromScheduleNo < this.toScheduleNo) {
      this.error = false;
      return;
    }
    else if (this.toScheduleNo == undefined) {
      this.error = false;
      return;
    }
    else {
      this.error = true;
    }
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
  clear1(table: Table) {
    table.clear();
    this.filters.nativeElement.value = '';
  }
  onSearch(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  addCuttingOrder() {
    this.initCuttingOrder();
    this.showDialog = true;
  }
  onSubmit() {
    if (this.fbCuttingOrder.valid) {
      this.permitService.CreateCuttingOrder(this.fbCuttingOrder.value).subscribe((resp) => {
        if (resp) {
          this.initSeasonCuttingOrders(this.currentSeason.seasonId!)
          this.alertMessage.displayAlertMessage(ALERT_CODES["SMPCO001"]);
          this.addCuttingOrder();
          const seasonId = this.fbCuttingOrder.value.seasonId;
          this.fbCuttingOrder.reset()
          this.fbCuttingOrder.patchValue({ seasonId });
        }
      });
    }
  }
}