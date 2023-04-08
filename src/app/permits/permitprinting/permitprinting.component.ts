import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { SeasonDto } from "src/app/_models/applicationmaster";
import { IPlotOfferViewDto } from "src/app/_models/monitoring";
import { AppMasterService } from "src/app/_services/appmaster.service";
import { BillMasterService } from "src/app/_services/billmaster.service";
import { CommonService } from "src/app/_services/common.service";
import { LookupService } from "src/app/_services/lookup.service";
import { MonitoringService } from "src/app/_services/monitoring.service";

@Component({
    selector: 'app-permitprinting',
    templateUrl: './permitprinting.component.html',
    styles: [],
  })
  export class PermitPrintingComponent implements OnInit {
    fbPermitPrinting!: FormGroup;
    seasons!: any[];
    
    currentSeason: SeasonDto = {};
    allottedPlots: IPlotOfferViewDto[] = [];
    loading: boolean = true;
    showTable: boolean = true;
    showDialog: boolean = false;
    forapproval: boolean = false;
    @ViewChild('filter') filter!: ElementRef;
    constructor(private formbuilder: FormBuilder,
        private billMasterService: BillMasterService,
        private commonService: CommonService,
        private appMasterService: AppMasterService,
        private monitoringService: MonitoringService,
        private lookupService:LookupService,
       
      ) { }

      getFilterPermitPrinting() {
        this.fbPermitPrinting = this.formbuilder.group({
          seasonId: new FormControl('', [Validators.required]),
          fromScheduleGroupNo: new FormControl('', [Validators.required]),
          toScheduleGroupNo: new FormControl('', [Validators.required]),
          farmerName: new FormControl('', [Validators.required]),
          fromPermitDate: new FormControl('', [Validators.required]),
          toPermitDate: new FormControl('', [Validators.required]),
          fromPermitNo: new FormControl('', [Validators.required]),
          toPermitNo: new FormControl('', [Validators.required]),
          
        });
      }
      get FormControals() {
        return this.fbPermitPrinting.controls
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
      ngOnInit(): void {
       this.getFilterPermitPrinting();
       this.initSeasons();
    
      }

  }