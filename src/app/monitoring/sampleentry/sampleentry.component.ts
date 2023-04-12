
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { FarmersViewDto, SampleslabsViewDto, SeasonDto } from 'src/app/_models/applicationmaster';
import { FarmerSectionViewDto, IPlotsofFarmerViewDto, SampleDetailsDto, SampleDto } from 'src/app/_models/monitoring';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { MonitoringService } from 'src/app/_services/monitoring.service';
import { CURRENT_SEASON, EDocumentNumberScreens } from 'src/environments/environment';
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
  plots: IPlotsofFarmerViewDto[] = [];
  FarmerSectionViewDto: any
  sample: SampleDetailsDto = {};
  sampleEntries: SampleDetailsDto[] = [];
  mediumDate: string = MEDIUM_DATE;
  selectedFarmer: FarmerSectionViewDto = {};
  addFlag: boolean = true;
  @ViewChild('filter') filter!: ElementRef;
  noOfSample: number = 0;
  noOfSamplesEntered: number = 0;
  selectedPlot: any;
  sampleArea: any;
  expectedSampleCount: number = 0;
  isSampleCountMatched: boolean = false;
  submitDisabled: boolean = false;
  sampleSlabs: SampleslabsViewDto[] = [];
  maxAreaThatUsedInRecods: number = 1.2;
  lastSampleSize: number = 0;
  enteredSampleCount: number = 0;
  netArea: number = 0;

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

  constructor(private formbuilder: FormBuilder,
    private commonService: CommonService,
    private appMasterservice: AppMasterService,
    private monitoringService: MonitoringService,
    private messageService: MessageService,
    private alertMessage: AlertMessage,
  ) {
  }

  ngOnInit(): void {
    this.initSeasons();
    this.sampleEntryForm();
    this.initCurrentSeason(CURRENT_SEASON());
    this.initAppConstants()
  }

  sampleEntryForm() {
    this.fbSampleEntry = this.formbuilder.group({
      sampleId: [null],
      seasonId: [null, (Validators.required)],
      docNo: [null, (Validators.required)],
      docDate: [null, (Validators.required)],
      farmerId: [null, (Validators.required)],
      plotId: [null, (Validators.required)],
      fieldBrix: [null, (Validators.required)],
      brix: [null, (Validators.required)],
      pol: [null, (Validators.required)],
      plotYieldId: [],
      purity: [null, (Validators.required)],
      ccs: [null, (Validators.required)],
      noOfSamplesEntered: [null, (Validators.required)],
      noOfSample: [null, (Validators.required)],
    });
  }

  get FormControls() {
    return this.fbSampleEntry.controls;
  }

  initForm() {
    this.initSampleCaluclations();
    this.getDocNo();
  }

  onSearch() {
    this.initSampleEntries(this.currentSeason.seasonId!);
  }

  initSampleEntries(seasonId: number) {
    let param1 = this.filter.nativeElement.value == "" ? null : this.filter.nativeElement.value;
    this.monitoringService.GetSeasonSamples(seasonId, param1).subscribe((resp) => {
      this.sampleEntries = resp as unknown as SampleDetailsDto[];
    });
  }

  initCurrentSeason(seasonCode: string) {
    this.appMasterservice.CurrentSeason(seasonCode).subscribe((resp) => {
      this.currentSeason = resp as SeasonDto;
      this.fbSampleEntry.controls['seasonId'].setValue(this.currentSeason.seasonId!);
      this.initFarmerSections(this.currentSeason.seasonId!);
      this.initSampleEntries(this.currentSeason.seasonId!)
      this.getDocNo();
    });
  }

  initFarmerSections(season: number) {
    this.monitoringService.GetFarmerSections(season).subscribe((resp) => {
      this.farmers = resp as unknown as FarmerSectionViewDto[];
      this.getDocNo();
    })
  }

  initPlotsofFarmers(seasonId: any, farmerId: any) {
    this.monitoringService.GetPlotsofFarmers(seasonId, farmerId).subscribe((resp) => {
      this.plots = resp as unknown as IPlotsofFarmerViewDto[];
      if (this.addFlag == false) this.onPlotNumber(this.sample.plotId!);
    });
  }

  onSelectedFarmer(farmerId: number) {
    if (this.currentSeason?.seasonId && farmerId) {
      this.initPlotsofFarmers(this.currentSeason.seasonId, farmerId);
    }
    this.selectedFarmer = this.farmers.filter((farmer) => farmer.farmerId === farmerId)[0];
  }

  getDocNo() {
    this.commonService.GetDocNo(this.fbSampleEntry.controls['seasonId'].value,
    EDocumentNumberScreens.Samples).subscribe((resp) => {
      console.log(resp);

      this.fbSampleEntry.get('docNo')?.patchValue(resp);
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

  initSampleslabs() {
    this.appMasterservice.GetSampleSlabs().subscribe((resp) => {
      this.sampleSlabs = resp as unknown as SampleslabsViewDto[];
      this.sampleSlabs?.forEach((slab) => {
        if (this.netArea >= slab.fromArea && this.netArea <= slab.toArea) {
          this.fbSampleEntry.controls['noOfSample'].setValue(slab.noOfSample);
          let noOfSample = this.fbSampleEntry.controls['noOfSample'].value;
          let noOfSamplesEntered = this.fbSampleEntry.controls['noOfSamplesEntered'].value;
          if (noOfSamplesEntered < noOfSample) {
            this.isSampleCountMatched = false;
            if (this.addFlag == false) this.editSampleEntry(this.sample);
          }
          else {
            this.isSampleCountMatched = true;
          }
        }
      });
      if (!this.addFlag && this.isSampleCountMatched)
      this.messageService.add({
        key: 'samplesMsg',
        severity: 'error',
        summary: 'Error Message',
        detail: 'Number of entered samples matches with number of expected samples',
        life: 3000
      });
    });
  }

  onPlotNumber(plotId: number) {
    let plot = this.plots.filter((value) => value.plotId == plotId)[0];
    this.netArea = plot && plot.netArea;
    let enteredSamples = this.sampleEntries.filter((sample) => sample.plotId == plotId);
    this.enteredSampleCount = enteredSamples && enteredSamples.length;
    this.fbSampleEntry.controls['noOfSamplesEntered'].setValue(this.enteredSampleCount);
    this.initSampleslabs();
  }

  initSeasons() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp as any;
      this.fbSampleEntry.get('seasonId')?.patchValue(this.currentSeason.seasonId);
    });
  }

  addSampleEntry() {
    this.isSampleCountMatched = false;
    this.fbSampleEntry.controls['seasonId'].enable();
    this.fbSampleEntry.controls['seasonId'].patchValue(this.currentSeason.seasonId);
    this.submitLabel = 'Add Sample Entry';
    this.addFlag = true;
    this.showDialog = true;
  }

  initFarmers() {
    this.appMasterservice.GetFarmers().subscribe((resp) => {
      this.farmers = resp as unknown as FarmersViewDto[];
    })
  }

  sampleCountWhileEdit(sample: SampleDetailsDto) {
    this.sample = sample;
    this.addFlag = false;
    this.initPlotsofFarmers(this.currentSeason.seasonId, sample.farmerId);
  }

  editSampleEntry(sample: SampleDetailsDto) {
    this.fbSampleEntry.patchValue(sample)
    this.submitLabel = 'Update Plot Transfer';
    this.showDialog = true;
  }

  saveSampleEntry(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.monitoringService.CreateSampleEntry(this.fbSampleEntry.value)
    else return this.monitoringService.UpdateSampleEntry(this.fbSampleEntry.value)
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

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
    this.onSearch();
  }

  clearForm() {
    this.fbSampleEntry.reset();
    this.selectedFarmer = {};
  }
}


