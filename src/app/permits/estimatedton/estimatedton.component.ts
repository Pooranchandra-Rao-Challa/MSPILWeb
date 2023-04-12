import { formatDate } from "@angular/common";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { FORMAT_DATE } from "src/app/_helpers/date.format.pipe";
import { SeasonDto } from "src/app/_models/applicationmaster";
import {CircleforEstimatedtonDto, DivisionsforEstimatedtonDto, EstimatedViewDto, FarmersInPlantingDatesDto, SectionforEstimatedtonDto, VillageforEstimatedtonDto } from "src/app/_models/permits";
import { AppMasterService } from "src/app/_services/appmaster.service";
import { BillMasterService } from "src/app/_services/billmaster.service";
import { CommonService } from "src/app/_services/common.service";
import { LookupService } from "src/app/_services/lookup.service";
import { MonitoringService } from "src/app/_services/monitoring.service";
import { permitService } from "src/app/_services/permit.service";
import { CURRENT_SEASON } from "src/environments/environment";

export interface IHeader {
  field: string;
  header: string;
  label: string;
}

export class EstimatedTonDto {
  FarmerCode?: number;
  FarmerName?: string;
  PlotNo?: number;
  VillageName?: string;
  VarityName?: string;
  PlantType?: string;
  PlantingDate?: Date;
  NetArea?: number;
  Estimatedton?: number;
  IncreasedEstimatedton?: number;
  PermitTon?: number;
  SuppliedTon?: number;
  BalanceTon?: number;
  NoofWeighments?: number;
  UpdatedEstimatedton?: number;
}
interface sampleDropdownValue {
  name: string;
  code: string;
}

@Component({
  selector: 'app-estimatedton',
  templateUrl: './estimatedton.component.html',
  styles: [],
})

export class EstimatedTonComponent implements OnInit {
  // activeTabs: boolean[] = [false];
  seasons!: any[];
  currentSeason: SeasonDto = {};
  loading: boolean = true;
  showTable: boolean = false;
  showForm: boolean = false;
  dateTime = new Date();
  estimatedton: EstimatedViewDto[] = [];
  @ViewChild('filter') filter!: ElementRef;
  fbEstimatedTon: any;
  farmers:FarmersInPlantingDatesDto[]=[];
  divisions:DivisionsforEstimatedtonDto[]=[];
  sections:SectionforEstimatedtonDto[]=[];
  circle:CircleforEstimatedtonDto ={}
  circles:CircleforEstimatedtonDto[]=[];
  villages:VillageforEstimatedtonDto[]=[];
  village:VillageforEstimatedtonDto = new VillageforEstimatedtonDto()
  constructor(private formbuilder: FormBuilder,
    private commonService: CommonService,
    private appMasterService: AppMasterService,
    private permitService:permitService) { }

  getEstimatedForm() {
    this.fbEstimatedTon = this.formbuilder.group({
      seasonId: new FormControl(null, [Validators.required]),
      divisionId: new FormControl(null, [Validators.required]),
      circleId: new FormControl(null, [Validators.required]),
      sectionId: new FormControl(null, [Validators.required]),
      villageId: new FormControl(null, [Validators.required]),
      frompltngDate:new FormControl(null, [Validators.required]),
      topltngDate: new FormControl(null, [Validators.required]),
      farmerCode: new FormControl(null, [Validators.required]),
    });
  }

  get FormControls() {
    return this.fbEstimatedTon.controls
  }
  ngOnInit(): void {
    this.initCurrentSeason(CURRENT_SEASON());
    this.getEstimatedForm();
    this.initDivisions();
    this.initSections();
    this.initCircles();
    this.initVillages();
  }
  
  headers: IHeader[] = [
    { field: 'updatedEstimatedton', header: 'updatedEstimatedton', label: 'Updated Estimated Ton' },
    { field: 'farmerCode', header: 'farmerCode', label: 'Farmer Code' },
    { field: 'farmerName', header: 'farmerName', label: 'Farmer Name' },
    { field: 'plotNumber', header: 'plotNumber', label: 'Plot No' },
    { field: 'villageName', header: 'villageName', label: 'Village Name' },
    { field: 'variety', header: 'variety', label: 'Variety Name' },
    { field: 'plantType', header: 'plantType', label: 'Plant Type' },
    { field: 'plantingDate', header: 'plantingDate', label: 'Planting Date' },
    { field: 'netArea', header: 'netArea', label: 'Net Area' },
    { field: 'estimatedTon', header: 'estimatedTon', label: 'Estimated Ton' },
    { field: 'excessTonage', header: 'excessTonage', label: 'Increased Estimated Ton' },
    { field: 'PermitTon', header: 'PermitTon', label: 'Permit Ton' },
    { field: 'SuppliedTon', header: 'SuppliedTon', label: 'Supplied Ton' },
    { field: 'BalanceTon', header: 'BalanceTon', label: 'Balance Ton' },
    { field: 'NoofWeighments', header: 'NoofWeighments', label: 'No of Weighments' },
  ];

  initSeasons() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp as any;
    });
  }
  initCurrentSeason(seasonCode: string) {
    this.appMasterService.CurrentSeason(seasonCode).subscribe((resp) => {
      this.currentSeason = resp as SeasonDto;
      this.initSeasons();
      this.initEstimatedTon(this.currentSeason.seasonId!);
      // this.GetFarmers(this.currentSeason.seasonId!);
    });
  }
  initEstimatedTon(seasonId:any){
    this.permitService.GetEstimatedTon(seasonId).subscribe((resp) => {
      this.estimatedton = resp as unknown as EstimatedViewDto[];
      console.log(this.estimatedton)
    });
  }
  initDivisions() {
    this.permitService.GetDivisionsforEstimatedton().subscribe((resp) => {
      this.divisions = resp as unknown as DivisionsforEstimatedtonDto[];
    });
    // this.circles = this.circles.filter((circle) => circle.circleId)
  }

  initSections() {
    this.permitService.GetSectionsforEstimatedton().subscribe((resp) => {
      this.sections = resp as unknown as SectionforEstimatedtonDto[];
    });
  }
  initCircles() {
    this.permitService.GetCirclesforEstimatedton().subscribe((resp) => {
      this.circles = resp as unknown as CircleforEstimatedtonDto[];
    });
  }
  initVillages() {
    this.permitService.GetVillagesforEstimatedton().subscribe((resp) => {
      this.villages = resp as unknown as VillageforEstimatedtonDto[];
    });
  }

  GetFarmers(){
    if (this.fbEstimatedTon.value.seasonId != null && this.fbEstimatedTon.value.frompltngDate!= null && 
      this.fbEstimatedTon.value.topltngDate != null && this.fbEstimatedTon.value.villageId != null){
    var seasonId = this.fbEstimatedTon.value.seasonId;
    var frompltngDate = formatDate(this.fbEstimatedTon.value.frompltngDate, 'yyyy-MM-dd','en-US')
    var topltngDate = formatDate(this.fbEstimatedTon.value.topltngDate, 'yyyy-MM-dd','en-US');
    var villageId = this.fbEstimatedTon.value.villageId
    this.permitService.GetFarmersInPlantingDates(seasonId,frompltngDate,topltngDate,villageId).subscribe((resp) => {
    this.farmers = resp as unknown as FarmersInPlantingDatesDto[];
      console.log(resp)
    })
  }
  }  
  toggleTab() {
    // this.showForm = true;
    this.showForm = !this.showForm;
  }
  getEstimatedTon() {
    this.showTable = true;
  }
}
