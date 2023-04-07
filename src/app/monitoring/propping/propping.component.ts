import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { LookupDetailDto, SeasonDto, SeasonViewDto } from 'src/app/_models/applicationmaster';
import { VillagesViewDto } from 'src/app/_models/geomodels';
import { IPlotOfferViewDto, proppingViewDto } from 'src/app/_models/monitoring';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { MonitoringService } from 'src/app/_services/monitoring.service';
import { CURRENT_SEASON } from 'src/environments/environment';

export interface IHeader {
    field: string;
    header: string;
    label: string;
}

@Component({
    selector: 'propping',
    templateUrl: './propping.component.html',
    styles: [],
})
export class ProppingComponent implements OnInit {
    allottedPlots: IPlotOfferViewDto[] = [];
    currentSeason: SeasonDto = {};
    loading: boolean = true;
    seasons: SeasonViewDto[] = [];
    villages: VillagesViewDto[] = [];
    forapproval: boolean = false;
    @ViewChild('filter') filter!: ElementRef;
    currentSeasonCode?: string;
    fbPropping!:FormGroup;
    proppingstage: LookupDetailDto[] =[];
    propping :proppingViewDto[]=[];
    data:any;
    permissions:any;
    
    constructor(private appMasterService: AppMasterService,
        private jwtService: JWTService,
        private formbuilder: FormBuilder,
        private monitoringService: MonitoringService,
        private lookupService: LookupService,) {
             this.initProppingStage();
         }
    headers: IHeader[] = [
        { field: 'farmerCode', header: 'farmerCode', label: 'Farmer Code' },
        { field: 'farmerName', header: 'farmerName', label: 'Farmer Name' },
        { field: 'plotNumber', header: 'plotNumber', label: 'Plot No' },
        { field: 'divisionName', header: 'divisionName', label: 'Division Name' },
        { field: 'circleName', header: 'circleName', label: 'Circle Name' },
        { field: 'sectionName', header: 'sectionName', label: 'Section Name' },
        { field: 'villageName', header: 'villageName', label: 'Village Name' },
        { field: 'varietyName', header: 'varietyName', label: 'Variety Name' },
        { field: 'plantTypeName', header: 'plantTypeName', label: 'Plant Type' },
        { field: 'plantingDate', header: 'plantingDate', label: 'Planting Date' },
        { field: 'netArea', header: 'netArea', label: 'Net Area' },
        { field: 'proppingDate', header: 'proppingDate', label: 'Propping Date' },
    ];
    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
        this.onSearch();
      }
      onSearch() { 
          this.initProppingStage();
      }
    initSeasons() {
        this.appMasterService.Getseason().subscribe((resp) => {
          this.seasons = resp as unknown as SeasonViewDto[];
        });
      }
    initProppingStage() {
      this.lookupService.ProppingStages().subscribe((resp) => {
          this.proppingstage = resp as unknown as LookupDetailDto[];
          this.proppingstage.forEach(element => {
          this.data =  element.lookupDetailId;     
          });
          var stageId=this.fbPropping.value.ProppingStageId;
          this.initPropping(stageId);
        });
      }   
    initCurrentSeason() {
        this.appMasterService.CurrentSeason(this.currentSeasonCode!).subscribe((resp) => {
            this.currentSeason = resp as SeasonDto;
            // this.initSeasons();
        });
    }
    get FormControls() {
        return this.fbPropping.controls;
      }
    proppingForm() {
        this.fbPropping = this.formbuilder.group({
            seasonId : [{ value: this.currentSeason.seasonId }, (Validators.required)],
            ProppingStageId : [null],
        })
    }
    ngOnInit(): void {
        this.permissions = this.jwtService.Permissions;
        this.currentSeasonCode = CURRENT_SEASON()
        this.initCurrentSeason();
        this.initSeasons();
        this.proppingForm();
        this.initProppingStage();
    }
    initPropping(stageId:number) {
        debugger;
        var seasonId=this.fbPropping.value.seasonId;
        this.monitoringService.GetPropping(seasonId,stageId).subscribe((resp) => {
          this.propping = resp as unknown as proppingViewDto[];
          console.log(this.propping)
        })
    }
}
