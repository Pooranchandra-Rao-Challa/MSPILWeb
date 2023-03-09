import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { VillagesViewDto } from 'src/app/_models/geomodels';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { CommonService } from 'src/app/_services/common.service';
import { BillMasterService } from 'src/app/_services/billmaster.service';
import { VillageParamRateViewDto } from 'src/app/_models/billingmaster';

@Component({
  selector: 'app-completed-plots',
  templateUrl: './completed-plots.component.html',
  styles: [],
})
export class CompletedPlotsComponent implements OnInit {
  showDialog: boolean = false;
  loading: boolean = true;
  addFlag: boolean = true;
  globalFilterFields: string[] = ['seasonName','isActive','createdAt','createdBy','updatedAt','updatedBy',
  ];
  @ViewChild('filter') filter!: ElementRef;
  getCompletedPlot!: FormGroup;
  seasons: any;
  villages: VillagesViewDto[] = [];
  submitLabel!: string;
  mediumDate: string = MEDIUM_DATE;

  constructor(
    private formbuilder: FormBuilder,
    private billMasterService: BillMasterService,
    private commonService: CommonService
  ) {}

  ngOnInit(): void {
    this.initDefaults();
    this.CompletedPlotForm();
  }

  getCompletedPlotBySeason(seasonId: number) {
    var seasonId = seasonId ? seasonId : 0;
    this.billMasterService
      .GetVillageParamRatesBySeasonId(seasonId)
      .subscribe((resp) => {
        this.loading = false;
      });
  }

  initDefaults() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp;
    });
  }

  CompletedPlotForm() {
    this.getCompletedPlot = this.formbuilder.group({
     
    });
  }

  onSearch() {

  }

  get FormControls() {
    return this.getCompletedPlot.controls;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  addCompletedPlot() {
    this.submitLabel = 'Add Plot Transfer';
    this.addFlag = true;
    this.showDialog = true;
  }

  editCompletedPlot() {

  }

  saveCompletedPlot(): Observable<HttpEvent<any>> {
    if (this.addFlag)
      return this.billMasterService.CreateVillageParamRate(
        this.getCompletedPlot.value
      );
    else
      return this.billMasterService.UpdateVillageParamRate(
        this.getCompletedPlot.value
      );
  }

  onSubmit() {
    console.log(this.getCompletedPlot.value)
  }
}
