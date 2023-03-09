import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { VillagesViewDto } from 'src/app/_models/geomodels';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { BillMasterService } from 'src/app/_services/billmaster.service';
import { VillageParamRateViewDto, VillageParamRateDto, BillParameterViewDto } from 'src/app/_models/billingmaster';

@Component({
  selector: 'app-plot-transfers',
  templateUrl: './plot-transfers.component.html',
  styles: [
  ]
})
export class PlotTransfersComponent implements OnInit {

  showDialog: boolean = false;
  loading: boolean = true;
  addFlag: boolean = true;
  globalFilterFields: string[] = ['seasonName', 'divisionName', 'circleName', 'sectionName', 'villageName', 'billParameterName', 'rate', 'isActive',
    'createdAt', 'createdBy', 'updatedAt', 'updatedBy'];
  @ViewChild('filter') filter!: ElementRef;
  fbplotTransfer!: FormGroup;
  seasons: any;
  villages: VillagesViewDto[] = [];
  billParameters: BillParameterViewDto[] = [];
  submitLabel!: string;
  mediumDate: string = MEDIUM_DATE;


  constructor(private formbuilder: FormBuilder,
    private billMasterService: BillMasterService,
    private commonService: CommonService,
    private geoMasterService: GeoMasterService
  ) { }

  ngOnInit(): void {
   
    this.initDefaults();
    this.plotTransferForm();

  }

  getPlotTransferBySeason(seasonId: number) {
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

  plotTransferForm() {
    this.fbplotTransfer = this.formbuilder.group({
    
    
    });
  }

  get FormControls() {
    return this.fbplotTransfer.controls;
  }



  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  addPlotTransfer() {
    this.submitLabel = "Add Completed Plot";
    this.addFlag = true;
    this.showDialog = true;
  }

  editPlotTransfer(vParamRate: VillageParamRateViewDto) {
  }


  savePlotTransfer(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.billMasterService.CreateVillageParamRate(this.fbplotTransfer.value)
    else return this.billMasterService.UpdateVillageParamRate(this.fbplotTransfer.value)
  }

  onSubmit() {
  }

  


}
