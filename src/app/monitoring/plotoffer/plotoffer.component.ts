import { SeasonDto } from '../../_models/applicationmaster';
import { LookupService } from 'src/app/_services/lookup.service';
import { MonitoringService } from 'src/app/_services/monitoring.service';
import { AppMasterService } from '../../_services/appmaster.service';
import { GeoMasterService } from '../../_services/geomaster.service';
import { CommonService } from '../../_services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { PlotOfferDto, IPlotOfferViewDto, IFarmerInPlotOfferDto, IFarmerPlotOffersViewDto } from 'src/app/_models/monitoring';
import { FarmersViewDto, plantTypeViewDto, VarietyViewDto } from 'src/app/_models/applicationmaster';
import { VillagesViewDto } from 'src/app/_models/geomodels';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { FORMAT_DATE } from 'src/app/_helpers/date.format.pipe';
import { ActivatedRoute } from '@angular/router';
import { CURRENT_SEASON } from 'src/environments/environment';

export interface IHeader {
  field: string;
  header: string;
  label: string;
}

@Component({
  selector: 'app-plotoffer',
  templateUrl: './plotoffer.component.html',
  styles: [
  ]
})

export class PlotofferComponent implements OnInit {
  plotOffers: IFarmerInPlotOfferDto[] = [];
  plotOffer: PlotOfferDto = new PlotOfferDto();
  globalFilterFields: string[] = ["seasonName", "offerNo", "offerDate", "farmerId", "farmerVillageName", "farmerName", "plotVillageName", "plantType",
    "expectedArea", "expectedVarietyId", "expectedPlantingDate"];
  @ViewChild('filter') filter!: ElementRef;
  showDialog: boolean = false;
  showApprovalDialog: boolean = false;
  addFlag: boolean = true;
  submitLabel!: string;
  fbPlotOffer!: FormGroup;
  seasons!: any[];
  currentSeason: SeasonDto = {};
  farmers: FarmersViewDto[] = [];
  villages: VillagesViewDto[] = [];
  plantTypes: plantTypeViewDto[] = [];
  varieties: VarietyViewDto[] = [];
  resonForNotPlanting: any;
  forapproval: boolean = false;
  isApproved: boolean = false; // for ture value use this icon class' pi-thumbs-up-fill' else ' pi-thumbs-up'
  // varietyTypes: any;
  farmerHeaders: IHeader[] = [
    { field: 'seasonName', header: 'seasonName', label: 'Season' },
    // { field: 'offerNo', header: 'offerNo', label: 'Offer No' },
    // { field: 'offerDate', header: 'offerDate', label: 'Offer Date' },
    { field: 'farmerCode', header: 'farmerCode', label: 'Farmer Code' },
    { field: 'farmerName', header: 'farmerName', label: 'Farmer Name' },
    { field: 'farmerVillageName', header: 'farmerVillageName', label: 'Farmer Village' },
    // { field: 'plotVillageName', header: 'plotVillageName', label: 'Plot Village' },
    // { field: 'plantType', header: 'plantType', label: 'Plant Type' },
    // { field: 'expectedArea', header: 'expectedArea', label: 'Area' },
    // { field: 'varietyId', header: 'varietyId', label: 'Variety' },
    // { field: 'plantingDate', header: 'plantingDate', label: 'Planting Date' },
  ];

  plotHeaders: IHeader[] = [
    // { field: 'seasonName', header: 'seasonName', label: 'Season' },
    { field: 'offerNo', header: 'offerNo', label: 'Offer No' },
    { field: 'offerDate', header: 'offerDate', label: 'Offer Date' },
    // { field: 'farmerCode', header: 'farmerCode', label: 'Farmer Code' },
    // { field: 'farmerName', header: 'farmerName', label: 'Farmer Name' },
    // { field: 'farmerVillageName', header: 'farmerVillageName', label: 'Farmer Village' },
    { field: 'plotVillageName', header: 'plotVillageName', label: 'Plot Village' },
    { field: 'plantType', header: 'plantType', label: 'Plant Type' },
    { field: 'expectedArea', header: 'expectedArea', label: 'Area' },
    { field: 'expectedVariety', header: 'expectedVariety', label: 'Variety' },
    { field: 'expectedPlantingDate', header: 'expectedPlantingDate', label: 'Planting Date' },
  ];

  constructor(private formbuilder: FormBuilder,
    private commonService: CommonService,
    private appMasterservice: AppMasterService,
    private geoMasterService: GeoMasterService,
    private monitoringService: MonitoringService,
    private lookupService: LookupService,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.forapproval = this.activatedRoute.snapshot.params['paramUrl'] == ':forapproval';
    this.initSeasons();
    this.initCurrentSeason(CURRENT_SEASON());
    this.initFarmers();
    this.initVillages();
    this.initPlantType();
    this.initVarieties();
    this.initReasonForNotPlanting();
    this.plotOfferForm();
  }

  // get CurrentSeasonCode() : string {
  //   let fullYear = new Date().getFullYear();
  //   let shortYear = parseInt(fullYear.toString().substring(2, 4));
  //   let month = new Date().getMonth();
  //   if (month >= 10) {
  //     return `${fullYear}-${shortYear+1}`;
  //   }
  //   else {
  //     return `${fullYear-1}-${shortYear}`;
  //   }
  // }

  initPlotOffers(seasonId: number) {
    let param1 = this.filter.nativeElement.value == "" ? null : this.filter.nativeElement.value;
    this.monitoringService.GetPlotOffers(seasonId, this.forapproval, param1).subscribe((resp) => {
      this.plotOffers = resp as unknown as IFarmerInPlotOfferDto[];
      this.plotOffers.forEach((value) => {
        value.ObjOfferedPlots = JSON.parse(value.offeredPlots) as IFarmerPlotOffersViewDto[];
      });
    });
  }

  onSearch() {
    this.initPlotOffers(this.currentSeason.seasonId!);
  }

  initFarmers() {
    this.appMasterservice.GetFarmers().subscribe((resp) => {
      this.farmers = resp as unknown as FarmersViewDto[];
    })
  }

  initVillages() {
    this.geoMasterService.GetVillage().subscribe((resp) => {
      this.villages = resp as unknown as VillagesViewDto[];
    });
  }

  initSeasons() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp as any;
    });
  }

  initCurrentSeason(seasonCode: string) {
    this.appMasterservice.CurrentSeason(seasonCode).subscribe((resp) => {
      this.currentSeason = resp as SeasonDto;
      this.initSeasons();
      this.initPlotOffers(this.currentSeason.seasonId!);
    });
  }

  initPlantType() {
    this.appMasterservice.GetPlantType().subscribe((resp) => {
      this.plantTypes = resp as unknown as plantTypeViewDto[];
    });
  }

  initVarieties() {
    this.appMasterservice.GetVarieties().subscribe((resp) => {
      this.varieties = resp as unknown as VarietyViewDto[];
    });
  }

  initReasonForNotPlanting() {
    this.lookupService.NotPlaningResons().subscribe((resp) => {
      this.resonForNotPlanting = resp;
    });
  }

  plantFrom!: Date;
  plantTo!: Date;

  getNewOfferNo(seasonId: number) {
    this.seasons?.forEach((value) => {
      if (value.seasonId == seasonId) {
        this.plantFrom = value.plantFrom && new Date(value.plantFrom?.toString() + "");
        this.plantTo = value.plantTo && new Date(value.plantTo?.toString() + "");
      }
    });
    if (this.plotOffer.plotOfferId == null)
      this.monitoringService.GetNewOfferNo(seasonId).subscribe((resp) => {
        if (resp) this.fbPlotOffer.controls['offerNo'].setValue(resp);
      });
  }

  get IsAdd(): boolean { return this.plotOffer?.plotOfferId == null; }

  plotOfferForm() {
    this.fbPlotOffer = this.formbuilder.group({
      plotOfferId: [null],
      seasonId: [{ value: this.currentSeason.seasonId }, (Validators.required)],
      offerNo: [{ value: '', disabled: true }],
      offerDate: ['', (Validators.required)],
      isNewFarmer: [{ value: false, disabled: true }],
      farmerId: [{ value: '', disabled: !this.IsAdd }, (Validators.required)], /* Here farmerId is ryotNo */
      ryotName: [{ value: '', disabled: true }],
      fatherName: [{ value: '', disabled: true }],
      farmerVillage: [{ value: '', disabled: true }],
      farmerDivision: [{ value: '', disabled: true }],
      farmerCircle: [{ value: '', disabled: true }],
      farmerSection: [{ value: '', disabled: true }],
      plotVillageId: [{ value: '', disabled: !this.IsAdd }, (Validators.required)], /* Here villageId is plotVillageId */
      plotDivision: [{ value: '', disabled: true }],
      plotCircle: [{ value: '', disabled: true }],
      plotSection: [{ value: '', disabled: true }],
      expectedArea: [null, (Validators.required)],
      plantTypeId: ['', (Validators.required)],
      expectedPlantingDate: ['', (Validators.required)],
      expectedVarietyId: ['', (Validators.required)],
      reasonForNotPlantingId: ['', (Validators.required)],
      remarks: [''],
    });
  }

  get FormControls() {
    return this.fbPlotOffer.controls;
  }

  addPlotOffer() {
    this.plotOffer = new PlotOfferDto();
    this.submitLabel = 'Add Allotted Plot';
    // this.fbPlotOffer.controls['offerNo'].disable();
    this.fbPlotOffer.controls['seasonId'].enable();
    // this.fbPlotOffer.controls['plotVillageId'].enable();
    // this.fbPlotOffer.controls['farmerId'].enable();
    this.fbPlotOffer.controls['isNewFarmer'].setValue(false);
    this.fbPlotOffer.controls['seasonId'].setValue(this.currentSeason.seasonId);
    this.getNewOfferNo(this.currentSeason.seasonId || 0);
    this.addFlag = true;
    this.showDialog = true;
  }

  onSelectedFarmer(farmerId: number) {
    this.fbPlotOffer.controls['isNewFarmer'].setValue(this.IsNewFarmer(farmerId));
    this.farmers.forEach((value) => {
      if (value.farmerId == farmerId) {
        this.fbPlotOffer.controls['ryotName'].setValue(value.farmerName);
        this.fbPlotOffer.controls['fatherName'].setValue(value.fatherName);
        this.fbPlotOffer.controls['farmerVillage'].setValue(value.villageName);
        this.fbPlotOffer.controls['farmerDivision'].setValue(value.divisionName);
        this.fbPlotOffer.controls['farmerCircle'].setValue(value.circleName);
        this.fbPlotOffer.controls['farmerSection'].setValue(value.sectionName);
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
  onSelectedVillage(plotVillageId: number) {
    this.villages.forEach((value) => {
      if (value.villageId == plotVillageId) {
        this.fbPlotOffer.controls['plotVillageId'].setValue(value.villageId);
        this.fbPlotOffer.controls['plotDivision'].setValue(value.divisionName);
        this.fbPlotOffer.controls['plotCircle'].setValue(value.circleName);
        this.fbPlotOffer.controls['plotSection'].setValue(value.sectionName);
      }
    });
  }

  // onGlobalFilter(table: Table, event: Event) {
  //   table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  // }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  editPlotOffer(plotOffer: IFarmerPlotOffersViewDto, farmer: IFarmerInPlotOfferDto) {
    this.plotOffer.plotOfferId = plotOffer.plotOfferId;
    this.plotOffer.seasonId = farmer.seasonId;
    this.fbPlotOffer.controls['seasonId'].disable();
    this.plotOffer.offerNo = plotOffer.offerNo;
    this.fbPlotOffer.controls['offerNo'].disable();
    this.plotOffer.offerDate = plotOffer.offerDate && new Date(plotOffer.offerDate?.toString() + "");
    this.plotOffer.farmerId = farmer.farmerId;
    // this.fbPlotOffer.controls['farmerId'].disable();
    this.plotOffer.plotVillageId = plotOffer.plotVillageId;
    // this.fbPlotOffer.controls['plotVillageId'].disable();
    this.plotOffer.expectedArea = plotOffer.expectedArea;
    this.plotOffer.plantTypeId = plotOffer.plantTypeId;
    this.plotOffer.expectedPlantingDate = plotOffer.expectedPlantingDate && new Date(plotOffer.expectedPlantingDate?.toString() + "");
    this.plotOffer.expectedVarietyId = plotOffer.expectedVarietyId;
    this.plotOffer.reasonForNotPlantingId = plotOffer.reasonForNotPlantingId;
    this.plotOffer.isNewFarmer = plotOffer.isNewFarmer;
    this.fbPlotOffer.patchValue(this.plotOffer);
    this.fbPlotOffer.controls['ryotName'].setValue(farmer.farmerName);
    this.fbPlotOffer.controls['fatherName'].setValue(farmer.fatherName);
    this.fbPlotOffer.controls['farmerVillage'].setValue(farmer.farmerVillageName);
    this.fbPlotOffer.controls['farmerDivision'].setValue(farmer.farmerDivisionName);
    this.fbPlotOffer.controls['farmerCircle'].setValue(farmer.farmerCircleName);
    this.fbPlotOffer.controls['farmerSection'].setValue(farmer.farmerSectionName);

    this.fbPlotOffer.controls['plotDivision'].setValue(plotOffer.plotDivisionName);
    this.fbPlotOffer.controls['plotCircle'].setValue(plotOffer.plotCircleName);
    this.fbPlotOffer.controls['plotSection'].setValue(plotOffer.plotSectionName);

    this.addFlag = false;
    this.submitLabel = 'Update Allotted Plot';
    this.showDialog = true;


  }

  editApproval(plotOffer: IFarmerPlotOffersViewDto, farmer: IFarmerInPlotOfferDto) {
    this.editPlotOffer(plotOffer, farmer);
    this.showDialog = false;
    this.showApprovalDialog = true;
  }

  saveAllottedPlot(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.monitoringService.CreatePlotOffer(this.fbPlotOffer.value)
    else return this.monitoringService.UpdatePlotOffer(this.fbPlotOffer.value)
  }

  onSubmit() {
    if (this.fbPlotOffer.valid) {
      this.fbPlotOffer.controls['seasonId'].enable();
      this.fbPlotOffer.controls['offerNo'].enable();
      // this.fbPlotOffer.controls['farmerId'].enable();
      // this.fbPlotOffer.controls['plotVillageId'].enable();
      this.fbPlotOffer.value.offerDate = FORMAT_DATE(this.fbPlotOffer.value.offerDate);
      this.fbPlotOffer.value.expectedPlantingDate = FORMAT_DATE(this.fbPlotOffer.value.expectedPlantingDate);
      this.saveAllottedPlot().subscribe(resp => {
        if (resp) {
          this.initPlotOffers(this.currentSeason.seasonId!);
          this.fbPlotOffer.reset();
          this.showDialog = false;
        }
      })
    }
    else {
      this.fbPlotOffer.markAllAsTouched();
    }
  }

  onApprovalOrDeny() {
    // if (this.fbPlotOffer.valid) {
    this.monitoringService.ApprovePlotOffer(this.fbPlotOffer.value).subscribe(resp => {
      if (resp) {
        this.initPlotOffers(this.currentSeason.seasonId!);
        this.fbPlotOffer.reset();
        this.showApprovalDialog = false;
      }
    });
    // }
    // else {
    this.fbPlotOffer.markAllAsTouched();
    // }
  }

  onApprovalSubmit(data: string) {
    if (data == 'denied') {
      this.fbPlotOffer.controls['remarks'].setValidators(Validators.required);
      this.fbPlotOffer.controls['remarks'].updateValueAndValidity();
    }
    this.onApprovalOrDeny();
  }

}
