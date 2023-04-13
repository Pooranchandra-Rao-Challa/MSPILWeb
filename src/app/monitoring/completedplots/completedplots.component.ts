import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';;
import { CommonService } from 'src/app/_services/common.service';
import { BillMasterService } from 'src/app/_services/billmaster.service';
import { BillParameterViewDto } from 'src/app/_models/billingmaster';
import { MonitoringService } from 'src/app/_services/monitoring.service';
import { FarmersViewDto, LookupDetailDto, SeasonDto, } from 'src/app/_models/applicationmaster';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { CompletedPlotViewDto, CompletedPlotDto } from 'src/app/_models/monitoring';

export interface IHeader {
  field: string;
  header: string;
  label: string;
}

@Component({
  selector: 'app-completedplots',
  templateUrl: './completedplots.component.html',
  styles: [],
})

export class CompletedPlotsComponent implements OnInit {
  completedPlots: CompletedPlotViewDto[] = [];
  completedPlot: CompletedPlotDto = new CompletedPlotDto();
  showDialog: boolean = false;
  loading: boolean = true;
  addFlag: boolean = true;
  globalFilterFields: string[] = ['seasonName', 'divisionName', 'circleName', 'sectionName', 'villageName', 'billParameterName', 'rate', 'isActive',
    'createdAt', 'createdBy', 'updatedAt', 'updatedBy'];
  @ViewChild('filter') filter!: ElementRef;
  fbCompletedPlots!: FormGroup;
  seasons: any;
  toFarmers: CompletedPlotViewDto[] = [];
  transferResons: LookupDetailDto[] = [];
  plotTransferTypes: LookupDetailDto[] = [];
  billParameters: BillParameterViewDto[] = [];
  submitLabel!: string;
  currentSeason: SeasonDto = {};
  mediumDate: string = MEDIUM_DATE;

  headers: IHeader[] = [
    { field: 'season', header: 'season', label: 'Season' },
    { field: 'docNo', header: 'docNo', label: 'Doc No' },
    { field: 'docDate', header: 'docDate', label: 'Doc Date' },
    { field: 'estimatedTon', header: 'estimatedTon', label: 'Estimated Ton' },
    { field: 'netArea', header: 'netArea', label: 'Net Area' },
    { field: 'isCompleted', header: 'isCompleted', label: 'Is Completed' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ];

  constructor(private formbuilder: FormBuilder,
    private billMasterService: BillMasterService,
    private commonService: CommonService,
    private AppMasterService: AppMasterService,
    private monitoringService: MonitoringService,
    private LookupService: LookupService,) {
  }

  ngOnInit(): void {
    this.initDefaults();
    this.CompletedPlotsForm();
    this.initTofarmers();
    this.CompletedPlotsForm();
    this.initCompletedPlots()
    let CurrentSeason = '2020-22';
  }

  CompletedPlotsForm() {
    this.fbCompletedPlots = this.formbuilder.group({
      completedPlotId: [0],
      seasonId: [{ value: this.currentSeason.seasonId }, (Validators.required)],
      plotAssessmentId: [2],
      docNo: [{ value: '' }],
      farmerId: [''],
      docDate: ['', (Validators.required)],
      isCompleted: ['', (Validators.required)],
      isLeftCultivation: ['', (Validators.required)],
      isUsedForRatoon: ['',],
      toFarmerName: [''],
      estimatedTon: [''],
      "isActive": true
    });
  }

  get FormControls() {
    return this.fbCompletedPlots.controls;
  }

  onSearch() {
    this.initCompletedPlot(this.currentSeason.seasonId!);
  }

  initCompletedPlot(seasonId: number) {
    let param1 = this.filter.nativeElement.value == "" ? null : this.filter.nativeElement.value;
    this.monitoringService.GeAllCompletedPlots(seasonId, param1).subscribe((resp) => {
      this.completedPlots = resp as unknown as CompletedPlotViewDto[];
      this.loading = false;
    });
  }

  initCurrentSeason(seasonCode: string) {
    this.AppMasterService.CurrentSeason(seasonCode).subscribe((resp) => {
      this.currentSeason = resp as SeasonDto;
      this.initSeasons();
      this.initCompletedPlot(this.currentSeason.seasonId!);
    });
  }

  initSeasons() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp as any;
    });
  }

  getCompletedPlotsBySeason(seasonId: number) {
    var seasonId = seasonId ? seasonId : 0;
    this.billMasterService.GetVillageParamRatesBySeasonId(seasonId).subscribe((resp) => {
      this.loading = false;
    });
  }

  initDefaults() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp;
    });

    this.billMasterService.GetBillParameters().subscribe((resp) => {
      this.billParameters = resp as unknown as BillParameterViewDto[];
    });
  }

  initTofarmers() {
    this.AppMasterService.GetFarmers().subscribe((resp) => {
      this.toFarmers = resp as unknown as FarmersViewDto[];
    });
  }

  initCompletedPlots() {
    this.LookupService.PlotTransferTypes().subscribe((resp) => {
      this.plotTransferTypes = resp as unknown as LookupDetailDto[];
    });
  }

  onSelectedToFarmer(farmerId: number) {
    this.toFarmers.forEach((value) => {
      if (value.farmerId == farmerId) {
        this.fbCompletedPlots.controls['toFarmerName'].setValue(value.farmerName);
      }
    });
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  addCompletedPlot() {
    this.submitLabel = "Add Completed Plot";
    this.addFlag = true;
    this.showDialog = true;
  }

  getNewDocNo(seasonId: number) {
    if (this.completedPlot.completedPlotId == null)
      this.monitoringService.GetNewDocNoForCompletedPlots(seasonId).subscribe((resp) => {
        if (resp) this.fbCompletedPlots.controls['docNo'].setValue(resp);
      });
  }

  editCompletedPlot(completedPlot: CompletedPlotViewDto) {
    this.fbCompletedPlots.patchValue({
      completedPlotId: completedPlot.completedPlotId,
      seasonId: completedPlot.seasonId,
      plotAssessmentId: completedPlot.plotAssessmentId = 2,
      docNo: completedPlot.docNo,
      docDate: completedPlot.docDate?.toString(),
      isCompleted: completedPlot.isCompleted,
      isLeftCultivation: completedPlot.isLeftCultivation,
      isUsedForRatoon: completedPlot.isUsedForRatoon,
      isActive: completedPlot.isActive
    });
    this.fbCompletedPlots.patchValue({
      docDate: new Date(completedPlot.docDate?.toString() + "")
    });
    this.addFlag = false;
    this.submitLabel = 'Update Completed Plot';
    this.showDialog = true;
  }

  saveCompletedPlot(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.monitoringService.CreateCompletedPlot(this.fbCompletedPlots.value)
    else return this.monitoringService.UpdateCompletedPlot(this.fbCompletedPlots.value)
  }

  onSubmit() {
    if (this.fbCompletedPlots.valid) {
      this.saveCompletedPlot().subscribe(resp => {
        if (resp) {
          this.initCompletedPlot(this.currentSeason.seasonId!);
          this.fbCompletedPlots.reset();
          this.showDialog = false;
        }
      })
    }
    else {
      this.fbCompletedPlots.markAllAsTouched();
    }

  }

}
