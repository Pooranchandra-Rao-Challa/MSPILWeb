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
import { CompletedPlotViewDto, CompletedPlotDto, FarmerSectionViewDto, IPlotsofFarmerViewDto } from 'src/app/_models/monitoring';
import { CURRENT_SEASON, EDocumentNumberScreens } from 'src/environments/environment';

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
  addFlag: boolean = true;
  globalFilterFields: string[] = ['seasonName', 'divisionName', 'circleName', 'sectionName', 'villageName', 'billParameterName', 'rate',
    'createdAt', 'createdBy', 'updatedAt', 'updatedBy'];
  @ViewChild('filter') filter!: ElementRef;
  fbCompletedPlots!: FormGroup;
  seasons: any;
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
  farmers: FarmerSectionViewDto[] = [];
  plotNumbers: IPlotsofFarmerViewDto[] = [];

  constructor(private formbuilder: FormBuilder,
    private billMasterService: BillMasterService,
    private commonService: CommonService,
    private AppMasterService: AppMasterService,
    private monitoringService: MonitoringService,
    private LookupService: LookupService,) {
  }

  ngOnInit(): void {
    this.initDefaults();
    this.initCurrentSeason(CURRENT_SEASON());
    this.completedPlotsForm();
  }

  completedPlotsForm() {
    this.fbCompletedPlots = this.formbuilder.group({
      completedPlotId: [null],
      seasonId: [null, (Validators.required)],
      plotAssessmentId: [null],
      docNo: [null],
      docDate: [null, (Validators.required)],
      farmerId: [null, (Validators.required)],
      farmerName: [''],
      plotId: [null, (Validators.required)],
      estimatedTon: [null],
      suppliedTon: [null],
      netArea: [null],
      lastWeighmentDate: [null, (Validators.required)],
      isCompleted: [null, (Validators.required)],
      isLeftCultivation: [null, (Validators.required)],
      isUsedForRatoon: [null],
    });
  }

  get FormControls() {
    return this.fbCompletedPlots.controls;
  }

  onSearch() {
    this.initCompletedPlots(this.currentSeason.seasonId!);
  }

  initCompletedPlots(seasonId: number) {
    let param1 = this.filter.nativeElement.value == "" ? null : this.filter.nativeElement.value;
    this.monitoringService.GeAllCompletedPlots(seasonId, param1).subscribe((resp) => {
      this.completedPlots = resp as unknown as CompletedPlotViewDto[];
    });
  }

  initCurrentSeason(seasonCode: string) {
    this.AppMasterService.CurrentSeason(seasonCode).subscribe((resp) => {
      this.currentSeason = resp as SeasonDto;
      // this.initCompletedPlots(this.currentSeason.seasonId!);
      this.initFarmerInSections(this.currentSeason.seasonId!);
    });
  }

  initDefaults() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp;
    });

    this.billMasterService.GetBillParameters().subscribe((resp) => {
      this.billParameters = resp as unknown as BillParameterViewDto[];
    });

    this.LookupService.PlotTransferTypes().subscribe((resp) => {
      this.plotTransferTypes = resp as unknown as LookupDetailDto[];
    });
  }

  initFarmerInSections(seasonId: number) {
    this.monitoringService.GetFarmerSections(seasonId).subscribe((resp) => {
      this.farmers = resp as unknown as FarmerSectionViewDto[];
    });
  }

  onSelectedFarmer(farmerId: number) {
    const selectedFarmer = this.farmers.find((farmer) => farmer.farmerId === farmerId);
    if (selectedFarmer) {
      this.fbCompletedPlots.controls['farmerName'].setValue(selectedFarmer.farmerName);
      this.getPlotsofFarmers(this.currentSeason.seasonId!, this.fbCompletedPlots.controls['farmerId'].value);
    }
  }

  getPlotsofFarmers(seasonId: number, farmerId: number) {
    this.monitoringService.GetPlotsofFarmers(seasonId, farmerId).subscribe((resp) => {
      this.plotNumbers = resp as unknown as IPlotsofFarmerViewDto[];
    });
  }

  onSelectedPlot(plotId: number) {
    let selectedPlot = this.plotNumbers.find(x => x.plotId === plotId);
    if (selectedPlot) {
      this.fbCompletedPlots.controls['estimatedTon'].setValue(selectedPlot.estimatedTon);
      var suppliedTon = this.FormControls['estimatedTon'].value +  selectedPlot.excessTonage;
      this.fbCompletedPlots.controls['suppliedTon'].setValue(suppliedTon);
      this.fbCompletedPlots.controls['netArea'].setValue(selectedPlot.netArea);
    }
  }

  getDocNo(seasonId: number) {
    this.commonService.GetDocNo(seasonId, EDocumentNumberScreens.CompletedPlots).subscribe((resp) => {
      if (resp)
        this.fbCompletedPlots.get('docNo')?.setValue(resp);
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
    this.getDocNo(this.currentSeason.seasonId!);
    this.fbCompletedPlots.controls['seasonId'].setValue(this.currentSeason.seasonId);
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
          this.initCompletedPlots(this.currentSeason.seasonId!);
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
