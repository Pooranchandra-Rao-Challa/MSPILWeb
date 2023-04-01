
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { debounceTime, distinctUntilChanged, fromEvent, tap } from 'rxjs';
import { FarmersViewDto, SeasonDto } from 'src/app/_models/applicationmaster';
import { SectionDto } from 'src/app/_models/geomodels';
import { FarmerSectionViewDto, PlotInfoDto, plotsofFarmerViewDto, SampleDto } from 'src/app/_models/monitoring';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { MonitoringService } from 'src/app/_services/monitoring.service';
import { CURRENT_SEASON,EDocumentNumberScreens } from 'src/environments/environment';

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
  farmers: FarmerSectionViewDto[] = [];
  plots: any
  // brixFactor: any;
  // polFactor: any;
  FarmerSectionViewDto: any
  samples: SampleDto[] =[]
  selectedFarmer:FarmerSectionViewDto ={}
  @ViewChild('fieldBrix') fieldBrix!: ElementRef;
  @ViewChild('brix') brix!: ElementRef;
  @ViewChild('pol') pol!: ElementRef;



  constructor(private formbuilder: FormBuilder,
    private commonService: CommonService,
    private appMasterservice: AppMasterService,
    private monitoringService: MonitoringService,

  ) {


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
    this.fillData();
    this.initSeasons();
    this.initCurrentSeason();
    this.initAppConstants()
    this.sampleEntryForm();
  }
  sampleEntryForm() {
    this.fbSampleEntry = this.formbuilder.group({
      seasonId: [{ value: this.currentSeason.seasonId },],
      docNo: [null],
      docDate: [null,],
      farmerId: [null], /* Here farmerId is ryotNo */
      farmerName: [''],
      plotId: [null],
      fieldBrix: [null],
      brix: [null],
      pol: [null],
      purity: [{ value: null, disabled: true }],
      ccs: [{ value: null, disabled: true }],
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
 ClearForm(){
  this.fbSampleEntry.reset();
  this.selectedFarmer ={};
 }
 InitForm(){
  this.initSampleCaluclations();
  this.getDocNo();
 }
  initCurrentSeason() {
    this.appMasterservice.CurrentSeason(CURRENT_SEASON()).subscribe((resp) => {
      this.currentSeason = resp as SeasonDto;
      this.initSeasons();
      this.initFarmerSections(this.currentSeason.seasonId!);
    });
  }

  initFarmerSections(season: number) {
    this.monitoringService.GetSectionFarmers(season).subscribe((resp) => {
      this.farmers = resp as unknown as FarmerSectionViewDto[];
    })
  }



  initPlotsofFarmers(seasonId: any, farmerId: any) {
    this.monitoringService.GetPlotsofFarmers(seasonId, farmerId).subscribe((resp) => {
      this.plots = resp as unknown as plotsofFarmerViewDto[];
    });
  }

  onSelectedFarmer(farmerId: number) {
   this.selectedFarmer = this.farmers.filter((farmer) => farmer.farmerId === farmerId)[0];
    if (this.selectedFarmer) {
      this.fbSampleEntry.controls['farmerName'].setValue(this.selectedFarmer.farmerName);
      if (this.currentSeason?.seasonId) {
        this.initPlotsofFarmers(this.currentSeason.seasonId, this.selectedFarmer.farmerId);
      }
    }
  }
  getDocNo(){
    this.commonService.GetDocNo(this.currentSeason.seasonId!,EDocumentNumberScreens.Samples).subscribe((resp) => {
      this.fbSampleEntry.get('docNo')?.setValue(resp);
    });
  }
  calculatePurityAndCCS() {
    //const fieldBrix = this.fbSampleEntry.get('fieldBrix')?.value;
    const brix = this.fbSampleEntry.get('brix')?.value;
    const pol = this.fbSampleEntry.get('pol')?.value;
    console.log(brix);
    console.log(pol);

    const Purity = brix == 0 ? 0 : Math.round((pol / brix) * 100);
    const CCS = Math.round((this.appConstants.PolFactor * pol) - (this.appConstants.BrixFactor * brix));

    this.fbSampleEntry.get('purity')?.setValue(Purity);
    this.fbSampleEntry.get('ccs')?.setValue(CCS);
  }

  initSampleCaluclations() {
    //this.fbSampleEntry.get('fieldBrix')?.valueChanges.subscribe(() => this.calculatePurityAndCCS());
    this.fbSampleEntry.get('brix')?.valueChanges.subscribe(() => this.calculatePurityAndCCS());
    this.fbSampleEntry.get('pol')?.valueChanges.subscribe(() => this.calculatePurityAndCCS());
  }

  initAppConstants() {
    this.commonService.GetConstants().subscribe((resp) => {
      this.appConstants = resp as any;
    });
  }

  onPlotChange(plotId: number) {
    this.monitoringService.GetSamplesOfPlot(plotId).subscribe((resp) => {
      this.samples = resp as any;
    });
  }
  onSearch() {

  }
  initFarmers() {
    this.appMasterservice.GetFarmers().subscribe((resp) => {
      this.farmers = resp as unknown as FarmersViewDto[];
    })
  }
  initSeasons() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp as any;
      this.fbSampleEntry.get('seasonId')?.patchValue(this.currentSeason.seasonId);
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


