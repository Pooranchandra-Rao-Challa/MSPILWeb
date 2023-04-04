import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
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
export class PermitApprovalDto {
  FarmerCode?: string;
  FarmerName?: string;
  PermitNo?: number;
  PlotNo?: string;
  TPTName?: string;
  VahicleType?: string;
  HGLName?: string;
  IsBurnt?: string;
  FatherName?: string;
  PlotDivision?: string;
  PlotCircle?: string;
  PlotSection?: string;
  PlotVillage?: string;

}


   

@Component({
    selector: 'app-permitapproval',
    templateUrl: './permitapproval.component.html',
    styles: [],
  })
  export class PermitApprovalComponent implements OnInit {
    seasons!: any[];
    fbScheduleGrouping!: FormGroup;
    currentSeason: SeasonDto = {};
    allottedPlots: IPlotOfferViewDto[] = [];
    loading: boolean = true;
    showTable: boolean = true;
    showDialog: boolean = false;
    forapproval: boolean = false;
    @ViewChild('filter') filter!: ElementRef;
    permitApprovalDto: PermitApprovalDto[] = [];
    constructor(private formbuilder: FormBuilder,
        private billMasterService: BillMasterService,
        private commonService: CommonService,
        private appMasterService: AppMasterService,
        private monitoringService: MonitoringService,
        private lookupService:LookupService,
       
      ) { }

      headers: IHeader[] = [
        { field: 'FarmerCode', header: 'FarmerCode', label: 'FarmerCode' },
        { field: 'FarmerName', header: 'FarmerName', label: 'FarmerName' },
        { field: 'PermitNo', header: 'PermitNo', label: 'Permit No' },
        { field: 'PlotNo', header: 'PlotNo', label: 'Plot No' },
        { field: 'TPTName', header: 'TPTName', label: 'TPT Name' },
        { field: 'VahicleType', header: 'VahicleType', label: 'Vahicle Type' },
        { field: 'HGLName', header: 'HGLName', label: 'HGL Name' },
        { field: 'IsBurnt', header: 'IsBurnt', label: 'IsBurnt' },
        { field: 'FatherName', header: 'FatherName', label: 'Father Name' },
        { field: 'PlotDivision', header: 'PlotDivision', label: 'Plot Division' },
        { field: 'PlotCircle', header: 'PlotCircle', label: 'Plot Circle' }, 
        { field: 'PlotSection', header: 'PlotSection', label: 'Plot Section' },
        { field: 'PlotVillage', header: 'PlotVillage', label: 'Plot Village' },
        
      ];

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
        this.initSeasons();
        this.fillData();
      }

  

      fillData() {
        for (var i of [1, 2]) {
          this.permitApprovalDto.push(
            {
              FarmerCode: "Code",
              FarmerName: "name",
              PermitNo : 52,
              PlotNo: '',
              TPTName: '',
              VahicleType: '',
              HGLName: '',
              IsBurnt: '',
              FatherName: '', 
              PlotDivision: 'Division',
              PlotCircle: '',
              PlotSection: '',  
              PlotVillage: '',
              
            
            }
          )
        }
      }

  }