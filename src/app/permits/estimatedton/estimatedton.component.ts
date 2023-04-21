import { formatDate } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { OverlayPanel } from "primeng/overlaypanel";
import { Table } from "primeng/table";
import { AlertMessage, ALERT_CODES } from "src/app/_alerts/alertMessage";
import { SeasonDto, SeasonViewDto } from "src/app/_models/applicationmaster";
import { CircleforUserDto, DivisionsforUserDto, EstimatedViewDto, ExcessTonViewDto, ExcessViewDto, FarmersInPlantingDatesDto, SectionforUserDto, VillageforUserDto } from "src/app/_models/permits";
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
  seasons: SeasonViewDto[] = [];
  currentSeason: SeasonDto = {};
  loading: boolean = true;
  showTable: boolean = false;
  showForm: boolean = false;
  dateTime = new Date();
  estimatedton: EstimatedViewDto[] = [];
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild('opexcesston') opexcesston!: OverlayPanel;
  @ViewChild('opEstimatedTon') opEstimatedTon!: OverlayPanel;
  fbEstimatedTon!: FormGroup;
  fbexcesston!: FormGroup;
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
  divisionIds?:string;
  circleIds?:string;
  sectionIds?:string;
  villageIds?:string;
 

  constructor(private formbuilder: FormBuilder,
    private appMasterService: AppMasterService,
    private permitService: permitService,
    private alertMessage: AlertMessage) { }

  getEstimatedForm() {
    this.fbEstimatedTon = this.formbuilder.group({
      seasonId: [null, (Validators.required)],
      divisionId: [null],
      circleId: [null],
      sectionId: [null],
      villageId: [null],
      frompltngDate: [null, (Validators.required)],
      topltngDate: [null, (Validators.required)],
      farmerId: [null],
      plotExcessTonId: [null],
      excessTonage: [null,],
      plotYieldId: [null],
      isActive: [false]
    });
  }

  getExcesstonForm() {
    this.fbexcesston = this.formbuilder.group({
      plotExcessTonId: [null],
      excessTonage: [null, (Validators.required)],
      plotYieldId: [null],
      isActive: [false]
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
  excesstonage: IHeader[] = [
    { field: 'excessTonage', header: 'excessTonage', label: 'Excess Tonage' },
    { field: 'estimatedTon', header: 'estimatedTon', label: 'Estimated Ton' },
    { field: 'farmerCode', header: 'farmerCode', label: 'Farmer Code' },
    { field: 'farmerName', header: 'farmerName', label: 'Farmer Name' },
    { field: 'plotNumber', header: 'plotNumber', label: 'Plot No' },
    { field: 'villageName', header: 'villageName', label: 'Village Name' },
    { field: 'variety', header: 'variety', label: 'Variety Name' },
    { field: 'plantType', header: 'plantType', label: 'Plant Type' },
    { field: 'plantingDate', header: 'plantingDate', label: 'Planting Date' },
    { field: 'netArea', header: 'netArea', label: 'Net Area' },
    { field: 'PermitTon', header: 'PermitTon', label: 'Permit Ton' },
    { field: 'SuppliedTon', header: 'SuppliedTon', label: 'Supplied Ton' },
    { field: 'BalanceTon', header: 'BalanceTon', label: 'Balance Ton' },
    { field: 'NoofWeighments', header: 'NoofWeighments', label: 'No of Weighments'},
  ];

  header: IFromHeader[] = [
    { field: 'estimatedTon', header: 'estimatedTon', label: 'Estimated Ton' },
    { field: 'farmerCode', header: 'farmerCode', label: 'Farmer Code' },
    { field: 'farmerName', header: 'farmerName', label: 'Farmer Name' },
    { field: 'plotNumber', header: 'plotNumber', label: 'Plot No' },
    { field: 'divisionName', header: 'divisionName', label: 'Division Name' },
    { field: 'circleName', header: 'circleName', label: 'Circle Name' },
    { field: 'sectionName', header: 'sectionName', label: 'Section Name' },
    { field: 'villageName', header: 'villageName', label: 'Village Name' },
    { field: 'plantingDate', header: 'plantingDate', label: 'Planting Date' },
    { field: 'variety', header: 'variety', label: 'Variety Name' },
    { field: 'plantType', header: 'plantType', label: 'Plant Type' },
    { field: 'netArea', header: 'netArea', label: 'Net Area' },
    // { field: 'excessTonage', header: 'excessTonage', label: 'Increased Estimated Ton' },
    // { field: 'PermitTon', header: 'PermitTon', label: 'Permit Ton' },
    // { field: 'SuppliedTon', header: 'SuppliedTon', label: 'Supplied Ton' },
    // { field: 'BalanceTon', header: 'BalanceTon', label: 'Balance Ton' },
    // { field: 'NoofWeighments', header: 'NoofWeighments', label: 'No of Weighments' },
  ];
  onSearch(){
    this.initEstimatedTon(this.currentSeason.seasonId!);
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
    if (values.length == 0) {
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
  getExcessTonDetails() {
    this.GetFarmers()
  }

  GetFarmers() {
    if (this.fbEstimatedTon.value.seasonId != null && this.fbEstimatedTon.value.frompltngDate != null &&
      this.fbEstimatedTon.value.topltngDate != null) {
      var seasonId = this.fbEstimatedTon.value.seasonId;
      var frompltngDate = formatDate(this.fbEstimatedTon.value.frompltngDate, 'yyyy-MM-dd', 'en-US')
      var topltngDate = formatDate(this.fbEstimatedTon.value.topltngDate, 'yyyy-MM-dd', 'en-US');
      var villageId = this.fbEstimatedTon.value.villageId
      this.permitService.GetFarmersInPlantingDates(seasonId, frompltngDate, topltngDate, villageId).subscribe((resp) => {
        this.farmers = resp as unknown as FarmersInPlantingDatesDto[];
        console.log(this.farmers)
      })
    }
  }
  initExcessTon() {
    this.permitService.GetExcessTon(this.fbEstimatedTon.value).subscribe((resp) => {
      this.excessTons = resp as unknown as ExcessViewDto[];
      console.log(this.excessTons);
    })
  }
  // initExcessTon() {
  //   var seasonId = this.fbEstimatedTon.value.seasonId;
  //   var divisionId = this.fbEstimatedTon.value.divisionId;
  //   var circleId = this.fbEstimatedTon.value.circleId;
  //   var sectionId = this.fbEstimatedTon.value.sectionId;   
  //   var villageId = this.fbEstimatedTon.value.villageId;
  //   var frompltngDate = formatDate(this.fbEstimatedTon.value.frompltngDate, 'yyyy-MM-dd', 'en-US')
  //   var topltngDate = formatDate(this.fbEstimatedTon.value.topltngDate, 'yyyy-MM-dd', 'en-US');
  //   var farmerId = this.fbEstimatedTon.value.farmerId;
  //   console.log( this.fbEstimatedTon.value);  
  //   this.fbEstimatedTon.controls['divisionId'].setValue(this.divisionIds);
  //   this.fbEstimatedTon.controls['circleId'].setValue(this.circleIds);
  //   this.fbEstimatedTon.controls['sectionId'].setValue(this.sectionIds);
  //   this.fbEstimatedTon.controls['villageId'].setValue(this.villageIds);
  //   this.permitService.GetExcessTon(this.fbEstimatedTon.value).subscribe((resp) => {
  //     this.excessTons = resp as unknown as ExcessViewDto[];
  //     console.log(this.excessTons)
  //     var arrdivisionids = this.divisionIds?.split(',');
  //      arrdivisionids = Object.assign([],arrdivisionids);
  //      arrdivisionids.forEach(data => {
  //       parseInt(data)
  //      })
  //     console.log(arrdivisionids)
  //     this.fbEstimatedTon.controls['divisionId'].setValue(arrdivisionids); 
  //   })
  //   console.log(this.fbEstimatedTon.controls['divisionId'].value);
  // }

  editExecesston(event: Event, excesston: EstimatedViewDto) {
    this.fbexcesston.patchValue(excesston);
    this.fbexcesston.controls['excessTonage'].setValue(excesston.excessTonage);
    this.fbexcesston.controls['plotExcessTonId'].setValue(excesston.plotExcessTonId);
    this.fbEstimatedTon.controls['plotYieldId'].setValue(excesston.plotYieldId);
    this.fbEstimatedTon.controls['isActive'].setValue(excesston.isActive);
    this.opexcesston.toggle(event);
  }
  onSubmit() {
    if (this.fbexcesston.valid) {
      this.permitService.UpdateExcessTon(this.fbexcesston.value).subscribe(resp => {
        if (resp) {
          this.initEstimatedTon(this.currentSeason.seasonId!)
          this.alertMessage.displayAlertMessage(ALERT_CODES["SMPET002"]);
           this.fbexcesston.reset();
          this.getEstimatedTon()
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
  //  this.fbEstimatedTon.reset()
    this.showTable = true;
    this.showDialog = true;
  }
  editEstimatedTonnage(event: Event, EstimatedTon: EstimatedViewDto) {
    console.log(this.fbEstimatedTon.value)
    this.fbEstimatedTon.patchValue(EstimatedTon);
    this.fbEstimatedTon.controls['isActive'].setValue(EstimatedTon.isActive);
    this.fbEstimatedTon.controls['excessTonage'].setValue(EstimatedTon.excessTonage);
    this.fbEstimatedTon.controls['plotExcessTonId'].setValue(EstimatedTon.plotExcessTonId);
    this.fbEstimatedTon.controls['plotYieldId'].setValue(EstimatedTon.plotYieldId);
    this.opEstimatedTon.toggle(event);
  }

  SubmitEstimatedTonnage() {
    this.permitService.UpdateExcessTonnage(this.fbEstimatedTon.value).subscribe((resp) => {
      if (resp) {
        this.initEstimatedTon(this.currentSeason.seasonId!)
        this.alertMessage.displayAlertMessage(ALERT_CODES["SMPET002"]);
        this.fbEstimatedTon.reset();
      }
    })
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
    this.onSearch();
  }
}
