import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { LookupDetailDto, SeasonDto } from 'src/app/_models/applicationmaster';
import { VillagesViewDto } from 'src/app/_models/geomodels';
import { IAllottedPlotViewDto } from 'src/app/_models/monitoring';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { BillMasterService } from 'src/app/_services/billmaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { MonitoringService } from 'src/app/_services/monitoring.service';

export interface IHeader {
    field: string;
    header: string;
    label: string;
}


export class SeedDto {
    SeedId? : number;
    SeasonId?: number;
    FarmerCode?: number;
    PlotNo?: number;
    DocNo?: string;
    DocDate?: Date;
    SeedSupplyType?: string;
    TypeOfSeed?: string;
    IsActive?: boolean;
    CreatedAt?: Date;
    CreatedBy?: string;
    UpdatedAt?: Date;
    UpdatedBy?: string;
    subSeeds?: SubSeedDto[]
}
export class SubSeedDto {
    subSeedId?: number;
    SeedId?: number
    FarmerCode?: number;
    FarmerName?: string;
    UOM?: string;
    Qty?: number;
    Rate?: number;
    Amount?: number;
    
    
  }


@Component({
    selector: 'seed',
    templateUrl: './seed.component.html',
    styles: [],
})
export class SeedComponent implements OnInit {

    showDialog: boolean = false;
    showSubSeed: boolean = false;
    addFlag: boolean = true;
    getSeedFrom!: FormGroup;
    subSeeds: SubSeedDto[] = [];

    uom: LookupDetailDto[] = [];

    allottedPlots: IAllottedPlotViewDto[] = [];
    currentSeason: SeasonDto = {};
    loading: boolean = true;
    seasons!: any[];
    villages: VillagesViewDto[] = [];
    forapproval: boolean = false;
    @ViewChild('filter') filter!: ElementRef;
    submitLabel!: string;
    constructor(private commonService: CommonService,
        private appMasterservice: AppMasterService,
        private billMasterService: BillMasterService,
        private monitoringService: MonitoringService,
        private geoMasterService: GeoMasterService,
        private formbuilder: FormBuilder,
        private lookupService: LookupService,
        private activatedRoute: ActivatedRoute) {

    }
    seedDto: SeedDto[] = [];

    headers: IHeader[] = [
        
        // { field: 'SeasonId', header: 'SeasonId', label: 'Season' },
        { field: 'SeasonId', header: 'SeasonId', label: 'Season' },
        { field: 'FarmerCode', header: 'FarmerCode', label: 'Farmer' },
        { field: 'PlotNo', header: 'PlotNo', label: 'Plot No' },
        { field: 'DocNo', header: 'DocNo', label: 'Doc No' },
        { field: 'DocDate', header: 'DocDate', label: 'DocDate' },
        { field: 'SeedSupplyType', header: 'SeedSupplyType', label: 'Seed Supply Type' },
        { field: 'TypeOfSeed', header: 'TypeOfSeed', label: 'Type Of Seed' },
        { field: 'IsActive', header: 'IsActive', label: 'Is Active' },
        { field: 'CreatedAt', header: 'CreatedAt', label: 'Created At' },
        { field: 'CreatedBy', header: 'CreatedBy', label: 'Created By' },
        { field: 'UpdatedAt', header: 'UpdatedAt', label: 'Updated At' },
        { field: 'UpdatedBy', header: 'UpdatedBy', label: 'Updated By' },
    ];

    seedform() {
        this.getSeedFrom = this.formbuilder.group({
            SeedId: [0],
          SeasonId: new FormControl('', [Validators.required]),
          FarmerCode: new FormControl('', [Validators.required]),
          PlotNo: new FormControl('', [Validators.required]),
          
          DocNo: new FormControl('', [Validators.required]),
          DocDate: ['', Validators.required],
          SeedSupplyType: ['', Validators.required],
          TypeOfSeed: ['', Validators.required],
          isActive: [false],
          subSeeds: this.formbuilder.array([]),
        });
      }

  /* Form Array For seed Details */
  SubSeedfrom(): FormArray {
    return this.getSeedFrom.get('subSeeds') as FormArray;
  }
  initUom() {
    this.lookupService.UOMs().subscribe((resp) => {
      this.uom = resp as unknown as LookupDetailDto[];
      console.log(this.uom);
    });
  }
  generateRow(subSeeds: SubSeedDto = new SubSeedDto()): FormGroup {
    if (!this.addFlag) subSeeds.SeedId = this.seedDto[0].SeedId
    return this.formbuilder.group({
      subSeedId: subSeeds.subSeedId == undefined ? 0 : subSeeds.subSeedId,
      SeedId: subSeeds.SeedId,
      FarmerCode: new FormControl(subSeeds.FarmerCode),
      FarmerName: new FormControl(subSeeds.FarmerName),
      UOM: new FormControl(subSeeds.UOM),
      Qty: [subSeeds.Qty, Validators.required],
      Rate: [subSeeds.Rate, Validators.required],
      Amount: subSeeds.Amount,
    });
    
  }
  addSubSeed() {
    this.showSubSeed = true;
    this.SubSeedfrom().push(this.generateRow());
  }
    initSeasons() {
        this.commonService.GetSeasons().subscribe((resp) => {
            this.seasons = resp as any;
        });
    }
    initAllottedPlots(seasonId: number) {
        let param1 = this.filter.nativeElement.value == "" ? null : this.filter.nativeElement.value;
        this.monitoringService.GetAllottedPlots(seasonId, this.forapproval, param1).subscribe((resp) => {
            this.allottedPlots = resp as unknown as IAllottedPlotViewDto[];
            this.loading = false;
        });
    }
    initCurrentSeason(seasonCode: string) {
        this.appMasterservice.CurrentSeason(seasonCode).subscribe((resp) => {
            this.currentSeason = resp as SeasonDto;
            this.initSeasons();
            this.initAllottedPlots(this.currentSeason.seasonId!);
        });
    }

    getCompletedPlotBySeason(seasonId: number) {
        var seasonId = seasonId ? seasonId : 0;
        this.billMasterService
          .GetVillageParamRatesBySeasonId(seasonId)
          .subscribe((resp) => {
            this.loading = false;
          });
      }

    initVillages() {
        this.geoMasterService.GetVillage().subscribe((resp) => {
            this.villages = resp as unknown as VillagesViewDto[];
        });
    }

    ngOnInit(): void {
        let currentSeason = '2020-21';
        this.fillData();
        this.initCurrentSeason(currentSeason);
        this.initSeasons();
        this.initVillages();
this.seedform();
this.initUom();
    }
    addSeed() {
        this.submitLabel = 'Add Seed';
        this.addFlag = true;
        this.showDialog = true;
      }

    onSubmit() {
        console.log(this.getSeedFrom.value)
      }

    fillData() {
        for (var i of [1, 2]) {
            this.seedDto.push(
                {

                    SeasonId: i,
                    FarmerCode: i,
                    PlotNo: 1,
                    DocNo: 'DocNo' + i,
                    DocDate: new Date(),
                    SeedSupplyType: 'seed type',
                    TypeOfSeed: 'Type',
                    IsActive: true,
                    CreatedAt: new Date(),
                    CreatedBy: 'CreatedBy' + i,
                    UpdatedAt: new Date(),
                    UpdatedBy: 'UpdatedBy' + i,
                }
            )
        }
    }


}