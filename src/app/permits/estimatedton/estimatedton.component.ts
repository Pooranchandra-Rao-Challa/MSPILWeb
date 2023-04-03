import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { SeasonDto } from "src/app/_models/applicationmaster";
import { IPlotOfferViewDto } from "src/app/_models/monitoring";
import { AppMasterService } from "src/app/_services/appmaster.service";
import { BillMasterService } from "src/app/_services/billmaster.service";
import { CommonService } from "src/app/_services/common.service";
import { LookupService } from "src/app/_services/lookup.service";
import { MonitoringService } from "src/app/_services/monitoring.service";

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
  seasons!: any[];
  currentSeason: SeasonDto = {};
  allottedPlots: IPlotOfferViewDto[] = [];
  loading: boolean = true;
  showTable: boolean = false;
  dateTime = new Date();

  forapproval: boolean = false;
  estimatedTonDto: EstimatedTonDto[] = [];

  @ViewChild('filter') filter!: ElementRef;
  fbEstimatedTonFilter: any;
  sampleDrop!: sampleDropdownValue[];
  selectSample? : sampleDropdownValue;


  constructor(private formbuilder: FormBuilder,
    private billMasterService: BillMasterService,
    private commonService: CommonService,
    private appMasterService: AppMasterService,
    private monitoringService: MonitoringService,
    private lookupService: LookupService,


  ) { }
  
  getEstimatedForm() {
    this.fbEstimatedTonFilter = this.formbuilder.group({
      seasonId : new FormControl('', [Validators.required]),
      divisionId : new FormControl('', [Validators.required]),
      circleId : new FormControl('', [Validators.required]),
      sectionId : new FormControl('', [Validators.required]),
      villageId : new FormControl('', [Validators.required]),
      fromPlantingDate : new FormControl('', [Validators.required]),
      toPlantingDate : new FormControl('', [Validators.required]),
      farmerCode : new FormControl('', [Validators.required]),
    });
  }

  get FormControals(){
    return this.fbEstimatedTonFilter.controls
  }

  ngOnInit(): void {
    this.fillData();
    this.initSeasons();
    this.getEstimatedForm();
    this.SampleDropdwon();

  }

  headers: IHeader[] = [
    { field: 'FarmerCode', header: 'FarmerCode', label: 'Farmer Code' },
    { field: 'FarmerName', header: 'FarmerName', label: 'Farmer Name' },
    { field: 'PlotNo', header: 'PlotNo', label: 'Plot No' },
    { field: 'VillageName', header: 'VillageName', label: 'Village Name' },
    { field: 'VarityName', header: 'VarityName', label: 'Varity Name' },
    { field: 'PlantType', header: 'PlantType', label: 'Plant Type' },
    { field: 'PlantingDate', header: 'PlantingDate', label: 'Planting Date' },
    { field: 'NetArea', header: 'NetArea', label: 'Net rea' },
    { field: 'Estimatedton', header: 'Estimatedton', label: 'Estimated ton' },
    { field: 'IncreasedEstimatedton', header: 'IncreasedEstimatedton', label: 'Increased Estimated ton' },
    { field: 'PermitTon', header: 'PermitTon', label: 'Permit Ton' },
    { field: 'SuppliedTon', header: 'SuppliedTon', label: 'Supplied Ton' },
    { field: 'BalanceTon', header: 'BalanceTon', label: 'Balance Ton' },
    { field: 'NoofWeighments', header: 'NoofWeighments', label: 'No of Weighments' },
    { field: 'UpdatedEstimatedton', header: 'UpdatedEstimatedton', label: 'Updated Estimated ton' },
];

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

  getEstimatedTon() {
    this.showTable = true;
  }
  
  SampleDropdwon(){
    this.sampleDrop = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];
  }

  fillData() {
    for (var i of [1, 2]) {
        this.estimatedTonDto.push(
            {
                FarmerCode: i,
                FarmerName: 'Farmer',
                PlotNo: 1,
                VillageName: 'Village',
                VarityName: 'Varity',
                PlantType: 'planttype',
                PlantingDate: new Date(),
                NetArea: 1,
                Estimatedton: 20,
                IncreasedEstimatedton: 5,
                PermitTon: 0,
                SuppliedTon: 0,
                BalanceTon: 25,
                NoofWeighments: 0,   
                UpdatedEstimatedton: 0
            }
        )
    }
}

}