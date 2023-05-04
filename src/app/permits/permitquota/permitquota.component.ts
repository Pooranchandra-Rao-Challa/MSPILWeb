import { HttpEvent } from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Table } from 'primeng/table';
import { Observable } from "rxjs";
import { SeasonDto } from "src/app/_models/applicationmaster";
import { IPlotOfferViewDto } from "src/app/_models/monitoring";
import { GetQuotasViewDto, PlotQuotaViewDto, SeasonQuotaViewDto } from "src/app/_models/permits";
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
export interface PermitQuotaDto {
  SeasonCode?: number;
  DocNo?: number;
  FromScheduleGroupNo?: number;
  ToScheduleGroupNo?: number;
  Type?: string;
  FromDate?: Date;
  Quota?: number;
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
  @ViewChild('dtpermitquota') dtpermitquotas!: Table;
  selectedCategory: any = null;
  categories: any[] = [{ name: 'Division', key: 'D' }, { name: 'Circle', key: 'C' }, { name: 'Section', key: 'S' }, { name: 'Village', key: 'V' }];
  objPlotQuotas: PlotQuotaViewDto[] = [];
  Quotas: GetQuotasViewDto[] = [];
  fromSchGrpNo: any;
  toSchGrpNo: any;
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
      toSchGrpNo: ['', Validators.required],
      fromSchGrpNo: ['', Validators.required],
      fromDate: [''],
      quota: ['', Validators.required],
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
      quotaReleased: 200,
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
      console.log(this.fbPermitQuota.value);
    })
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

  selectedGroupBy(){
    const groupByValue = this.fbPermitQuota.get('groupBy')?.value;
    const quotas = this.Quotas.map(s => ({
      divisionId: groupByValue === 'Division' ? s.divisionId : null,
      circleId: groupByValue === 'Circle' ? s.circleId : null,
      sectionId: groupByValue === 'Section' ? s.sectionId : null,
      villageId: groupByValue === 'Village' ? s.villageId : null,
      quotaReleased: s.scheduledTons,
      serverUpdatedStatus: true
    }));
 
  }


  editPlotAgreement(permitQuota: SeasonQuotaViewDto) {

    this.fbPermitQuota.patchValue({})

    // populate form with existing data
    // this.fbPermitQuota.patchValue({
    //   seasonQuotaId: permitQuota.seasonQuotaId,
    //   docNo: permitQuota.docNo,
    //   docDate: permitQuota.docDate,
    //   seasonId: permitQuota.seasonId,
    //   toSchGrpNo: permitQuota.toSchGroupNo,
    //   fromSchGrpNo: permitQuota.fromSchGroupNo,
    //   fromDate: permitQuota.fromDate,
    //   quota: permitQuota.quotaReleased,
    //   groupBy: permitQuota.groupBy
    // });



    this.addFlag = false;
    this.submitLabel = 'Update permitQuota';
    this.showDialog = true;
  }
  savePermitQuota(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.permitService.CreatepermitQuota(this.fbPermitQuota.value);
    else return this.permitService.UpdatePermitQuota(this.fbPermitQuota.value);
  }
  onSubmit() {

    const groupByValue = this.fbPermitQuota.get('groupBy')?.value;
    if (groupByValue === 'Division') {
      this.fbPermitQuota.get('groupBy')?.setValue('D');
    } else if (groupByValue === 'Section') {
      this.fbPermitQuota.get('groupBy')?.setValue('S');
    } else if (groupByValue === 'Circle') {
      this.fbPermitQuota.get('groupBy')?.setValue('C');
    } else if (groupByValue === 'Village') {
      this.fbPermitQuota.get('groupBy')?.setValue('V');
    
    }
    const quotas = this.Quotas.map(s => ({
      divisionId: s.divisionId,
      circleId: s.circleId, // set circleId to null
      sectionId: s.sectionId, // set sectionId to null
      villageId: s.villageId, // set villageId to null
      quotaReleased: s.scheduledTons,
      serverUpdatedStatus: true
    }));

    const obj = {
      seasonId: this.fbPermitQuota.get('seasonId')?.value,
      fromSchGroupNo: this.fbPermitQuota.get('fromSchGrpNo')?.value,
      toSchGroupNo: this.fbPermitQuota.get('toSchGrpNo')?.value,
      fromDate: this.fbPermitQuota.get('fromDate')?.value,
      toDate: this.fbPermitQuota.get('toDate')?.value,
      quotaReleased: this.fbPermitQuota.get('quota')?.value,
      groupBy: this.fbPermitQuota.get('groupBy')?.value,
      serverUpdatedStatus: true,
      plotQuotas: quotas
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
    if (this.fromSchGrpNo < this.toSchGrpNo) {
      this.error = false;
      return;
    }
    else if (this.toSchGrpNo == undefined) {
      this.error = false;
      return;
    }
    else {
      this.error = true;
    }
  }

  fillData() {
    for (var i of [1, 2]) {
      this.permitQuota.push(
        {
          SeasonCode: i,
          DocNo: 1,
          FromScheduleGroupNo: 1,
          ToScheduleGroupNo: 1,
          Type: 'Village',
          FromDate: new Date(),
          Quota: 4520,
        }
      )
    }
  }


}