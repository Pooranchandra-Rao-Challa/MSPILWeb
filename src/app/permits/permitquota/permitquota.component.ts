import { HttpEvent } from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Table } from 'primeng/table';
import { Observable } from "rxjs";
import { SeasonDto } from "src/app/_models/applicationmaster";
import { GetQuotasViewDto, PermitQuotaDto, PlotQuotaViewDto, SeasonQuotaViewDto } from "src/app/_models/permits";
import { AppMasterService } from "src/app/_services/appmaster.service";
import { CommonService } from "src/app/_services/common.service";
import { CURRENT_SEASON } from "src/environments/environment";
import { permitService } from '../../_services/permit.service';

import { MessageService } from "primeng/api";
import { FORMAT_DATE } from "src/app/_helpers/date.format.pipe";
import { AlertMessage, ALERT_CODES } from "src/app/_alerts/alertMessage";
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
  permitQuota: PermitQuotaDto[] = [];
  currentSeason: SeasonDto = {};
  loading: boolean = true;
  addFlag: boolean = true;
  showTable: boolean = false;
  showDialog: boolean = false;
  submitLabel!: string;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild('filter2') filter2!: ElementRef;
  @ViewChild('dtpermitquota') dtpermitquotas!: Table;
  @ViewChild('dtplotquota') dtplotquota!: Table;
  selectedCategory: any = null;
  categories: any[] = [{ name: 'Division', key: 'D' }, { name: 'Circle', key: 'C' }, { name: 'Section', key: 'S' }, { name: 'Village', key: 'V' }];
  objPlotQuotas: PlotQuotaViewDto[] = [];
  Quotas: GetQuotasViewDto[] = [];
  fromScheduleNo: any;
  toScheduleNo: any;
  error: boolean = false;

  constructor(
    private formbuilder: FormBuilder,
    private commonService: CommonService,
    private appMasterService: AppMasterService,
    private permitService: permitService,
    private messageService: MessageService,
    private alertMessage: AlertMessage,
  ) { }

  farmerHeaders: IHeader[] = [
    { field: 'seasonName', header: 'seasonName', label: 'Season' },
    { field: 'groupBy', header: 'groupBy', label: 'Type' },
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
      // docNo: [],
      // docDate: [],
      seasonId: ['', Validators.required],
      toSchGroupNo: ['', Validators.required],
      fromSchGroupNo: ['', Validators.required],
      fromDate: [FORMAT_DATE(new Date()), [Validators.required]],
      quotaReleased: ['', Validators.required],
      groupBy: ['', Validators.required],
      plotQuotas: this.formbuilder.array([])
    });
    this.Quotas = [];
  }
  plotQuotasForm(quota: any) {
    return this.formbuilder.group({
      plotQuotaId: quota.plotQuotaId || 0,
      seasonQuotaId: quota.seasonQuotaId || 0,
      divisionId: quota.divisionId || null,
      divisionName: quota.divisionName || null,
      circleName: quota.circleName || null,
      sectionName: quota.sectionName || null,
      villageName: quota.villageName || null,
      tons: quota.tons || null,
      circleId: quota.circleId || null,
      sectionId: quota.sectionId || null,
      villageId: quota.villageId || null,
      quotaReleased: this.addFlag ? quota.scheduledTons : quota.quotaReleased || null,
      serverUpdatedStatus: true
    });
  }
  get scheduleControls() {
    return this.fbPermitQuota.get('plotQuotas') as FormArray;
  }
  addSchedule(quota: any) {
    const formArray = this.fbPermitQuota.get('plotQuotas') as FormArray;
    formArray.push(this.plotQuotasForm(quota));
  }
  get FormControals() {
    return this.fbPermitQuota.controls
  }

  getPermitQuota() {
    this.submitLabel = "Add Permit Quota";
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
      console.log('plotQuotas',this.Quotas);
      const formArray = this.fbPermitQuota.get('plotQuotas') as FormArray;
     
      formArray.clear();
      for (const quota of this.Quotas) {
        this.addSchedule(quota);
      }
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
    });
  }
  onRowExpand(source: any) {
    var data = source.data as SeasonQuotaViewDto;
    this.permitService.GetPlotQuotas(data.seasonId, data.seasonQuotaId).subscribe(resp => {
      data.objPlotQuotas = resp as unknown as PlotQuotaViewDto[];
      console.log('expand',data.objPlotQuotas);
      
      if (!this.addFlag) {
        let plotQuotas: any = resp ? resp : [];
        const formArray = this.fbPermitQuota.get('plotQuotas') as FormArray;
        formArray.clear();
        if (plotQuotas.length) {
          plotQuotas.map((quota: any) => {
            this.addSchedule(quota);
          })
        }
      }
    });
  }
  editPermitQuota(permitQuota: SeasonQuotaViewDto) {
    this.addFlag = false;
    this.submitLabel = 'Update Permit Quota';
    let obj = {
      data: { ...permitQuota },
    }
    this.onRowExpand(obj)
    this.fbPermitQuota.patchValue(permitQuota);
    this.fbPermitQuota.patchValue({
      fromDate: new Date(permitQuota.fromDate?.toString() + ''),
    });
    this.showDialog = true;
  }
  savePermitQuota(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.permitService.CreatepermitQuota(this.fbPermitQuota.value);
    else return this.permitService.UpdatePermitQuota(this.fbPermitQuota.value);
  }
  onSubmit() {
    console.log(this.fbPermitQuota.value);
    
    const sum = this.fbPermitQuota.value.plotQuotas.reduce((acc: any, curr: any) => acc + curr.quotaReleased, 0);
    if (sum.toFixed(2) != this.fbPermitQuota.value.quotaReleased.toFixed(2)) {
      this.messageService.add({ severity: 'error', key: 'myToast', summary: 'Error', detail: `Entered Quota (${sum.toFixed(2)}) is not equal to total quota (${this.fbPermitQuota.value.quotaReleased})` });
      return;
    }
    this.savePermitQuota().subscribe(resp => {
      if (resp) {
        this.initCurrentSeason(CURRENT_SEASON());
        this.PermitQuotaform();
        this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMPPQ001" : "SMPPQ002"]);
        this.showDialog = false;
      
      }
    })
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
  clear2(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
  onGlobalFilter2(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }


  checkValue() {
    if (this.fromScheduleNo < this.toScheduleNo) {
      this.error = false;
      return;
    }
    else if (this.toScheduleNo == undefined) {
      this.error = false;
      return;
    }
    else {
      this.error = true;
    }
  }

}