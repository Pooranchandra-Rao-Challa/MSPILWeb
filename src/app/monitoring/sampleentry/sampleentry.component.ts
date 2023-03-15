import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
import { FarmersViewDto, SeasonDto } from 'src/app/_models/applicationmaster';
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


export class SampleDto {
  DocNo?: string;
  DocDate?: Date;
  FieldBrix?: number;
  Pol?: number;
  CreatedAt?: Date;
  CreatedBy?: string;
  UpdatedAt?: Date;
  UpdatedBy?: string;
  SeasonId?: number;
  PlotYieldId?: number;
  PlotNo?: number;
  FarmerCode?: number;
}

@Component({
  selector: 'sampleentry',
  templateUrl: './sampleentry.component.html',
  styles: [],
})
export class SampleEntryComponent implements OnInit {
  fbSampleEntry!: FormGroup;
  currentSeason: SeasonDto = {};
  submitLabel!: string;
  showDialog: boolean = false;
  farmers: FarmersViewDto[] = [];
  isNewFarmer!: [false];


  constructor(private formbuilder: FormBuilder,
    private commonService: CommonService,
    private appMasterservice: AppMasterService,
    private geoMasterService: GeoMasterService,
    private monitoringService: MonitoringService,
    private lookupService: LookupService,
    private activatedRoute: ActivatedRoute,
  ) {
  }

  headers: IHeader[] = [
    { field: 'SeasonId', header: 'SeasonId', label: 'Season' },
    { field: 'FarmerCode', header: 'FarmerCode', label: 'Farmer' },
    { field: 'PlotNo', header: 'PlotNo', label: 'Plot No' },
    { field: 'farmerCode', header: 'farmerCode', label: 'Farmer Code' },
    { field: 'DocNo', header: 'DocNo', label: 'Doc No' },
    { field: 'DocDate', header: 'DocDate', label: 'DocDate' },
    { field: 'FieldBrix', header: 'FieldBrix', label: 'FieldBrix' },
    { field: 'Pol', header: 'Pol', label: 'Pol' },
    { field: 'CreatedAt', header: 'CreatedAt', label: 'Created At' },
    { field: 'CreatedBy', header: 'CreatedBy', label: 'Created By' },
    { field: 'UpdatedBy', header: 'UpdatedBy', label: 'Updated By' },
  ];
  seasons!: any[];
  appConstants: any = {};
  sampleDto: SampleDto[] = [];
  ngOnInit(): void {
    let currentSeason = '2020-21';
    this.fillData();
    this.initSeasons();
    this.sampleEntryForm();
    this.initCurrentSeason(currentSeason);
  }
  initCurrentSeason(seasonCode: string) {
    this.appMasterservice.CurrentSeason(seasonCode).subscribe((resp) => {
      this.currentSeason = resp as SeasonDto;
      this.initSeasons();
    });
  }
  onSearch() {
    this.initAppConstants(this.currentSeason.seasonId!);
  }


  initFarmers() {
    this.appMasterservice.GetFarmers().subscribe((resp) => {
      this.farmers = resp as unknown as FarmersViewDto[];
    })
  }

  initSeasons() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp as any;
    });
  }

  initAppConstants(seasonId: number) {
    this.lookupService.AppConstants().subscribe((resp) => {
      this.appConstants = resp as any;
      this.appConstants.PolFactor
    });
  }

  sampleEntryForm() {
    this.fbSampleEntry = this.formbuilder.group({
      seasonId: [{ value: this.currentSeason.seasonId }, (Validators.required)],
      docNo: [{ value: '' }],
      docDate: ['', (Validators.required)],
      farmerId: [{ value: '', }, (Validators.required)], /* Here farmerId is ryotNo */
      ryotName: [''],
      plotNo: [''],
      fieldBrix: [''],
      Brix: [''],
      pol: [''],
      purity: [''],
      brixFactor: [''],
      polFactor: [''],
      ccs: [''],
      noofSample: [''],
      noofEnteredSamples: [''],
      isActive: [false],

    })
  }

  /**{
      "PolFactor": "0.87",
      "BrixFactor": "0.29",
      "WeighmentPrintCount": "3",
      "SpecialPermitAllowedLimit": "3",
      "PermitLapseHours": "48",
      "NonRegisteredBindingPERC": "0",
      "NonRegisteredBadPERC": "0",
      "SupportsMultiLogin": "true",
      "IsWeighmentApprovalRequired": "1"
  } */
  addSampleEntry() {
    this.submitLabel = 'Add Sample Entry';
    this.fbSampleEntry.controls['seasonId'].enable();
    this.showDialog = true;
    this.fbSampleEntry.controls['isNewFarmer'].setValue(false);
  }

  get FormControls() {
    return this.fbSampleEntry.controls;
  }


  // For Farmer

  onSelectedFarmer(farmerId: number) {
    this.fbSampleEntry.controls['isNewFarmer'].setValue(this.IsNewFarmer(farmerId));
    this.farmers.forEach((value) => {
      if (value.farmerId == farmerId) {
        this.fbSampleEntry.controls['ryotName'].setValue(value.farmerName);
        this.fbSampleEntry.controls['fatherName'].setValue(value.fatherName);
        this.fbSampleEntry.controls['farmerVillage'].setValue(value.villageName);
        this.fbSampleEntry.controls['farmerDivision'].setValue(value.divisionName);
        this.fbSampleEntry.controls['farmerCircle'].setValue(value.circleName);
        this.fbSampleEntry.controls['farmerSection'].setValue(value.sectionName);
      }
    });
  }
  IsNewFarmer(farmerId: number): boolean {
    var returnvalue = false;
    this.monitoringService.IsNewFarmer(farmerId).subscribe(
      (resp) => {
        returnvalue = resp as unknown as boolean;
        return returnvalue;
      }
    )
    return returnvalue;
  }





  fillData() {
    for (var i of [1, 2]) {
      this.sampleDto.push(
        {
          DocNo: 'DocNo' + i,
          DocDate: new Date(),
          FieldBrix: 1,
          Pol: 1,
          CreatedAt: new Date(),
          CreatedBy: 'CreatedBy' + i,
          UpdatedAt: new Date(),
          UpdatedBy: 'UpdatedBy' + i,
          SeasonId: i,
          PlotYieldId: i,
          PlotNo: i,
          FarmerCode: i
        }
      )
    }
  }
}


