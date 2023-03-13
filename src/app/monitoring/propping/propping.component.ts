import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { SeasonDto } from 'src/app/_models/applicationmaster';
import { VillagesViewDto } from 'src/app/_models/geomodels';
import { IAllottedPlotViewDto } from 'src/app/_models/monitoring';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { MonitoringService } from 'src/app/_services/monitoring.service';

export interface IHeader {
    field: string;
    header: string;
    label: string;
}


export class ProppingDto {
    FarmerCode?: number;
    FarmerName?: string;
    PlotNo?: number;
    DivisionName?: string;
    CircleName?: string;
    SectionName?: string;
    VillageName?: string;
    VarityName?: string;
    PlantType?: string;
    PlantingType?: string;
    Area?: string;
    ProppingDate?: Date;
}

@Component({
    selector: 'propping',
    templateUrl: './propping.component.html',
    styles: [],
})
export class ProppingComponent implements OnInit {

    canVillageId = new FormControl('', [Validators.required]);
    canseasonId = new FormControl('', [Validators.required]);
    ProppingStageId = new FormControl('', [Validators.required]);
    fromPlantingDate = new FormControl('', [Validators.required]);
    toPlantingDate = new FormControl('', [Validators.required]);



    allottedPlots: IAllottedPlotViewDto[] = [];
    currentSeason: SeasonDto = {};
    loading: boolean = true;
    seasons!: any[];
    villages: VillagesViewDto[] = [];
    forapproval: boolean = false;
    @ViewChild('filter') filter!: ElementRef;
    constructor(private commonService: CommonService,
        private appMasterservice: AppMasterService,
        private geoMasterService: GeoMasterService,
        private monitoringService: MonitoringService,
        private lookupService: LookupService,
        private activatedRoute: ActivatedRoute) {

    }
    proppingDto: ProppingDto[] = [];

    headers: IHeader[] = [
        { field: 'FarmerCode', header: 'FarmerCode', label: 'Farmer Code' },
        { field: 'FarmerName', header: 'FarmerName', label: 'Farmer Name' },
        { field: 'PlotNo', header: 'PlotNo', label: 'Plot No' },
        { field: 'DivisionName', header: 'DivisionName', label: 'Division Name' },
        { field: 'CircleName', header: 'CircleName', label: 'Circle Name' },
        { field: 'SectionName', header: 'SectionName', label: 'Section Name' },
        { field: 'VillageName', header: 'VillageName', label: 'Village Name' },
        { field: 'VarityName', header: 'VarityName', label: 'Varity Name' },
        { field: 'PlantType', header: 'PlantType', label: 'Plant Type' },
        { field: 'PlantingType', header: 'PlantingType', label: 'Planting Type' },
        { field: 'Area', header: 'Area', label: 'Area' },
        { field: 'ProppingDate', header: 'ProppingDate', label: 'Propping Date' },
    ];



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

    }



    fillData() {
        for (var i of [1, 2]) {
            this.proppingDto.push(
                {
                    FarmerCode: i,
                    FarmerName: 'Farmer',
                    PlotNo: 1,
                    DivisionName: 'Divi',
                    CircleName: 'Circle',
                    SectionName: 'Section',
                    VillageName: 'Village',
                    VarityName: 'Varity',
                    PlantType: 'planttype',
                    PlantingType: 'Plant',
                    Area: 'area',
                    ProppingDate: new Date()
                }
            )
        }


    }


}