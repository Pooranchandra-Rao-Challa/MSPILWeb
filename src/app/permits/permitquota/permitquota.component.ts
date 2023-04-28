import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Table } from 'primeng/table';
import { SeasonDto } from "src/app/_models/applicationmaster";
import { IPlotOfferViewDto } from "src/app/_models/monitoring";
import { PlotQuotaViewDto, SeasonQuotaViewDto } from "src/app/_models/permits";
import { AppMasterService } from "src/app/_services/appmaster.service";
import { BillMasterService } from "src/app/_services/billmaster.service";
import { CommonService } from "src/app/_services/common.service";
import { LookupService } from "src/app/_services/lookup.service";
import { MonitoringService } from "src/app/_services/monitoring.service";
import { CURRENT_SEASON } from "src/environments/environment";
import { permitService } from '../../_services/permit.service';

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
  permitquotas:SeasonQuotaViewDto[]=[]
  currentSeason: SeasonDto = {};
  loading: boolean = true;
  showTable: boolean = false;
  showDialog: boolean = false;
  submitLabel!: string;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild('dtpermitquota') dtpermitquotas!: Table;
  selectedCategory: any = null;
  categories: any[] = [{ name: 'Division', key: 'D' }, { name: 'Circle', key: 'C' }, { name: 'Section', key: 'S' }, { name: 'Village', key: 'V' }];
  permitQuota: PermitQuotaDto[] = [];
  objPlotQuotas:PlotQuotaViewDto[]=[];


  constructor(
    private formbuilder: FormBuilder,
    private commonService: CommonService,
    private appMasterService: AppMasterService,
    private permitService:permitService

  ) { }

  farmerHeaders: IHeader[] = [
    { field:'seasonName', header: 'seasonName', label: 'Season' },
    { field:'type', header: 'type', label: 'Type' },
    { field:'docNo',header:'docNo',label: 'Doc No' },
    { field:'fromSchGroupNo', header:'fromSchGroupNo', label: 'From Schedule Group No' },
    { field:'toSchGroupNo', header: 'toSchGroupNo', label: 'To Schedule Group No' },
    { field:'fromDate', header: 'fromDate', label: 'From Date' },
    { field:'toDate', header: 'toDate', label: 'To Date' },
    { field:'createdAt', header: 'createdAt', label: 'Created Date' },
    { field:'createdBy', header: 'createdBy', label: 'Created By' },
    { field:'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field:'updatedBy', header: 'updatedBy', label: 'Updated By' },

  ];
  plotHeaders: IHeader[] = [
    { field: 'quotaReleased', header:'quotaReleased', label:'Quota Released' },
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
    { field: 'estimatedTon', header: 'estimatedTon', label: 'Estimated Ton' },
    { field: 'Quota', header: 'Quota', label: 'Quota' },
  ];

  PermitQuotaform() {
    this.fbPermitQuota = this.formbuilder.group({
      seasonId: new FormControl('', [Validators.required]),
      fromScheduleGroupNo: new FormControl('', [Validators.required]),
      toScheduleGroupNo: new FormControl('', [Validators.required]),
      fromDate: new FormControl('', [Validators.required]),
      quota: new FormControl('', [Validators.required]),
      type:[]

    });
  }

  get FormControals() {
    return this.fbPermitQuota.controls
  }

  getPermitQuota() {
    this.showDialog = true;
   
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
      console.log('permitquotas',this.permitquotas);
      
    });
  }
  onRowExpand(source: any) {
    var data = source.data as SeasonQuotaViewDto;
    this.permitService.GetPlotQuotas(data.seasonId, data.seasonQuotaId).subscribe(resp => {
      data.objPlotQuotas = resp as unknown as PlotQuotaViewDto[];
      console.log('Plotquotas',data);

    });
  }

  onSubmit() {
    this.PermitQuotaform()
    // this.submitLabel = 'Get Quota';
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

  restrictToRange(event:any) {
    const value = parseInt(event.target.value);
    if (isNaN(value) || value < 1) {
      event.target.value = 1;
    } else if (value > 5) {
      event.target.value = 5;
    }
  }
  
}