import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { FarmersViewDto, SeasonDto } from 'src/app/_models/applicationmaster';
import { FarmerSectionViewDto, PlotInfoDto } from 'src/app/_models/monitoring';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { MonitoringService } from 'src/app/_services/monitoring.service';

export interface IHeader {
  field: string;
  header: string;
  label: string;
}

export class SampleDto {
  DocNo?: string;
  DocDate?: Date;
  FieldBrix?: number;
  Pol?: number;
  CreatedAt?: Date;
  CreatedBy?: string;
  UpdatedAt?: Date;
  UpdatedBy?: string;
  SeasonId?: number;
  PlotYieldId?: number;
  PlotNo?: number;
  FarmerCode?: number;
}

@Component({
  selector: 'sampleentry',
  templateUrl: './sampleentry.component.html',
  styles: [],
})
export class SampleEntryComponent implements OnInit {
  
  appConstants: any = {};
  sampleDto: SampleDto[] = [];
  fbSampleEntry!: FormGroup;
  currentSeason: SeasonDto = {};
  seasons!: any[];
  submitLabel!: string;
  showDialog: boolean = false;
  farmers: FarmersViewDto[] = [];
  isNewFarmer!: [false];
  loggedInUser: String = "";
  getFarmers:FarmerSectionViewDto[]=[];
  
  
  constructor(private formbuilder: FormBuilder,
    private commonService: CommonService,
    private appMasterservice: AppMasterService,
    private monitoringService: MonitoringService,
    private lookupService: LookupService,
    private jwtService: JWTService,
  ) {
    this.loggedInUser = this.jwtService.GetLoginId;
  
  }

  headers: IHeader[] = [
    { field: 'SeasonId', header: 'SeasonId', label: 'Season' },
    { field: 'FarmerCode', header: 'FarmerCode', label: 'Farmer' },
    { field: 'PlotNo', header: 'PlotNo', label: 'Plot No' },
    { field: 'farmerCode', header: 'farmerCode', label: 'Farmer Code' },
    { field: 'DocNo', header: 'DocNo', label: 'Doc No' },
    { field: 'DocDate', header: 'DocDate', label: 'DocDate' },
    { field: 'FieldBrix', header: 'FieldBrix', label: 'FieldBrix' },
    { field: 'Pol', header: 'Pol', label: 'Pol' },
    { field: 'CreatedAt', header: 'CreatedAt', label: 'Created At' },
    { field: 'CreatedBy', header: 'CreatedBy', label: 'Created By' },
    { field: 'UpdatedBy', header: 'UpdatedBy', label: 'Updated By' },
  ];

  ngOnInit(): void {
    let currentSeason = '2020-21';
    this.fillData();
    this.initSeasons();
    this.sampleEntryForm();
    this.initCurrentSeason(currentSeason);
   
  }
  sampleEntryForm() {
    this.fbSampleEntry = this.formbuilder.group({
      seasonId: [{ value: this.currentSeason.seasonId },],
      docNo: [{ value: '' }],
      docDate: ['',],
      farmerId: [], /* Here farmerId is ryotNo */
      farmerName: [''],
      plotNo: [''],
      fieldBrix: [''],
      Brix: [''],
      pol: [''],
      purity: [''],
      brixFactor: [''],
      polFactor: [''],
      ccs: [''],
      noofSample: [''],
      noofEnteredSamples: [''],
      isActive: [false],

    })
  }
   /**{
      "PolFactor": "0.87",
      "BrixFactor": "0.29",
      "WeighmentPrintCount": "3",
      "SpecialPermitAllowedLimit": "3",
      "PermitLapseHours": "48",
      "NonRegisteredBindingPERC": "0",
      "NonRegisteredBadPERC": "0",
      "SupportsMultiLogin": "true",
      "IsWeighmentApprovalRequired": "1"
  } */

  initCurrentSeason(seasonCode: string) {
    this.appMasterservice.CurrentSeason(seasonCode).subscribe((resp) => {
      this.currentSeason = resp as SeasonDto;
      this.initSeasons();
      this.initFarmerSections(this.currentSeason.seasonId!);
    });
  }

  initFarmerSections(season: number) {
   let temp="ff4986c9-a00d-4f99-af2c-672cafe4cffe";
    this.monitoringService.GetFarmerSections(season, temp).subscribe((resp) => {
      console.log(resp)
      // this.loggedInUser
      this.getFarmers = resp as unknown as FarmerSectionViewDto[];   
      
    })
  }


  onSelectedFarmer(farmerId: number) {
    const selectedFarmer = this.getFarmers.find((getFarmer) => getFarmer.farmerId === farmerId);
    if (selectedFarmer) {
      this.fbSampleEntry.controls['farmerName'].setValue(selectedFarmer.farmerName);
    }
  }
  onSearch() {
    this.initAppConstants(this.currentSeason.seasonId!);
  }
  initFarmers() {
    this.appMasterservice.GetFarmers().subscribe((resp) => {
      this.farmers = resp as unknown as FarmersViewDto[];
    })
  }
  initSeasons() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp as any;
    });
  }
  initAppConstants(seasonId: number) {
    this.lookupService.AppConstants().subscribe((resp) => {
      this.appConstants = resp as any;
      this.appConstants.PolFactor
    });
  }

  addSampleEntry() {
    this.submitLabel = 'Add Sample Entry';
    this.fbSampleEntry.controls['seasonId'].enable();
    this.showDialog = true;
  }

  get FormControls() {
    return this.fbSampleEntry.controls;
  }


  // For Farmer

  

  fillData() {
    for (var i of [1, 2]) {
      this.sampleDto.push(
        {
          DocNo: 'DocNo' + i,
          DocDate: new Date(),
          FieldBrix: 1,
          Pol: 1,
          CreatedAt: new Date(),
          CreatedBy: 'CreatedBy' + i,
          UpdatedAt: new Date(),
          UpdatedBy: 'UpdatedBy' + i,
          SeasonId: i,
          PlotYieldId: i,
          PlotNo: i,
          FarmerCode: i
        }
      )
    }
  }




}


