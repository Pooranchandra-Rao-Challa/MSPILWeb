import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { FarmersViewDto, SeasonDto } from 'src/app/_models/applicationmaster';
import { ConstantDto } from 'src/app/_models/common';
import { SectionDto } from 'src/app/_models/geomodels';
import { FarmerSectionViewDto, PlotInfoDto, plotsofFarmerViewDto, SampleDto } from 'src/app/_models/monitoring';
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
  getPlots:any
  Brixfactor: number = 1.054;
  Polfactor: number = 1.122;
  brixFactor: any;
  polFactor: any;
  FarmerSectionViewDto:any
 
  
  
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
    this.initSampleCaluclations();
    this.initConstants()
  
   
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
  brixFactor: [],
      polFactor: [],
      purity: [{ value: null, disabled: true }],
      ccs: [{ value: null, disabled: true }],
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



  initPlotsofFarmers(season: any, farmer: any) {
    this.monitoringService.GetPlotsofFarmers(season, farmer).subscribe((resp) => {
      console.log(resp);
      this.getPlots = resp as unknown as plotsofFarmerViewDto[];
    });
  }

  onSelectedFarmer(farmerId: number) {
    const selectedFarmer = this.getFarmers.find((getFarmer) => getFarmer.farmerId === farmerId);
    if (selectedFarmer) {
      this.fbSampleEntry.controls['farmerName'].setValue(selectedFarmer.farmerName);
      if (this.currentSeason?.seasonId) {
        this.initPlotsofFarmers(this.currentSeason.seasonId, selectedFarmer.farmerId);
      }
    }
  }
  
  calculatePurityAndCCS() {
    const fieldBrix = this.fbSampleEntry.get('fieldBrix')?.value;
    const Brix = this.fbSampleEntry.get('Brix')?.value;
    const pol = this.fbSampleEntry.get('pol')?.value;
  
    const Purity = Brix == 0 ? 0 : Math.round((pol / Brix) * 100);
    const CCS = Math.round((0.87 * pol) - (0.29 * Brix));
  
    this.fbSampleEntry.get('purity')?.setValue(Purity);
    this.fbSampleEntry.get('ccs')?.setValue(CCS);
  }

  initSampleCaluclations(){
  this.fbSampleEntry.get('fieldBrix')?.valueChanges.subscribe(() => this.calculatePurityAndCCS());
  this.fbSampleEntry.get('Brix')?.valueChanges.subscribe(() => this.calculatePurityAndCCS());
  this.fbSampleEntry.get('pol')?.valueChanges.subscribe(() => this.calculatePurityAndCCS());
  }

  initAppConstants(seasonId: number) {
    this.commonService.GetSampleConstants().subscribe((resp) => {
      this.appConstants = resp as ConstantDto;
      this.brixFactor = this.appConstants.BrixFactor;
      this.polFactor = this.appConstants.PolFactor;
    });
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
 
  initConstants() {
    this.commonService.GetSampleConstants().subscribe((resp) => {
      this.appConstants = resp as ConstantDto;
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


