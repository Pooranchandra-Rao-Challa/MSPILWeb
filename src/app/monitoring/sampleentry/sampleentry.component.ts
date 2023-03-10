import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Table } from 'primeng/table';
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

export class SampleDto{
  DocNo? : string;
  DocDate?: Date;
  FieldBrix?: number;
  Pol?:number;
  CreatedAt?:Date;
  CreatedBy?:string;
  UpdatedAt?:Date;
  UpdatedBy?:string;
  SeasonId?:number;
  PlotYieldId?:number;
  PlotNo?:number;
  FarmerCode?:number;
}

@Component({
  selector: 'sampleentry',
  templateUrl: './sampleentry.component.html',
  styles: [],
})
export class SampleEntryComponent implements OnInit {

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
    this.fillData();
  }

  initSeasons() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp as any;
    });
  }

  initAppConstants() {
    this.lookupService.AppConstants().subscribe((resp) => {
      this.appConstants = resp as any;
      this.appConstants.PolFactor
    });
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
  fillData(){
    for(var i of [1,2]){
      this.sampleDto.push(
        {
          DocNo:'DocNo'+i,
          DocDate: new Date(),
          FieldBrix: 1,
          Pol:1,
          CreatedAt: new Date(),
          CreatedBy: 'CreatedBy'+i,
          UpdatedAt: new Date(),
          UpdatedBy: 'UpdatedBy'+i,
          SeasonId: i,
          PlotYieldId: i,
          PlotNo : i,
          FarmerCode: i
        }
      )
    }
  }
}


