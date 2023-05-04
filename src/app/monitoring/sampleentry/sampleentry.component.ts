
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { FarmersViewDto, SampleslabsViewDto, SeasonDto } from 'src/app/_models/applicationmaster';
import { FarmerSectionViewDto, IPlotsofFarmerViewDto, ISampleDetailsViewDto, SampleDetailsDto, SampleDto } from 'src/app/_models/monitoring';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { MonitoringService } from 'src/app/_services/monitoring.service';
import { CURRENT_SEASON, EDocumentNumberScreens } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { HttpEvent } from '@angular/common/http';
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { ITableHeader } from 'src/app/_models/common';

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
  plotNumbers: IPlotsofFarmerViewDto[] = [];
  FarmerSectionViewDto: any
  sample: SampleDetailsDto = {};
  sampleEntries: ISampleDetailsViewDto[] = [];
  mediumDate: string = MEDIUM_DATE;
  addFlag: boolean = true;
  @ViewChild('filter') filter!: ElementRef;
  noOfSample: number = 0;
  noOfSamplesEntered: number = 0;
  selectedPlot: any;
  sampleArea: any;
  expectedSampleCount: number = 0;
  submitDisabled: boolean = false;
  sampleSlabs: SampleslabsViewDto[] = [];
  maxAreaThatUsedInRecods: number = 1.2;
  lastSampleSize: number = 0;
  enteredSampleCount: number = 0;
  netArea: number = 0;

  headers: ITableHeader[] = [
    { field: 'seasonCode', header: 'seasonCode', label: 'Season' },
    { field: 'farmerName', header: 'farmerName', label: 'Farmer Name' },
    { field: 'plotNumber', header: 'plotNumber', label: 'Plot Number' },
    { field: 'docNo', header: 'docNo', label: 'Doc No' },
    { field: 'docDate', header: 'docDate', label: 'Doc Date' },
    { field: 'fieldBrix', header: 'fieldBrix', label: 'Field Brix' },
    { field: 'pol', header: 'pol', label: 'Pol' },
  ];
  currentSeasonId?: number;
  samples: { id: number; name: string; }[];
  selectedSample: number = 1;

  constructor(private formbuilder: FormBuilder,
    private commonService: CommonService,
    private appMasterservice: AppMasterService,
    private monitoringService: MonitoringService,
    private messageService: MessageService,
    private alertMessage: AlertMessage) {
    this.samples = [
      { id: 1, name: 'Current season sample' },
      { id: 2, name: 'No sample data' },
      { id: 2, name: 'Possibility for exsisting samples' }
    ]
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

      seasonCode: [''],
      farmerCode: [''],
      farmerName: [''],
      plotNumber: ['']
    });
  }

  get FormControls() {
    return this.fbSampleEntry.controls;
  }

  initForm() {
    this.initSampleCaluclations();
  }

  onSearch() {
    this.initSampleEntries(this.currentSeason.seasonId!);
  }

  initSampleEntries(seasonId: number) {
    let param1 = this.filter.nativeElement.value == "" ? null : this.filter.nativeElement.value;
    this.monitoringService.GetSeasonSamples(seasonId, param1).subscribe((resp) => {
      this.sampleEntries = resp as unknown as ISampleDetailsViewDto[];
      console.log(this.sampleEntries);

    });
  }

  initCurrentSeason(seasonCode: string) {
    this.appMasterservice.CurrentSeason(seasonCode).subscribe((resp) => {
      this.currentSeason = resp as SeasonDto;
      this.currentSeasonId = this.currentSeason.seasonId;
      this.fbSampleEntry.controls['seasonId'].setValue(this.currentSeason.seasonId!);
      this.initSampleEntries(this.currentSeason.seasonId!)
      this.getDocNo();
    });
  }

  getDocNo() {
    this.commonService.GetDocNo(this.fbSampleEntry.controls['seasonId'].value,
      EDocumentNumberScreens.Samples).subscribe((resp) => {
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

  initSeasons() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp as any;
      this.fbSampleEntry.get('seasonId')?.patchValue(this.currentSeason.seasonId);
    });
  }

  addSampleEntry(sample: ISampleDetailsViewDto) {
    this.patchValues(sample);
    this.submitLabel = 'Add Sample Entry';
    this.addFlag = true;
  }

  initFarmers() {
    this.appMasterservice.GetFarmers().subscribe((resp) => {
      this.farmers = resp as unknown as FarmersViewDto[];
    })
  }

  editSampleEntry(sample: ISampleDetailsViewDto) {
    this.patchValues(sample);
    this.submitLabel = 'Update Sample Entry';
  }

  patchValues(sample: ISampleDetailsViewDto) {
    this.fbSampleEntry.patchValue(sample);
    this.fbSampleEntry.controls['noOfSample'].setValue(sample.sampleNo);
    this.fbSampleEntry.controls['noOfSamplesEntered'].setValue(sample.noOfSample);
    this.showDialog = true;
    if (sample.noOfSample == 0) {
      this.getDocNo();
    }
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
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMOPAS001" : "SMOPAS002"]);
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
  }

}


