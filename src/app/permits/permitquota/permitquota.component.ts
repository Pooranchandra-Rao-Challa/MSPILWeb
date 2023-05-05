import { HttpEvent } from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Table } from 'primeng/table';
import { Observable } from "rxjs";
import { SeasonDto } from "src/app/_models/applicationmaster";
import { IPlotOfferViewDto } from "src/app/_models/monitoring";
import { GetQuotasViewDto, PermitQuotaDto, PlotQuotaViewDto, SeasonQuotaViewDto } from "src/app/_models/permits";
import { AppMasterService } from "src/app/_services/appmaster.service";
import { BillMasterService } from "src/app/_services/billmaster.service";
import { CommonService } from "src/app/_services/common.service";
import { LookupService } from "src/app/_services/lookup.service";
import { MonitoringService } from "src/app/_services/monitoring.service";
import { CURRENT_SEASON } from "src/environments/environment";
import { permitService } from '../../_services/permit.service';
import { PlotQuotaDto } from '../../_models/permits';
export interface IHeader {
  field: string;
  header: string;
  label: string;
}
export interface IFromHeader {
  field: string;
  header: string;
  label: string;
}
@Component({
  selector: 'app-permitquota',
  templateUrl: './permitquota.component.html',
  styles: [],
})
export class PermitQuotaComponent implements OnInit {
  seasons!: any[];
  fbPermitQuota!: FormGroup;
  permitquotas: SeasonQuotaViewDto[] = [];
  permitQuota: PermitQuotaDto [] = [];
  currentSeason: SeasonDto = {};
  loading: boolean = true;
  addFlag: boolean = true;
  showTable: boolean = false;
  showDialog: boolean = false;
  submitLabel!: string;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild('dtpermitquota') dtpermitquotas!: Table;
  selectedCategory: any = null;
  categories: any[] = [{ name: 'Division', key: 'D' }, { name: 'Circle', key: 'C' }, { name: 'Section', key: 'S' }, { name: 'Village', key: 'V' }];
  objPlotQuotas: PlotQuotaViewDto[] = [];
  Quotas: GetQuotasViewDto[] = [];
  fromSchGroupNo: any;
  toSchGroupNo: any;
  error: boolean = false;

  constructor(
    private formbuilder: FormBuilder,
    private commonService: CommonService,
    private appMasterService: AppMasterService,
    private permitService: permitService

  ) { }
  farmerHeaders: IHeader[] = [
    { field: 'seasonName', header: 'seasonName', label: 'Season' },
    { field: 'type', header: 'type', label: 'Type' },
    { field: 'docNo', header: 'docNo', label: 'Doc No' },
    { field: 'fromSchGroupNo', header: 'fromSchGroupNo', label: 'From Schedule Group No' },
    { field: 'toSchGroupNo', header: 'toSchGroupNo', label: 'To Schedule Group No' },
    { field: 'fromDate', header: 'fromDate', label: 'From Date' },
    { field: 'toDate', header: 'toDate', label: 'To Date' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ];
  plotHeaders: IHeader[] = [
    { field: 'quotaReleased', header: 'quotaReleased', label: 'Quota Released' },
    { field: 'divisionName', header: 'divisionName', label: 'Division Name' },
    { field: 'circleName', header: 'circleName', label: 'Circle Name' },
    { field: 'sectionName', header: 'sectionName', label: 'Section Name' },
    { field: 'villageName', header: 'villageName', label: 'Village Name' },
  ];
  PermitQuotaHeaders: IHeader[] = [
    { field: 'divisionName', header: 'divisionName', label: 'Division Name' },
    { field: 'circleName', header: 'circleName', label: 'Circle Name' },
    { field: 'sectionName', header: 'sectionName', label: 'Section Name' },
    { field: 'villageName', header: 'villageName', label: 'Village Name' },
    { field: 'tons', header: 'tons', label: 'Estimated Ton' },
    { field: 'Quota', header: 'Quota', label: 'Quota' },
  ];

  PermitQuotaform() {
    this.fbPermitQuota = this.formbuilder.group({
      seasonQuotaId: [0],
      docNo: [],
      docDate: [],
      seasonId: ['', Validators.required],
      toSchGroupNo: ['', Validators.required],
      fromSchGroupNo: ['', Validators.required],
      fromDate: [''],
      quotaReleased: ['', Validators.required],
      groupBy: ['', Validators.required],
      plotQuotas: this.formbuilder.array([])
    });
  }

  plotQuotasForm() {
    return this.formbuilder.group({
      plotQuotaId: 0,
      seasonQuotaId: 0,
      divisionId: [],
      circleId: [],
      sectionId: [],
      villageId: [],
      quotaReleased: [],
      serverUpdatedStatus: true
    });
  }
  get scheduleControls() {
    return this.fbPermitQuota.get('plotQuotas') as FormArray;
  }

  addSchedule() {
    const formArray = this.fbPermitQuota.get('plotQuotas') as FormArray;
    formArray.push(this.plotQuotasForm());
  }

  get FormControals() {
    return this.fbPermitQuota.controls
  }

  getPermitQuota() {
    this.submitLabel = "Add PermitQuota";
    this.addFlag = true;
    this.showDialog = true;
    const seasonId = this.fbPermitQuota.value.seasonId;
    this.PermitQuotaform();
    this.fbPermitQuota.patchValue({ seasonId });
  }

  ngOnInit(): void {
    this.initCurrentSeason(CURRENT_SEASON());
    this.initSeasons();
    this.PermitQuotaform();
  }
  initSeasons() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp as any;
    });
  }
  initQuotas() {
    this.permitService.GetQuotas(this.fbPermitQuota.value).subscribe((resp) => {
      this.Quotas = resp as unknown as GetQuotasViewDto[];
      console.log('Quotas', this.Quotas);
  
      const formArray = this.fbPermitQuota.get('plotQuotas') as FormArray;
      formArray.clear();
  
      for (const quota of this.Quotas) {
        formArray.push(this.formbuilder.group({
          plotQuotaId: 0,
          seasonQuotaId: 0,
          divisionId: quota.divisionId || null,
          circleId: quota.circleId || null,
          sectionId: quota.sectionId || null,
          villageId: quota.villageId || null,
          quotaReleased: quota.scheduledTons,
          serverUpdatedStatus: true
        }));
      }
  
      console.log(this.fbPermitQuota.value);
    });
  }

  initCurrentSeason(seasonCode: string) {
    this.appMasterService.CurrentSeason(seasonCode).subscribe((resp) => {
      this.currentSeason = resp as unknown as SeasonDto;
      this.initSeasons();
      this.initSeasonQuotas(this.currentSeason.seasonId!)

    });
  }

  initSeasonQuotas(seasonId: number) {
    this.permitService.GetSeasonQuotas(seasonId).subscribe((resp) => {
      this.permitquotas = resp as unknown as SeasonQuotaViewDto[];
      console.log('permitquotas', this.permitquotas);

    });
  }
  onRowExpand(source: any) {
    var data = source.data as SeasonQuotaViewDto;
    this.permitService.GetPlotQuotas(data.seasonId, data.seasonQuotaId).subscribe(resp => {
      data.objPlotQuotas = resp as unknown as PlotQuotaViewDto[];
    });
  }                   
  editPermitQuota(permitQuota: SeasonQuotaViewDto) {
    const permitQuotaFormValue = {
      seasonId: permitQuota.seasonId,
      toSchGroupNo: permitQuota.toSchGroupNo,
      fromSchGroupNo: permitQuota.fromSchGroupNo,
      fromDate: permitQuota.fromDate ? new Date(permitQuota.fromDate.toString() + '') : null,
      quotaReleased: permitQuota.quotaReleased,
      groupBy: permitQuota.groupBy,
      plotQuotas: permitQuota.plotQuotas ? permitQuota.plotQuotas.map((quota: any) => {
        return {
          plotQuotaId: quota.plotQuotaId,
          seasonQuotaId: quota.seasonQuotaId,
          divisionId: quota.divisionId ,
          circleId: quota.circleId ,
          sectionId: quota.sectionId || null,
          villageId: quota.villageId || null,
          quotaReleased: quota.quotaReleased,
          serverUpdatedStatus: true
        };
      }) : []
    };
  
    this.fbPermitQuota.patchValue(permitQuotaFormValue);
    this.fbPermitQuota.enable();
  
    this.addFlag = false;
    this.submitLabel = 'Update permit quota';
    this.showDialog = true;
  }
  
 

  savePermitQuota(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.permitService.CreatepermitQuota(this.fbPermitQuota.value);
    else return this.permitService.UpdatePermitQuota(this.fbPermitQuota.value);
  }

  onSubmit() {
    const obj = {
      seasonId: this.fbPermitQuota.value.seasonId,
      fromSchGroupNo: this.fbPermitQuota.value.fromSchGroupNo,
      toSchGroupNo: this.fbPermitQuota.value.toSchGroupNo,
      fromDate: this.fbPermitQuota.value.fromDate,
      toDate: this.fbPermitQuota.value.toDate,
      quotaReleased: this.fbPermitQuota.value.quotaReleased,
      groupBy: this.fbPermitQuota.value.groupBy,
      serverUpdatedStatus: this.fbPermitQuota.value.serverUpdatedStatus,
      plotQuotas: this.fbPermitQuota.value.plotQuotas.map((quota: any) => {
        return {
          ...quota,
          divisionId: quota.divisionId || null,
          circleId: quota.circleId || null,
          sectionId: quota.sectionId || null,
          villageId: quota.villageId || null,
        };
      })
    };
  
    this.permitService.CreatepermitQuota(obj).subscribe((resp) => {
      if (resp) {
        this.showDialog = false;
      }
    });
  }

  onSearch() {
    this.initSeasonQuotas(this.currentSeason.seasonId!);
  }
  
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  checkValue() {
    if (this.fromSchGroupNo < this.toSchGroupNo) {
      this.error = false;
      return;
    }
    else if (this.toSchGroupNo == undefined) {
      this.error = false;
      return;
    }
    else {
      this.error = true;
    }
  }

}