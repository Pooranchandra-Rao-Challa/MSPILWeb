import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { SeasonDto, SeasonViewDto } from "src/app/_models/applicationmaster";
import { ITableHeader } from "src/app/_models/common";
import { IPlotOfferViewDto } from "src/app/_models/monitoring";
import { CircleforUserDto, DivisionsforUserDto, FarmersInPlotsForUserDto, PlantTypeForUserDto, PlotCuttingOrderViewDto, PlotsForUserDto, SeasonCuttingOrderViewDto, SectionforUserDto, VarietiesForUserDto, VillageforUserDto } from "src/app/_models/permits";
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
  globalFilterFields: string[] =['seasonName','cuttingOrderNo','cuttingOrderDate','fromSchGroupNo','toSchGroupNo','fromDOP','toDOP','fromCCS','toCCS',
  'fromBrix','toBrix','fromPol','toPol','fromPurity','toPurity','createdAt','createdBy','updatedAt','updatedBy'];
  seasons: SeasonViewDto[]=[];
  fbCuttingOrder!: FormGroup;
  currentSeason: SeasonDto = {};
  divisions : DivisionsforUserDto []=[];
  sections: SectionforUserDto[] = [];
  circles: CircleforUserDto[] = [];
  villages: VillageforUserDto[] = [];
  farmers: FarmersInPlotsForUserDto[] = [];
  plots: PlotsForUserDto[] = [];
  allottedPlots: IPlotOfferViewDto[] = [];
  planttypes: PlantTypeForUserDto[] = [];
  varieties: VarietiesForUserDto[] = [];
  seasoncuttingOrders: SeasonCuttingOrderViewDto []=[]
  plotcuttingOrders: PlotCuttingOrderViewDto []=[]
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
    { field: 'seasonId', header: 'seasonId', label: 'Season' },
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
    { field: 'farmerCode', header:'farmerCode', label: 'Farmer Code' },
    { field: 'farmerName', header:'farmerName', label: 'Farmer Name' },
    { field: 'divisionName', header:'divisionName', label: 'Division Name' },
    { field: 'circleName', header:'circleName', label: 'Circle Name' },
    { field: 'sectionName', header:'sectionName', label: 'Section Name' },
    { field: 'villageName', header: 'villageName', label: 'Village Name' },
    { field: 'netArea',header:'netArea', label: 'Net Area' },
    { field: 'estimatedTon', header:'estimatedTon', label: 'Estimated Ton' },
    // { field: 'assessedArea', header:'assessedArea', label: 'Assessed Area' },
    // { field: 'assessedDate', header:'assessedDate', label: 'Assessed Date' },
    // { field: 'offerNo', header: 'offerNo', label: 'OfferNo' },
    // { field: 'weedStatusName', header: 'weedStatusName  ', label: 'Weed Status' },
    // { field: 'interCropName', header: 'interCropName', label: 'Inter Croping' },

  ];
  

  initSeasons() {
    this.appMasterService.Getseason().subscribe((resp) => {
      this.seasons = resp as unknown as SeasonViewDto[];
    });
  }
  initCurrentSeason(seasonCode: string) {
    this.appMasterService.CurrentSeason(seasonCode).subscribe((resp) => {
      this.currentSeason = resp as SeasonDto;
      this.initSeasons();
      this.initDivisions(this.currentSeason.seasonId!);
      this.initSections(this.currentSeason.seasonId!);
      this.initCircles(this.currentSeason.seasonId!);
      this.initVillages(this.currentSeason.seasonId!);
      this.initPlots(this.currentSeason.seasonId);
      this.initPlantType(this.currentSeason.seasonId);
      this.initVarieties(this.currentSeason.seasonId!);
      this.initFarmers(this.currentSeason.seasonId!);
      this.initSeasonCuttingOrders(this.currentSeason.seasonId!);
    });
  }
  initDivisions(seasonId: any) {
    this.permitService.GetDivisionsforUser(seasonId, 'ExcessTon').subscribe((resp) => {
      this.divisions = resp as unknown as DivisionsforUserDto[];
      console.log(this.divisions)
    });
  }
  initCircles(seasonId: any) {
    this.permitService.GetCirclesforUser(seasonId, 'ExcessTon').subscribe((resp) => {
      this.circles = resp as unknown as CircleforUserDto[];
      console.log(this.circles);
    });
  }
  initSections(seasonId: any) {
    this.permitService.GetSectionsforUser(seasonId, 'ExcessTon').subscribe((resp) => {
      this.sections = resp as unknown as SectionforUserDto[];
      console.log(this.sections)
    });
  }
  initVillages(seasonId: any) {
    this.permitService.GetVillagesforUser(seasonId, 'ExcessTon').subscribe((resp) => {
      this.villages = resp as unknown as VillageforUserDto[];
      console.log(this.villages);
    });
  }
  initFarmers(seasonId: any) {
    var villageId = this.fbCuttingOrder.value.villageId;
    this.permitService.GetFarmersInPlotsForUser(seasonId, villageId, 'ExcessTon').subscribe((resp) => {
      this.farmers = resp as unknown as FarmersInPlotsForUserDto[];
      console.log(this.farmers);
    })
  }
  initPlots(seasonId:any) {
    var farmerId = this.fbCuttingOrder.value.farmerId
    var villageId = this.fbCuttingOrder.value.villageId
    this.permitService.GetPlotsForUser(seasonId,farmerId,villageId,'ScheduleGroups').subscribe((resp) => {
      this.plots = resp as unknown as PlotsForUserDto[];
    })
}
initPlantType(seasonId:any) {
  var farmerId = this.fbCuttingOrder.value.farmerId
  var villageId = this.fbCuttingOrder.value.villageId
  var plotId = this.fbCuttingOrder.value.plotId
  this.permitService.GetPlantTypeForUser(seasonId,farmerId,villageId,plotId).subscribe((resp) => {
    this.planttypes = resp as unknown as PlantTypeForUserDto[];
  })
}
initVarieties(seasonId:any) {
  var farmerId = this.fbCuttingOrder.value.farmerId
  var villageId = this.fbCuttingOrder.value.villageId
  var plotId = this.fbCuttingOrder.value.plotId
  this.permitService.GetVarietiesForUser(seasonId,farmerId,villageId,plotId).subscribe((resp) => {
  this.varieties = resp as unknown as VarietiesForUserDto[];  
  })
}
  getFilterPermitQuota() {
    this.fbCuttingOrder = this.formbuilder.group({
      seasonId: [null],
      cuttingOrderDate: [null],
      fromScheduleGroupNo: [null],
      toScheduleGroupNo: [null],
      fromCCS:  [null],
      toCCS:  [null],
      fromBrix:  [null],
      toBrix:  [null],
      fromPol: [null],
      toPol:  [null],
      fromPurity:  [null],
      toPurity:  [null],
      fromDOP:  [null],
      toDOP: [null],
      farmerId: [null],
      plotId: [null],
      divisionId: [null],
      circleId: [null],
      sectionId: [null],
      villageId: [null],
      plantTypeId: [null],
      variety: [null],
    });
  }
  get FormControals() {
    return this.fbCuttingOrder.controls
  }
  ngOnInit(): void {
    this.initCurrentSeason(CURRENT_SEASON());
    this.getFilterPermitQuota();
  }
  initSeasonCuttingOrders(seasonId:number){
  this.permitService.GetSeasonCuttingOrder(seasonId).subscribe((resp) => {
    this.seasoncuttingOrders = resp as unknown as SeasonCuttingOrderViewDto[];
    console.log(' initSeasonCuttingOrders',this.seasoncuttingOrders);
    
  });
 }
 initPlotCuttingOrders(source:any){
  var data = source.data as SeasonCuttingOrderViewDto;
  this.permitService.GetPlotCuttingOrder(data.seasonId, data.seasonCuttingOrderId).subscribe(resp => {
    data.objPlotCuttingOrder = resp as unknown as PlotCuttingOrderViewDto[];
  });
 }
  onSubmit() {
    this.submitLabel = 'Get Order';
  }

  getCuttingOrder() {
    this.showDialog = true;
  }
}