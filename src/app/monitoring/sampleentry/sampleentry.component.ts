
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { debounceTime, distinctUntilChanged, fromEvent, Observable, tap } from 'rxjs';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { FarmersViewDto, SeasonDto } from 'src/app/_models/applicationmaster';
import { SectionDto } from 'src/app/_models/geomodels';
import { FarmerSectionViewDto, PlotInfoDto, plotsofFarmerViewDto, SampleDetailsDto, SampleDto } from 'src/app/_models/monitoring';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { MonitoringService } from 'src/app/_services/monitoring.service';
import { CURRENT_SEASON,EDocumentNumberScreens } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { HttpEvent } from '@angular/common/http';
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';

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
  plots: plotsofFarmerViewDto[] =[];
  FarmerSectionViewDto: any
  sample: SampleDto[] =[];
  samples:SampleDetailsDto[] = [];
  mediumDate: string = MEDIUM_DATE;
  selectedFarmer:FarmerSectionViewDto ={}
  addFlag: boolean = true;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild('fieldBrix') fieldBrix!: ElementRef;
  @ViewChild('brix') brix!: ElementRef;
  @ViewChild('pol') pol!: ElementRef;
  noOfSample: number = 0;
  noOfSamplesEntered: number = 0;
  selectedPlot: any;
  sampleArea: any;
  expectedSampleCount: number=0;
  isSampleCountMatched: boolean = false;
  submitDisabled: boolean = false;
  
  constructor(private formbuilder: FormBuilder,
    private commonService: CommonService,
    private appMasterservice: AppMasterService,
    private monitoringService: MonitoringService,
    private messageService:MessageService,
    private alertMessage: AlertMessage,

  ) {
  }


  headers: IHeader[] = [
    { field: 'season', header: 'season', label: 'Season' },
    { field: 'farmerName', header: 'farmerName', label: 'Farmer Name' },
    { field: 'plotNumber', header: 'plotNumber', label: 'Plot Number' },
    { field: 'docNo', header: 'docNo', label: 'Doc No' },
    { field: 'docDate', header: 'docDate', label: 'Doc Date' },
    { field: 'fieldBrix', header: 'fieldBrix', label: 'Field Brix' },
    { field: 'pol', header: 'pol', label: 'Pol' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ];

  ngOnInit(): void {
    this.initSeasons();
    this.initCurrentSeason();
    this.initAppConstants()
    this.sampleEntryForm();

  
  }

  sampleEntryForm() {
    this.fbSampleEntry = this.formbuilder.group({
      sampleId:[0],
      seasonId: [{ value: this.currentSeason.seasonId },],
      docNo: [],
      docDate: ['',],
      farmerId: [],
      farmerName: [''],
      plotId: [],
      fieldBrix: [],
      brix: [],
      pol: [],
      plotYieldId:[],
      purity: [{ value: null, disabled: true }],
      ccs: [{ value: null, disabled: true }],
      noOfSamplesEntered:[null],
      noOfSample:[null],
      serverUpdatedStatus: true
    })
  }
 
 ClearForm(){
  this.fbSampleEntry.reset();
  this.selectedFarmer ={};
 }
 InitForm(){
  this.initSampleCaluclations();
  this.getDocNo();
 }

 onSearch() {
  this.initSampleEntry(this.currentSeason.seasonId!);
}


initSampleEntry(seasonId: number) {
  let param1 = this.filter.nativeElement.value == "" ? null : this.filter.nativeElement.value;
  this.monitoringService.GetSeasonSamples(seasonId, param1).subscribe((resp) => {
    this.samples = resp as unknown as SampleDetailsDto[];
    console.log(this.samples)
  });
}

  initCurrentSeason() {
    this.appMasterservice.CurrentSeason(CURRENT_SEASON()).subscribe((resp) => {
      this.currentSeason = resp as SeasonDto;
      this.initSeasons();
      this.initFarmerSections(this.currentSeason.seasonId!);
     this.initSampleEntry(this.currentSeason.seasonId!)
    }); }
  initFarmerSections(season: number) {
    this.monitoringService.GetSectionFarmers(season).subscribe((resp) => {
      this.farmers = resp as unknown as FarmerSectionViewDto[];
    })
  }
  initPlotsofFarmers(seasonId: any, farmerId: any) {
    this.monitoringService.GetPlotsofFarmers(seasonId, farmerId).subscribe((resp) => {
      this.plots = resp as unknown as plotsofFarmerViewDto[];
      console.log(this.plots)
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

  // onSelectedPlot(plotId: number) {
  //   const selectedPlot = this.plots.filter((plot) => plot.plotId === plotId)[0];
  
  //   if (selectedPlot) {
  //     this.selectedPlot = selectedPlot;
  //     const netArea = selectedPlot.area - selectedPlot.deductionArea;
  //     this.numberOfSamples = Math.ceil(netArea / this.selectedSampleSlab.toArea);
  //     this.numberOfEnteredSamples = selectedPlot.sampleEntries.filter(entry => entry.isActive).length;
  
  //     if (this.numberOfEnteredSamples === this.numberOfSamples) {
  //       console.log("All samples have been entered");
  //     } else {
  //       console.log(`${this.numberOfEnteredSamples} out of ${this.numberOfSamples} samples have been entered`);
  //     }
  //   }
  // }
  getDocNo(){
    this.commonService.GetDocNo(this.currentSeason.seasonId!,EDocumentNumberScreens.Samples).subscribe((resp) => {
      this.fbSampleEntry.get('docNo')?.setValue(resp);
    });
  } 
  calculatePurityAndCCS() {
    const brix = this.fbSampleEntry.get('brix')?.value;
    const pol = this.fbSampleEntry.get('pol')?.value;
    const Purity = brix == 0 ? 0 : Math.round((pol / brix) * 100);
    const CCS = Math.round((this.appConstants.PolFactor * pol) - (this.appConstants.BrixFactor * brix));
    this.fbSampleEntry.get('purity')?.setValue(Purity);
    this.fbSampleEntry.get('ccs')?.setValue(CCS);
  }

  initSampleCaluclations() {
    this.fbSampleEntry.get('brix')?.valueChanges.subscribe(() => this.calculatePurityAndCCS());
    this.fbSampleEntry.get('pol')?.valueChanges.subscribe(() => this.calculatePurityAndCCS());
  }

  initAppConstants() {
    this.commonService.GetConstants().subscribe((resp) => {
      this.appConstants = resp as any;
    });
  }


  onPlotChange(plotId: any) {
  
    // const seasonId = selectedPlot.seasonId;
    // const farmerId = selectedPlot.farmerId;
    let filteredSamples =this.samples.filter((sample)=>sample.plotId==plotId);
    // this.monitoringService.GetPlotsofFarmers(selectedPlot.seasonId, selectedPlot.farmerId).subscribe((resp) => {
    //   const sample = resp as unknown as any[];
    //   if (sample && sample.length > 0) {
    //     let netAreaTotal = 0;
    //     for (let i = 0; i < sample.length; i++) {
    //       netAreaTotal += sample[i].netArea;
    //     }
    //     if (netAreaTotal >= 0 && netAreaTotal < 4) {
    //       this.expectedSampleCount = 1;
    //     } else if (netAreaTotal >= 4 && netAreaTotal < 8) {
    //       this.expectedSampleCount = 2;
    //     }
    //     this.isSampleCountMatched =  this.sample.length >= this.expectedSampleCount ;
    //     this.submitDisabled =    this.sample.length <  this.expectedSampleCount ;
    //     if (this.isSampleCountMatched) {
    //       this.alertMessage.displayAlertMessage(ALERT_CODES[ "SMMSE001" ]);
    //     }
    //   } else {
    //     this.expectedSampleCount = 0;
    //     this.isSampleCountMatched = false;
    //     this.submitDisabled = true;
    //   }
    // });
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
    this.addFlag = true;
    this.showDialog = true;
  }
  initFarmers() {
    this.appMasterservice.GetFarmers().subscribe((resp) => {
      this.farmers = resp as unknown as FarmersViewDto[];
    })
  }

  editSampleEntry(sample:SampleDetailsDto){
    this.fbSampleEntry.patchValue(sample)
    this.submitLabel = 'Update Plot Transfer';
    this.showDialog = true;
    this.addFlag = false;
  }

  get FormControls() {
    return this.fbSampleEntry.controls;
  }



  saveSampleEntry(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.monitoringService.CreateSample(this.fbSampleEntry.value)
    else return this.monitoringService.UpdatePlotTransfer(this.fbSampleEntry.value)
  }

  onSubmit() {
    
    if (this.fbSampleEntry.valid) {
      this.saveSampleEntry().subscribe((resp: any) => {
        if (resp) {
          this.fbSampleEntry.reset();
          this.showDialog = false;
        }
      })
    }
    else {
      this.fbSampleEntry.markAllAsTouched();
    }

  }
  // For Farmer
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }









}


