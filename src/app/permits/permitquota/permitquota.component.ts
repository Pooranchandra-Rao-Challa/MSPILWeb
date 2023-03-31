import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { SeasonDto } from "src/app/_models/applicationmaster";
import { IPlotOfferViewDto } from "src/app/_models/monitoring";
import { AppMasterService } from "src/app/_services/appmaster.service";
import { BillMasterService } from "src/app/_services/billmaster.service";
import { CommonService } from "src/app/_services/common.service";
import { LookupService } from "src/app/_services/lookup.service";
import { MonitoringService } from "src/app/_services/monitoring.service";

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
export class PermitQuotaDto {
  SeasonCode?: number;
  DocNo?: number;
  FromScheduleGroupNo?: number;
  ToScheduleGroupNo?: number;
  Type?: string;
  FromDate?: Date;
  Quota?: number;

}

export class PermitQuotaFromDto {
  Division?: string;
  Circle?: string;
  Section?: string;
  Village?: string;
  EstimatedTon?: number;
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
  currentSeason: SeasonDto = {};
  allottedPlots: IPlotOfferViewDto[] = [];
  loading: boolean = true;
  showTable: boolean = true;
  showDialog: boolean = false;
  forapproval: boolean = false;

  submitLabel!: string;

  selectedCategory: any = null;
  categories: any[] = [{ name: 'Division', key: 'D' }, { name: 'Circle', key: 'C' }, { name: 'Section', key: 'S' }, { name: 'Village', key: 'V' }];

  permitQuotaDto: PermitQuotaDto[] = [];
  permitQuotaFromDto: PermitQuotaFromDto[] = [];

  @ViewChild('filter') filter!: ElementRef;

  constructor(private formbuilder: FormBuilder,
    private billMasterService: BillMasterService,
    private commonService: CommonService,
    private appMasterService: AppMasterService,
    private monitoringService: MonitoringService,
    private lookupService: LookupService,

  ) { }

  headers: IHeader[] = [
    { field: 'SeasonCode', header: 'SeasonCode', label: 'Season Code' },
    { field: 'DocNo', header: 'DocNo', label: 'Doc No' },
    { field: 'FromScheduleGroupNo', header: 'FromScheduleGroupNo', label: 'From SchGroup No' },
    { field: 'ToScheduleGroupNo', header: 'ToScheduleGroupNo', label: 'To SchGroup No' },
    { field: 'Type', header: 'Type', label: 'Type' },
    { field: 'FromDate', header: 'FromDate', label: 'From Date' },
    { field: 'Quota', header: 'Quota', label: 'Quota' },

  ];
  
  header: IFromHeader[] = [
    { field: 'Division', header: 'Division', label: 'Division' },
    { field: 'Circle', header: 'Circle', label: 'Circle' },
    { field: 'Section', header: 'Section', label: 'Section' },
    { field: 'Village', header: 'Village', label: 'Village' },
    { field: 'EstimatedTon', header: 'EstimatedTon', label: 'Estimated Ton' },
    { field: 'Quota', header: 'Quota', label: 'Quota' },

  ];

  getFilterPermitQuota() {
    this.fbPermitQuota = this.formbuilder.group({
      seasonId: new FormControl('', [Validators.required]),
      fromScheduleGroupNo: new FormControl('', [Validators.required]),
      toScheduleGroupNo: new FormControl('', [Validators.required]),
      fromDate: new FormControl('', [Validators.required]),
      quota: new FormControl('', [Validators.required]),
      test: new FormControl('', [Validators.required]),

    });
  }

  get FormControals() {
    return this.fbPermitQuota.controls
  }

  getPermitQuota() {
    this.showDialog = true;
  }

  ngOnInit(): void {
    this.fillData();
    this.fillFromData();
    this.selectedCategory = this.categories[1];
    this.initSeasons();
    this.getFilterPermitQuota();
  }
  initSeasons() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp as any;
    });
  }
  initAllottedPlots(seasonId: number) {
    let param1 = this.filter.nativeElement.value == "" ? null : this.filter.nativeElement.value;
    this.monitoringService.GetPlotOffers(seasonId, this.forapproval, param1).subscribe((resp) => {
      this.allottedPlots = resp as unknown as IPlotOfferViewDto[];
      this.loading = false;
    });
  }
  initCurrentSeason(seasonCode: string) {
    this.appMasterService.CurrentSeason(seasonCode).subscribe((resp) => {
      this.currentSeason = resp as SeasonDto;
      this.initSeasons();
      this.initAllottedPlots(this.currentSeason.seasonId!);
    });
  }
  onSubmit() {
    this.submitLabel = 'Get Quota';
  }

  fillData() {
    for (var i of [1, 2]) {
      this.permitQuotaDto.push(
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
  

  fillFromData() {
    for (var i of [1, 2]) {
      this.permitQuotaFromDto.push(
        {
          Division: 'Division',
          Circle: '',
          Section: '',  
          Village: '',
          EstimatedTon: 4525,
          Quota: 4520,

        }
      )
    }
  }
}