import { formatDate } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { OverlayPanel } from "primeng/overlaypanel";
import { SeasonDto, SeasonViewDto } from "src/app/_models/applicationmaster";
import { CircleforUserDto, DivisionsforUserDto, EstimatedViewDto, ExcessTonDto, ExcessTonViewDto, FarmersInPlantingDatesDto, SectionforUserDto, VillageforUserDto } from "src/app/_models/permits";
import { AppMasterService } from "src/app/_services/appmaster.service";
import { permitService } from "src/app/_services/permit.service";
import { CURRENT_SEASON } from "src/environments/environment";

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
  selector: 'app-estimatedton',
  templateUrl: './estimatedton.component.html',
  styles: [],
})

export class EstimatedTonComponent implements OnInit {
  seasons: SeasonViewDto[]=[];
  currentSeason: SeasonDto = {};
  loading: boolean = true;
  showTable: boolean = false;
  showForm: boolean = false;
  dateTime = new Date();
  estimatedton: EstimatedViewDto[] = [];
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild('opexcesston') opexcesston!: OverlayPanel;
  fbEstimatedTon!: FormGroup;
  fbexcesston!:  FormGroup;
  farmers: FarmersInPlantingDatesDto[] = [];
  divisions: DivisionsforUserDto[] = [];
  sections: SectionforUserDto[] = [];
  circles: CircleforUserDto[] = [];
  villages: VillageforUserDto[] = [];
  filterCircles: CircleforUserDto[] = [];
  filterSections: SectionforUserDto[] = [];
  filterVillages: VillageforUserDto[] = [];
  showDialog: boolean = false;
  excessTons: ExcessTonViewDto[] = [];

  constructor(private formbuilder: FormBuilder,
    private appMasterService: AppMasterService,
    private permitService: permitService) { }

  getEstimatedForm() {
    this.fbEstimatedTon = this.formbuilder.group({
      seasonId: [null, (Validators.required)],
      divisionId:  [null, (Validators.required)],
      circleId:  [null, (Validators.required)],
      sectionId: [null, (Validators.required)],
      villageId:  [null, (Validators.required)],
      frompltngDate: [null, (Validators.required)],
      topltngDate: [null, (Validators.required)],
      farmerCode:  [null, (Validators.required)],
    });
  }
  getExcesstonForm() {
    this.fbexcesston = this.formbuilder.group({
      plotExcessTonId: [ ],
      plotYieldId:  [null],
      excessTonage:  [null,(Validators.required)],
    })
  }

  get FormControls() {
    return this.fbEstimatedTon.controls
  }
  ngOnInit(): void {
    this.initCurrentSeason(CURRENT_SEASON());
    this.getEstimatedForm();
    this.getExcesstonForm();
    this.initDivisions();
    this.initSections();
    this.initCircles();
    this.initVillages();
  }
  get FormControl() {
    return this.fbexcesston.controls
  }
  headers: IHeader[] = [
    { field: 'excessTonage', header: 'excessTonage', label: 'Updated Estimated Ton' },
    { field: 'estimatedTon', header: 'estimatedTon', label: 'Estimated Ton' },
    { field: 'farmerCode', header: 'farmerCode', label: 'Farmer Code' },
    { field: 'farmerName', header: 'farmerName', label: 'Farmer Name' },
    { field: 'plotNumber', header: 'plotNumber', label: 'Plot No' },
    { field: 'villageName', header: 'villageName', label: 'Village Name' },
    { field: 'variety', header: 'variety', label: 'Variety Name' },
    { field: 'plantType', header: 'plantType', label: 'Plant Type' },
    { field: 'plantingDate', header: 'plantingDate', label: 'Planting Date' },
    { field: 'netArea', header: 'netArea', label: 'Net Area' },
    // { field: 'excessTonage', header: 'excessTonage', label: 'Increased Estimated Ton' },
    { field: 'PermitTon', header: 'PermitTon', label: 'Permit Ton' },
    { field: 'SuppliedTon', header: 'SuppliedTon', label: 'Supplied Ton' },
    { field: 'BalanceTon', header: 'BalanceTon', label: 'Balance Ton' },
    { field: 'NoofWeighments', header: 'NoofWeighments', label: 'No of Weighments' },
  ];

  header: IFromHeader[] = [
    { field: 'excessTonage', header: 'excessTonage', label: 'Updated Estimated Ton' },
    { field: 'estimatedTon', header: 'estimatedTon', label: 'Estimated Ton' },
    { field: 'farmerCode', header: 'farmerCode', label: 'Farmer Code' },
    { field: 'farmerName', header: 'farmerName', label: 'Farmer Name' },
    { field: 'plotNumber', header: 'plotNumber', label: 'Plot No' },
    { field: 'divisionName', header: 'divisionName', label: 'Division Name' },
    { field: 'sectionName', header: 'sectionName', label: 'section Name' },
    { field: 'villageName', header: 'villageName', label: 'Village Name' },
    { field: 'plantingDate', header: 'plantingDate', label: 'Planting Date' },
    // { field: 'variety', header: 'variety', label: 'Variety Name' },
    // { field: 'plantType', header: 'plantType', label: 'Plant Type' },
    { field: 'netArea', header: 'netArea', label: 'Net Area' },
    // { field: 'excessTonage', header: 'excessTonage', label: 'Increased Estimated Ton' },
    // { field: 'PermitTon', header: 'PermitTon', label: 'Permit Ton' },
    // { field: 'SuppliedTon', header: 'SuppliedTon', label: 'Supplied Ton' },
    // { field: 'BalanceTon', header: 'BalanceTon', label: 'Balance Ton' },
    // { field: 'NoofWeighments', header: 'NoofWeighments', label: 'No of Weighments' },
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
      this.initEstimatedTon(this.currentSeason.seasonId!);
      // this.initExcessTon(this.currentSeason.seasonId!);
    });
  }
  initEstimatedTon(seasonId: any) {
    this.permitService.GetEstimatedTon(seasonId).subscribe((resp) => {
      this.estimatedton = resp as unknown as EstimatedViewDto[];
      console.log(this.estimatedton)
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
      this.filterSections = Object.assign([], this.sections);
    });
  }
  initCircles() {
    this.permitService.GetCirclesforUser().subscribe((resp) => {
      this.circles = resp as unknown as CircleforUserDto[];
      this.filterCircles = Object.assign([], this.circles);
    });
  }
  initVillages() {
    this.permitService.GetVillagesforUser().subscribe((resp) => {
      this.villages = resp as unknown as VillageforUserDto[];
      this.filterVillages = Object.assign([], this.villages);
    });
  }
  SetAllDivisionChilds(values: number[]) {
    if(values.length == 0){
      this.filterCircles = Object.assign([], this.circles);
      this.filterSections = Object.assign([], this.sections);
      this.filterVillages = Object.assign([], this.villages);
    }
    else{ 
      this.filterCircles = this.circles.filter(circle => values.indexOf(circle.divisionId!) != -1);
      this.filterSections = this.sections.filter(section => values.indexOf(section.divisionId!) != -1)
      this.filterVillages = this.villages.filter(village => values.indexOf(village.divisionId!) != -1)
    }
  }
  SetAllCircleChilds(values: number[]) {
    if(values.length == 0){
      this.filterSections = Object.assign([], this.sections);
      this.filterVillages = Object.assign([], this.villages);
    }
    else{ 
    this.filterSections = this.sections.filter(section => values.indexOf(section.circleId!) != -1)
    this.filterVillages = this.villages.filter(village => values.indexOf(village.circleId!) != -1)
    }
  }
  SetAllSectionChilds(values: number[]) {
    if(values.length == 0){
      this.filterSections = Object.assign([], this.sections);
      this.filterVillages = Object.assign([], this.villages);
    }
    else{ 
    this.filterVillages = this.villages.filter(village => values.indexOf(village.sectionId!) != -1)
    }
  }
  GetFarmers() {
    if (this.fbEstimatedTon.value.seasonId != null && this.fbEstimatedTon.value.frompltngDate != null &&
      this.fbEstimatedTon.value.topltngDate != null ) {
      var seasonId = this.fbEstimatedTon.value.seasonId;
      var frompltngDate = formatDate(this.fbEstimatedTon.value.frompltngDate, 'yyyy-MM-dd', 'en-US')
      var topltngDate = formatDate(this.fbEstimatedTon.value.topltngDate, 'yyyy-MM-dd', 'en-US');
      var villageId = this.fbEstimatedTon.value.villageId
      this.permitService.GetFarmersInPlantingDates(seasonId, frompltngDate, topltngDate,villageId).subscribe((resp) => {
        this.farmers = resp as unknown as FarmersInPlantingDatesDto[];
        console.log(this.farmers)
      })
    }
  }
  initExcessTon(){
        var seasonId = this.fbEstimatedTon.value.seasonId;
        var frompltngDate = formatDate(this.fbEstimatedTon.value.frompltngDate, 'yyyy-MM-dd', 'en-US')
        var topltngDate = formatDate(this.fbEstimatedTon.value.topltngDate, 'yyyy-MM-dd', 'en-US');
        this.permitService.GetExcessTon(seasonId,frompltngDate,topltngDate).subscribe((resp) => {
        this.excessTons = resp as unknown as ExcessTonViewDto[];
         console.log(this.excessTons)
        }) 
  }
getExcessTonDetails(){
 this.GetFarmers() 
}
editExecesston(event: Event, excesston: ExcessTonDto){
  this.fbexcesston.patchValue(excesston);
  this.fbexcesston.controls['excessTonage'].setValue(excesston.excessTonage);
  this.opexcesston.toggle(event);
}
onSubmit() {
  if (this.fbexcesston.valid) {
    this.permitService.UpdateExcessTon(this.fbexcesston.value).subscribe(resp => {
      if (resp) {
        this.initEstimatedTon(this.currentSeason.seasonId!)
        // this.alertMessage.displayAlertMessage(ALERT_CODES["SMOP002"]);
        this.fbexcesston.reset();
      }
    })
  }
  else {
    this.fbexcesston.markAllAsTouched();
  }
}
  toggleTab() {
    this.showForm = !this.showForm;
  }
  getEstimatedTon() {
    this.initExcessTon()
    this.showTable = true;
    this.showDialog = true;
  }
}
