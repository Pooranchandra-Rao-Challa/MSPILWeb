import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { AppMasterService } from "src/app/_services/appmaster.service";
import { BillMasterService } from "src/app/_services/billmaster.service";
import { CommonService } from "src/app/_services/common.service";
import { LookupService } from "src/app/_services/lookup.service";
import { MonitoringService } from "src/app/_services/monitoring.service";

@Component({
    selector: 'app-cancelpermit',
    templateUrl: './cancelpermit.component.html',
    styles: [],
  })
  export class CancelPermitComponent implements OnInit {

    constructor(private formbuilder: FormBuilder,
        private billMasterService: BillMasterService,
        private commonService: CommonService,
        private appMasterService: AppMasterService,
        private monitoringService: MonitoringService,
        private lookupService:LookupService,
       
      ) { }

      

      ngOnInit(): void {
   
       
    
      }

  }