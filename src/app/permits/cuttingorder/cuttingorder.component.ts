import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { SeasonDto } from "src/app/_models/applicationmaster";
import { IPlotOfferViewDto } from "src/app/_models/monitoring";
import { AppMasterService } from "src/app/_services/appmaster.service";
import { BillMasterService } from "src/app/_services/billmaster.service";
import { CommonService } from "src/app/_services/common.service";
import { LookupService } from "src/app/_services/lookup.service";
import { MonitoringService } from "src/app/_services/monitoring.service";

export class CuttingOrderDto {
  SeasonCode?: number;
  CuttingOrderNo?: number;
  FromDOP?: number;
  ToDOP?: number;
  FromScheduleGroupNo?: number;
  ToScheduleGroupNo?: number;
  FromCCS?: number;
  ToCCS?: number;
  FromBrix?: number;
  ToBrix?: number;
  FromPol?: number;
  ToPol?: number;
  FromPurity?: number;
  ToPurity?: number;
  NetArea?: number;
  EstimatedTon?: number;

}
export class PermitQuotaFromDto {
  Division?: string;
  Circle?: string;
  Section?: string;
  Village?: string;
  EstimatedTon?: number;
  Quota?: number;

}
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
    selector: 'app-cuttingorder',
    templateUrl: './cuttingorder.component.html',
    styles: [],
  })
  export class CuttingOrderComponent implements OnInit {
    seasons!: any[];
    fbCuttingOrder!: FormGroup;
    currentSeason: SeasonDto = {};
    allottedPlots: IPlotOfferViewDto[] = [];
    loading: boolean = true;
    showTable: boolean = true;
    showDialog: boolean = false;
    forapproval: boolean = false;
    @ViewChild('filter') filter!: ElementRef;
    submitLabel!: string;
    cuttingOrderDto: CuttingOrderDto[] = [];
    permitQuotaFromDto: PermitQuotaFromDto[] = [];


    constructor(private formbuilder: FormBuilder,
        private billMasterService: BillMasterService,
        private commonService: CommonService,
        private appMasterService: AppMasterService,
        private monitoringService: MonitoringService,
        private lookupService:LookupService,
       
      ) { }
     
      headers: IHeader[] = [
        { field: 'SeasonCode', header: 'SeasonCode', label: 'Season Code' },
        { field: 'CuttingOrderNo', header: 'CuttingOrderNo', label: 'Cutting Order No' },
        { field: 'FromDOP', header: 'FromDOP', label: 'From DOP' },
        { field: 'ToDOP', header: 'ToDOP', label: 'To DOP' },
        { field: 'FromScheduleGroupNo', header: 'FromScheduleGroupNo', label: 'From SchGroup No' },
        { field: 'ToScheduleGroupNo', header: 'ToScheduleGroupNo', label: 'To SchGroup No' },
        { field: 'FromCCS', header: 'FromCCS', label: 'From CCS' },
        { field: 'ToCCS', header: 'ToCCS', label: 'To CCS' },
        { field: 'FromBrix', header: 'FromBrix', label: 'From Brix' },
        { field: 'ToBrix', header: 'ToBrix', label: 'To Brix' },
        { field: 'FromPol', header: 'FromPol', label: 'From Pol' },
        { field: 'ToPol', header: 'ToPol', label: 'To Pol' },
        { field: 'FromPurity', header: 'FromPurity', label: 'From Purity' },
        { field: 'ToPurity', header: 'ToPurity', label: 'To Purity' },
        { field: 'NetArea', header: 'NetArea', label: 'Net Area' },
        { field: 'EstimatedTon', header: 'EstimatedTon', label: 'Estimated Ton' },
    
      ];

      // header: IFromHeader[] = [
      //   { field: 'Division', header: 'Division', label: 'Division' },
      //   { field: 'Circle', header: 'Circle', label: 'Circle' },
      //   { field: 'Section', header: 'Section', label: 'Section' },
      //   { field: 'Village', header: 'Village', label: 'Village' },
      //   { field: 'EstimatedTon', header: 'EstimatedTon', label: 'Estimated Ton' },
      //   { field: 'Quota', header: 'Quota', label: 'Quota' },
    
      // ];

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
     


      getFilterPermitQuota() {
        this.fbCuttingOrder = this.formbuilder.group({
          seasonId: new FormControl('', [Validators.required]),
          cuttingOrderDate: new FormControl('', [Validators.required]),
          fromScheduleGroupNo: new FormControl('', [Validators.required]),
          toScheduleGroupNo: new FormControl('', [Validators.required]),
          fromCCS: new FormControl('', [Validators.required]),
          toCCS: new FormControl('', [Validators.required]),
          fromBrix: new FormControl('', [Validators.required]),
          toBrix: new FormControl('', [Validators.required]),
          fromPol: new FormControl('', [Validators.required]),
          toPol: new FormControl('', [Validators.required]),
          fromPurity: new FormControl('', [Validators.required]),
          toPurity: new FormControl('', [Validators.required]),
          fromDOP: new FormControl('', [Validators.required]),
          toDOP: new FormControl('', [Validators.required]),
          ryotNo: new FormControl('', [Validators.required]),
          plot: new FormControl('', [Validators.required]),
          division: new FormControl('', [Validators.required]),
          circle: new FormControl('', [Validators.required]),
          section: new FormControl('', [Validators.required]),
          village: new FormControl('', [Validators.required]),
          plantType: new FormControl('', [Validators.required]),
          variety: new FormControl('', [Validators.required]),
          
        });
      }
      get FormControals() {
        return this.fbCuttingOrder.controls
      }
      ngOnInit(): void {
        this.getFilterPermitQuota();
        this.initSeasons();
        this.fillData();
    // this.fillFromData();
      }

      onSubmit() {
        this.submitLabel = 'Get Order';
      }

      getCuttingOrder(){
        this.showDialog = true;
      }
      fillData() {
        for (var i of [1, 2]) {
          this.cuttingOrderDto.push(
            {
              SeasonCode: i,
              CuttingOrderNo: 1,
              FromDOP: 2,
              ToDOP: 1,
              FromScheduleGroupNo: 1,
              ToScheduleGroupNo: 1,
              FromCCS: 1,
              ToCCS: 1,
              FromPol: 1,
              ToPol: 1,
              FromPurity: 1,
              ToPurity: 1, 
              NetArea: 1,
              EstimatedTon: 1,

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