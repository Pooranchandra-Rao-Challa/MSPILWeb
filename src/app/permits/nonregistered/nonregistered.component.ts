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
    selector: 'app-nonregistered',
    templateUrl: './nonregistered.component.html',
    styles: [],
  })
  export class NonRegisteredComponent implements OnInit {


    fbNonRegistered!: FormGroup;
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

      getFilterNonRegistered() {
        this.fbNonRegistered = this.formbuilder.group({
          seasonId: new FormControl('', [Validators.required]),
          permitDate: new FormControl('', [Validators.required]),
          noOfPermits: new FormControl('', [Validators.required]),
          isBurnt: [false], 
          ryotNo: new FormControl('', [Validators.required]),
          farmerDivision: new FormControl('', [Validators.required]),
          farmerCircle: new FormControl('', [Validators.required]),
          farmerSection: new FormControl('', [Validators.required]),
          farmerVillage: new FormControl('', [Validators.required]),
          plot: new FormControl('', [Validators.required]),
          plotDivision: new FormControl('', [Validators.required]),
          plotCircle: new FormControl('', [Validators.required]),
          plotSection: new FormControl('', [Validators.required]),
          plotVillage: new FormControl('', [Validators.required]),
          HGL: new FormControl('', [Validators.required]),
          subHGL: new FormControl('', [Validators.required]),
          labourPrice: new FormControl('', [Validators.required]),
          TPT: new FormControl('', [Validators.required]),
          vehicleNo: new FormControl('', [Validators.required]),
          vehicleType: new FormControl('', [Validators.required]),
        });
      }

      get FormControals() {
        return this.fbNonRegistered.controls
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
        this.getFilterNonRegistered();
        this.initSeasons();
    
      }

      


  }