import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';;
import { CommonService } from 'src/app/_services/common.service';
import { MonitoringService } from 'src/app/_services/monitoring.service';
import { LookupDetailDto, SeasonDto, } from 'src/app/_models/applicationmaster';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { IPlotsofFarmerViewDto, PlotsDto, PlotTransferDto, IPlotTransferViewDto, FarmerSectionViewDto, FarmerSelectInfoViewDto } from 'src/app/_models/monitoring'
import { CURRENT_SEASON, EDocumentNumberScreens } from 'src/environments/environment';
import { JWTService } from 'src/app/_services/jwt.service';
export interface IHeader {
  field: string;
  header: string;
  label: string;
}
@Component({
  selector: 'app-plottransfers',
  templateUrl: './plottransfers.component.html',
  styles: [
  ]
})
export class PlotTransfersComponent implements OnInit {
  plotTransfers: IPlotTransferViewDto[] = [];
  plotTransfer: PlotTransferDto = new PlotTransferDto();
  showDialog: boolean = false;
  addFlag: boolean = true;
  globalFilterFields: string[] = ['seasonName', 'fromFarmerName', 'plotNumber', 'docNo', 'docDate', 'plotTransferType', 'transferArea', 'toFarmerName', 'plotTransferReason',
    'createdAt', 'createdBy', 'updatedAt', 'updatedBy'];
  @ViewChild('filter') filter!: ElementRef;
  fbplotTransfer!: FormGroup;
  seasons: any;
  farmers: FarmerSectionViewDto[] = [];
  toFarmers: FarmerSelectInfoViewDto[] = [];
  filteredToFarmers: FarmerSelectInfoViewDto[] = [];
  transferResons: LookupDetailDto[] = [];
  plotTransferTypes: LookupDetailDto[] = [];
  submitLabel!: string;
  currentSeason: SeasonDto = {};
  plotInfo: PlotsDto = {};
  mediumDate: string = MEDIUM_DATE;
  plots: any[] = [];
  selectedFarmer: any;
  selectedPlot: any;
  permissions: any;

  headers: IHeader[] = [
    { field: 'seasonName', header: 'seasonName', label: 'Season' },
    { field: 'fromFarmerName', header: 'fromFarmerName', label: 'Farmer' },
    { field: 'plotNumber', header: 'plotNumber', label: 'Plot No' },
    { field: 'docNo', header: 'docNo', label: 'Doc No' },
    { field: 'docDate', header: 'docDate', label: 'Doc Date' },
    { field: 'plotTransferType', header: 'plotTransferType', label: 'Plot Transfer Type' },
    { field: 'transferArea', header: 'transferArea', label: 'Transfer Area' },
    { field: 'toFarmerName', header: 'toFarmerName', label: 'To Farmer Name' },
    { field: 'plotTransferReason', header: 'plotTransferReason', label: 'Plot Transfer Reason' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ];
  plotNumbers: IPlotsofFarmerViewDto[] = [];
  enableValidation: boolean = true;
  constructor(private formbuilder: FormBuilder,
    private commonService: CommonService,
    private AppMasterService: AppMasterService,
    private monitoringService: MonitoringService,
    private LookupService: LookupService,
    private jwtService: JWTService) { }

  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    this.initSeasons();
    this.initCurrentSeason(CURRENT_SEASON());
    this.plotTransferForm();
    this.initPlotTransferReasons();
    this.initPlotTransferTypes();
    this.initToRegfarmers();
  }

  plotTransferForm() {
    this.fbplotTransfer = this.formbuilder.group({
      plotTransferId: [null],
      seasonId: [null, (Validators.required)],
      plotId: [null, (Validators.required)],
      docDate: [null, (Validators.required)],
      plotTransferTypeId: [null, (Validators.required)],
      fromFarmerId: ['', (Validators.required)],
      transferArea: [null, (Validators.required)],
      toFarmerId: [null, (Validators.required)],
      plotTransferReasonId: [null, (Validators.required)],
      transferredToPlotId: [null],
      transferredToOfferId: [null],
      // only for displaying purpose
      docNo: [null],
      fromFarmerName: [''],
      toFarmerName: [''],
      netArea: [null]
    });
  }

  get FormControls() {
    return this.fbplotTransfer.controls;
  }

  initPlotsTransfers(seasonId: number) {
    let param1 = this.filter.nativeElement.value == "" ? null : this.filter.nativeElement.value;
    this.monitoringService.GetPlotsTransfers(seasonId, param1).subscribe((resp) => {
      this.plotTransfers = resp as unknown as IPlotTransferViewDto[];
    });
  }

  initSeasons() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp as any;
    });
  }

  initPlotTransferReasons() {
    this.LookupService.PlotTransferReasons().subscribe((resp) => {
      this.transferResons = resp as unknown as LookupDetailDto[]
    });
  }

  initPlotTransferTypes() {
    this.LookupService.PlotTransferTypes().subscribe((resp) => {
      this.plotTransferTypes = resp as unknown as LookupDetailDto[];
    });
  }

  initCurrentSeason(seasonCode: string) {
    this.AppMasterService.CurrentSeason(seasonCode).subscribe((resp) => {
      this.currentSeason = resp as unknown as SeasonDto;
      this.fbplotTransfer.controls['seasonId'].setValue(this.currentSeason.seasonId);
      this.initPlotsTransfers(this.currentSeason.seasonId!);
      this.getFarmerSections(this.currentSeason.seasonId!);
      this.getDocNo();
    });
  }

  getDocNo() {
    this.commonService.GetDocNo(this.fbplotTransfer.controls['seasonId'].value,
    EDocumentNumberScreens.PlotTransfers).subscribe((resp) => {
      if (resp)
        this.fbplotTransfer.get('docNo')?.setValue(resp);
    });
  }

  getFarmerSections(seasonId: number) {
    this.monitoringService.GetFarmerSections(seasonId).subscribe((resp) => {
      this.farmers = resp as unknown as FarmerSectionViewDto[];
    });
  }

  getPlotsofFarmers(seasonId: number, fromFarmerId: number) {
    this.monitoringService.GetPlotsofFarmers(seasonId, fromFarmerId).subscribe((resp) => {
      this.plotNumbers = resp as unknown as IPlotsofFarmerViewDto[];
    });
  }

  onSelectedPlot(plotId: number) {
    let selectedPlot = this.plotNumbers.find(x => x.plotId === plotId);
    if (selectedPlot) this.fbplotTransfer.controls['netArea'].setValue(selectedPlot.netArea);
  }

  onSearch() {
    this.initPlotsTransfers(this.currentSeason.seasonId!);
  }

  initToRegfarmers() {
    this.monitoringService.GetRegisteredFarmers().subscribe((resp) => {
      this.toFarmers = resp as unknown as FarmerSelectInfoViewDto[];
    });
  }

  onSeasonChange(seasonId:number){
    this.fbplotTransfer.controls['seasonId'].setValue(seasonId);
    this.getDocNo();
  }

  onSelectedFarmer(fromFarmerId: number) {
    const selectedFarmer = this.farmers.find((farmer) => farmer.farmerId === fromFarmerId);
    if (selectedFarmer) {
      this.fbplotTransfer.controls['fromFarmerName'].setValue(selectedFarmer.farmerName);
      // this.filteredTofarmers = this.tofarmers.filter((tofarmer) => tofarmer.id !== selectedFarmer.id);
      this.filteredToFarmers = this.toFarmers.filter((tofarmer) => tofarmer.id != selectedFarmer.farmerId);

      this.getPlotsofFarmers(this.currentSeason.seasonId!, this.fbplotTransfer.controls['fromFarmerId'].value);
    }
  }

  onSelectedToFarmer(toFarmerId: number) {
    const selectedFarmer = this.toFarmers.find((tofarmer) => tofarmer.id === toFarmerId);
    if (selectedFarmer)
      this.fbplotTransfer.controls['toFarmerName'].setValue(selectedFarmer.name);
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  addPlotTransfer() {
    this.fbplotTransfer.controls['seasonId'].setValue(this.currentSeason.seasonId);

    this.submitLabel = "Add Plot Transfer";
    this.addFlag = true;
    this.showDialog = true;
  }

  editPlotTransfer(plotTransfer: IPlotTransferViewDto) {
    this.fbplotTransfer.patchValue({
      plotTransferId: plotTransfer.plotTransferId,
      seasonId: plotTransfer.seasonId,
      // plotAssessmentId: plotTransfer.plotAssessmentId = 2,
      docNo: plotTransfer.docNo,
      docDate: plotTransfer.docDate,
      plotTransferTypeId: plotTransfer.plotTransferTypeId,
      fromFarmerId: plotTransfer.fromFarmerId,
      fromFarmerName: plotTransfer.fromFarmerName,
      transferArea: plotTransfer.transferArea,
      toFarmerId: plotTransfer.toFarmerId,
      farmerName: plotTransfer.toFarmerName,
      plotTransferReasonId: plotTransfer.plotTransferReasonId,
      // isActive: plotTransfer.isActive
    });
    this.fbplotTransfer.patchValue({
      docDate: new Date(plotTransfer.docDate?.toString() + ''),
    });

    this.addFlag = false;
    this.submitLabel = 'Update Plot Transfer';
    this.showDialog = true;
  }

  savePlotTransfer(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.monitoringService.CreatePlotTransfer(this.fbplotTransfer.value)
    else return this.monitoringService.UpdatePlotTransfer(this.fbplotTransfer.value)
  }

  onSubmit() {
    if (this.fbplotTransfer.valid) {
      this.savePlotTransfer().subscribe(resp => {
        if (resp) {
          this.initPlotsTransfers(this.currentSeason.seasonId!);
          this.fbplotTransfer.reset();
          this.showDialog = false;
        }
      })
    }
    else {
      this.fbplotTransfer.markAllAsTouched();
    }

  }

  onSelectedTransferType(typeId: number) {
    if (typeId == 54) {
      this.fbplotTransfer.controls['transferArea'].clearValidators();
      this.fbplotTransfer.controls['transferArea'].updateValueAndValidity();
      this.fbplotTransfer.controls['transferArea'].setValue(null);
      this.enableValidation = false;
      this.fbplotTransfer.controls['transferArea'].disable();
    }
    else {
      this.fbplotTransfer.controls['transferArea'].setValidators(Validators.required);
      this.fbplotTransfer.controls['transferArea'].updateValueAndValidity();
      this.enableValidation = true;
      this.fbplotTransfer.controls['transferArea'].enable();
    }
  }

  clearForm() {
    this.fbplotTransfer.reset();
    if (!this.enableValidation) {
      this.fbplotTransfer.controls['transferArea'].setValidators(Validators.required);
      this.fbplotTransfer.controls['transferArea'].updateValueAndValidity();
      this.enableValidation = true;
      this.fbplotTransfer.controls['transferArea'].enable();
    }
  }


}
