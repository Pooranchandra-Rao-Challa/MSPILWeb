import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';;
import { CommonService } from 'src/app/_services/common.service';
import { BillMasterService } from 'src/app/_services/billmaster.service';
import { VillageParamRateViewDto, BillParameterViewDto } from 'src/app/_models/billingmaster';
import { MonitoringService } from '../../_services/monitoring.service';
import { FarmersViewDto, LookupDetailDto, SeasonDto, } from 'src/app/_models/applicationmaster';
import { AppMasterService } from '../../_services/appmaster.service';
import { LookupService } from '../../_services/lookup.service';
import { FarmerSelectInfoViewDto, GetFarmersInSeasonViewDto, PlotInfoDto, PlotsDto, PlotTransferDto, PlotTransferViewDto } from 'src/app/_models/monitoring';
import { ActivatedRoute } from '@angular/router';


export interface IHeader {
  field: string;
  header: string;
  label: string;
}
@Component({
  selector: 'app-plot-transfers',
  templateUrl: './plot-transfers.component.html',
  styles: [
  ]
})
export class PlotTransfersComponent implements OnInit {

  plotTransfers: PlotTransferViewDto[] = [];
  plotTransfer: PlotTransferDto = new PlotTransferDto();
  showDialog: boolean = false;
  loading: boolean = true;
  addFlag: boolean = true;
  globalFilterFields: string[] = ['seasonName', 'divisionName', 'circleName', 'sectionName', 'villageName', 'billParameterName', 'rate', 'isActive',
    'createdAt', 'createdBy', 'updatedAt', 'updatedBy'];
  @ViewChild('filter') filter!: ElementRef;
  fbplotTransfer!: FormGroup;
  seasons: any;
  farmers: FarmerSelectInfoViewDto[] = [];
  tofarmers: FarmerSelectInfoViewDto[] = [];
  transferResons: LookupDetailDto[] = [];
  plotTransferTypes: LookupDetailDto[] = [];

  submitLabel!: string;
  plotReports: GetFarmersInSeasonViewDto[] = [];
  currentSeason: SeasonDto = {};
  plotInfo: PlotsDto = {};
  mediumDate: string = MEDIUM_DATE;

  headers: IHeader[] = [
    { field: 'SeasonName', header: 'SeasonName', label: 'Season' },
    { field: 'docNo', header: 'docNo', label: 'Doc No' },
    { field: 'docDate', header: 'docDate', label: 'Doc Date' },
    { field: 'plotTransferType', header: 'plotTransferType', label: 'Plot Transfer Type' },
    { field: 'fromFarmerName', header: 'fromFarmerName', label: 'From Farmer Name' },
    { field: 'transferArea', header: 'transferArea', label: 'Transfer Area' },
    { field: 'toFarmerName', header: 'toFarmerName', label: 'To Farmer Name' },
    { field: 'plotTransferReason', header: 'plotTransferReason', label: 'Plot Transfer Reason' },
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
    private LookupService: LookupService,

  ) { }
  ngOnInit(): void {
    let currentSeason = '2020-21';
    this.initDefaults();
    this.plotTransferForm();
    this.initPlotTransferReasons();
    this.initPlotTransferTypes();
    this.initRegfarmers();
    this.initToRegfarmers();

  }
  plotTransferForm() {
    this.fbplotTransfer = this.formbuilder.group({
      plotTransferId: [0],
      seasonId: ['', (Validators.required)],
      plotAssessmentId: [2],
      docNo: [{ value: '' }],
      docDate: ['', (Validators.required)],
      plotTransferTypeId: ['', (Validators.required)],
      fromFarmerId: ['', (Validators.required)],
      fromFarmerName: [''],
      title: [''],
      transferArea: ['', (Validators.required)],
      toFarmerId: ['', (Validators.required)],
      toFarmerName: [''],
      plotTransferReasonId: ['', (Validators.required)],
      isActive: [false],
    });
  }

  get FormControls() {
    return this.fbplotTransfer.controls;
  }

  onSearch() {
    this.initPlotsTransfer(this.currentSeason.seasonId!);
  }

  initPlotsTransfer(seasonId: number) {
    let param1 = this.filter.nativeElement.value == "" ? null : this.filter.nativeElement.value;
    this.monitoringService.GetAllPlotsTransfers(seasonId, param1).subscribe((resp) => {
      this.plotTransfers = resp as unknown as PlotTransferViewDto[];
      this.loading = false;
    });
  }

  initCurrentSeason(seasonCode: string) {
    this.AppMasterService.CurrentSeason(seasonCode).subscribe((resp) => {
      this.currentSeason = resp as SeasonDto;
      this.initSeasons();

      this.initPlotsTransfer(this.currentSeason.seasonId!);
    });
  }
  initSeasons() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp as any;
    });
  }

 

  GetFarmersInSeason(seasonId: number){
    var seasonId = seasonId ? seasonId : 0;
    this.monitoringService.GetFarmersInSeason(seasonId).subscribe((resp)=>{
    console.log(resp)
  })
    }

  initDefaults() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp;
    });
  }


  initRegfarmers() {
    this.monitoringService.GetRegisteredFarmers().subscribe((resp) => {
      this.farmers = resp as unknown as FarmerSelectInfoViewDto[];
    });
  }
  initToRegfarmers() {
    this.monitoringService.GetRegisteredFarmers().subscribe((resp) => {
      this.tofarmers = resp as unknown as FarmerSelectInfoViewDto[];
    });
  }
  initPlotTransferReasons() {
    this.LookupService.PlotTransferReasons().subscribe((resp) => {
      this.transferResons = resp as unknown as LookupDetailDto[]
      console.log(this.transferResons)
    });
  }

  initPlotTransferTypes() {
    this.LookupService.PlotTransferTypes().subscribe((resp) => {
      this.plotTransferTypes = resp as unknown as LookupDetailDto[];
      console.log(this.plotTransferTypes);

    });
  }


  onSelectedFarmer(fromFarmerId: number) {
    const selectedFarmer = this.farmers.find((farmer) => farmer.id === fromFarmerId);
    if (selectedFarmer) {
      this.fbplotTransfer.controls['fromFarmerName'].setValue(selectedFarmer.name);
    }
  }


  onSelectedToFarmer(toFarmerId: number) {
    const selectedFarmer = this.tofarmers.find((tofarmer) => tofarmer.id === toFarmerId);
    if (selectedFarmer) {
      this.fbplotTransfer.controls['toFarmerName'].setValue(selectedFarmer.name);
    }
  }



  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  addPlotTransfer() {
    this.submitLabel = "Add Plot Transfer";
    this.addFlag = true;
    this.showDialog = true;
  }

  // getNewDocNo(seasonId: number) {
  //   if (this.plotTransfer.plotTransferId == null)
  //     this.monitoringService.GetNewDocNo(seasonId).subscribe((resp) => {
  //      // if (resp) this.fbplotTransfer.controls['docNo'].setValue(resp);
  //     });
  // }
  editPlotTransfer(plotTransfer: PlotTransferViewDto) {
    this.fbplotTransfer.patchValue({
      plotTransferId: plotTransfer.plotTransferId,
      seasonId: plotTransfer.seasonId,
      plotAssessmentId: plotTransfer.plotAssessmentId = 2,
      docNo: plotTransfer.docNo,
      docDate: plotTransfer.docDate,
      plotTransferTypeId: plotTransfer.plotTransferTypeId,
      fromFarmerId: plotTransfer.fromFarmerId,
      fromFarmerName: plotTransfer.fromFarmerName,
      transferArea: plotTransfer.transferArea,
      toFarmerId: plotTransfer.toFarmerId,
      farmerName: plotTransfer.toFarmerName,
      plotTransferReasonId: plotTransfer.plotTransferReasonId,
      isActive: plotTransfer.isActive
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
    console.log(this.fbplotTransfer.value);
    if (this.fbplotTransfer.valid) {
      this.savePlotTransfer().subscribe(resp => {
        if (resp) {

          this.fbplotTransfer.reset();
          this.showDialog = false;
        }
      })
    }
    else {
      this.fbplotTransfer.markAllAsTouched();
    }

  }




}
