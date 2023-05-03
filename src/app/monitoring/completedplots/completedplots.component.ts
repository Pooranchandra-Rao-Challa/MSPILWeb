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
import { ICompletedPlotViewDto, CompletedPlotDto, FarmerSectionViewDto, IPlotsofFarmerViewDto } from 'src/app/_models/monitoring';
import { CURRENT_SEASON, EDocumentNumberScreens } from 'src/environments/environment';
import { ITableHeader } from 'src/app/_models/common';

@Component({
  selector: 'app-completedplots',
  templateUrl: './completedplots.component.html',
  styles: [],
})

export class CompletedPlotsComponent implements OnInit {
  completedPlots: ICompletedPlotViewDto[] = [];
  completedPlot: CompletedPlotDto = new CompletedPlotDto();
  showDialog: boolean = false;
  addFlag: boolean = true;
  @ViewChild('filter') filter!: ElementRef;
  fbCompletedPlots!: FormGroup;
  seasons: any;
  transferResons: LookupDetailDto[] = [];
  plotTransferTypes: LookupDetailDto[] = [];
  billParameters: BillParameterViewDto[] = [];
  submitLabel!: string;
  currentSeason: SeasonDto = {};
  mediumDate: string = MEDIUM_DATE;
  purpose: string = 'Is Over';
  headers: ITableHeader[] = [
    { field: 'seasonCode', header: 'seasonCode', label: 'Season' },
    { field: 'farmerName', header: 'farmerName', label: 'Farmer' },
    { field: 'plotNumber', header: 'plotNumber', label: 'Plot No' },
    { field: 'estimatedTon', header: 'estimatedTon', label: 'Estimated Ton' },
    { field: 'suppliedTon', header: 'suppliedTon', label: 'Supplied Ton' },
    { field: 'netArea', header: 'netArea', label: 'Net Area' },
    { field: 'status', header: 'status', label: 'Plot Status' },
  ];
  farmers: FarmerSectionViewDto[] = [];
  plotNumbers: IPlotsofFarmerViewDto[] = [];
  diffGreaterThanEqualsToOne: boolean = false;
  diffLessThanOne: boolean = false;
  currentSeasonId?: number;

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
      seasonId: [null, (Validators.required)],
      plotId: [null, (Validators.required)],
      lastWeighmentDate: [null, (Validators.required)],
      isOver: [null],
      isLeftOver: [null],
      isRatoon: [null],
      isReopen: [null],

      // Not required for the server call.
      farmerId: [null, (Validators.required)],
      farmerName: [''],
      estimatedTon: [null],
      suppliedTon: [null],
      netArea: [null],

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
    this.monitoringService.GetCompletedPlots(seasonId, param1, this.purpose).subscribe((resp) => {
      this.completedPlots = resp as unknown as ICompletedPlotViewDto[];
    });
  }

  initCurrentSeason(seasonCode: string) {
    this.AppMasterService.CurrentSeason(seasonCode).subscribe((resp) => {
      this.currentSeason = resp as SeasonDto;
      this.currentSeasonId = this.currentSeason.seasonId;
      this.initCompletedPlots(this.currentSeason.seasonId!);
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
    var diffOfTon = this.FormControls['estimatedTon'].value - this.FormControls['suppliedTon'].value;
    if(diffOfTon >= 1){
      this.FormControls['isOver'].setValue(true);
      // this.FormControls['isOver'].disable();
      this.FormControls['isLeftOver'].setValue(false);
      // this.FormControls['isLeftOver'].disable();
      this.FormControls['isRatoon'].setValue(false);
      // this.FormControls['isRatoon'].enable();
      this.diffLessThanOne = true;
    }
    else {
      this.FormControls['isOver'].setValue(false);
      // this.FormControls['isOver'].disable();
      this.FormControls['isRatoon'].setValue(false);
      // this.FormControls['isRatoon'].disable();
      this.FormControls['isLeftOver'].setValidators(Validators.requiredTrue);
      this.FormControls['isLeftOver'].updateValueAndValidity();
      this.FormControls['isLeftOver'].setValue(null);
      this.diffGreaterThanEqualsToOne = true;
      // this.FormControls['isLeftOver'].enable();
    }
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  addCompletedPlot() {
    this.fbCompletedPlots.controls['seasonId'].setValue(this.currentSeasonId);
    this.getNewDocNo(this.currentSeasonId!);
    this.FormControls['isReopen'].clearValidators();
    this.FormControls['isReopen'].updateValueAndValidity();
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

  editCompletedPlot(completedPlot: ICompletedPlotViewDto) {
    this.fbCompletedPlots.patchValue(completedPlot);
    this.addFlag = false;
    // this.submitLabel = 'Update Completed Plot';
    this.FormControls['isReopen'].setValidators(Validators.required);
    this.FormControls['isReopen'].updateValueAndValidity();
    this.submitLabel = 'Reopen Plot';
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

  clearForm(){
    this.fbCompletedPlots.reset();
    this.diffLessThanOne = false;
    this.diffGreaterThanEqualsToOne = false;
  }

}
