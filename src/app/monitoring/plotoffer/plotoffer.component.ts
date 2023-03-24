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
    "expectedArea", "varietyId", "plantingDate"];
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
    { field: 'OfferNo', header: 'OfferNo', label: 'Offer No' },
    { field: 'OfferDate', header: 'OfferDate', label: 'Offer Date' },
    // { field: 'farmerCode', header: 'farmerCode', label: 'Farmer Code' },
    // { field: 'farmerName', header: 'farmerName', label: 'Farmer Name' },
    // { field: 'farmerVillageName', header: 'farmerVillageName', label: 'Farmer Village' },
    { field: 'PlotVillageName', header: 'PlotVillageName', label: 'Plot Village' },
    { field: 'PlantType', header: 'PlantType', label: 'Plant Type' },
    { field: 'ExpectedArea', header: 'ExpectedArea', label: 'Area' },
    { field: 'VarietyId', header: 'VarietyId', label: 'Variety' },
    { field: 'PlantingDate', header: 'PlantingDate', label: 'Planting Date' },
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
    let currentSeason = '2020-21';
    this.forapproval = this.activatedRoute.snapshot.params['paramUrl'] == ':forapproval';
    this.initSeasons();
    this.initCurrentSeason(currentSeason);
    this.initFarmers();
    this.initVillages();
    this.initPlantType();
    this.initVarieties();
    this.initReasonForNotPlanting();
    this.plotOfferForm();
    this.disabledFormControls();
  }

  initPlotOffers(seasonId: number) {
    let param1 = this.filter.nativeElement.value == "" ? null : this.filter.nativeElement.value;
    this.monitoringService.GetPlotOffers(seasonId, this.forapproval, param1).subscribe((resp) => {
      this.plotOffers = resp as unknown as IFarmerInPlotOfferDto[];
      this.plotOffers.forEach((value)=>{
        value.ObjOfferedPlots = JSON.parse(value.offeredPlots) as IFarmerPlotOffersViewDto[];
      });
      console.log(this.plotOffers);

    });


    console.log(this.seasons.filter((season)=> season.seasonId != seasonId ));

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

  getNewOfferNo(seasonId: number) {
    if (this.plotOffer.allottedPlotId == null)
      this.monitoringService.GetNewOfferNo(seasonId).subscribe((resp) => {
        if (resp) this.fbPlotOffer.controls['offerNo'].setValue(resp);
      });
  }

  get IsAdd(): boolean { return this.plotOffer?.allottedPlotId == null; }

  plotOfferForm() {
    this.fbPlotOffer = this.formbuilder.group({
      plotOfferId: [null],
      seasonId: [{ value: this.currentSeason.seasonId }, (Validators.required)],
      offerNo: [{ value: '' }],
      offerDate: ['', (Validators.required)],
      isNewFarmer: [false],
      farmerId: [{ value: '', disabled: !this.IsAdd }, (Validators.required)], /* Here farmerId is ryotNo */
      ryotName: [''],
      fatherName: [''],
      farmerVillage: [''],
      farmerDivision: [''],
      farmerCircle: [''],
      farmerSection: [''],
      villageId: [{ value: '', disabled: !this.IsAdd }, (Validators.required)], /* Here villageId is plotVillageId */
      plotDivision: [''],
      plotCircle: [''],
      plotSection: [''],
      expectedArea: ['', (Validators.required)],
      plantTypeId: ['', (Validators.required)],
      plantingDate: ['', (Validators.required)],
      varietyId: ['', (Validators.required)],
      reasonForNotPlantingId: ['', (Validators.required)],
      isActive: [false],
      remarks: ['']
    });
  }

  get FormControls() {
    return this.fbPlotOffer.controls;
  }

  addPlotOffer() {
    this.submitLabel = 'Add Allotted Plot';

    this.fbPlotOffer.controls['seasonId'].enable();
    this.fbPlotOffer.controls['villageId'].enable();
    this.fbPlotOffer.controls['farmerId'].enable();
    this.fbPlotOffer.controls['isNewFarmer'].setValue(false);
    this.showDialog = true;
  }

  disabledFormControls() {
    // this.fbPlotOffer.controls['offerNo'].disable();
    this.fbPlotOffer.controls['ryotName'].disable();
    this.fbPlotOffer.controls['fatherName'].disable();
    this.fbPlotOffer.controls['farmerVillage'].disable();
    this.fbPlotOffer.controls['farmerDivision'].disable();
    this.fbPlotOffer.controls['farmerCircle'].disable();
    this.fbPlotOffer.controls['farmerSection'].disable();
    this.fbPlotOffer.controls['plotDivision'].disable();
    this.fbPlotOffer.controls['plotCircle'].disable();
    this.fbPlotOffer.controls['plotSection'].disable();
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
  onSelectedVillage(villageId: number) {
    this.villages.forEach((value) => {
      if (value.villageId == villageId) {
        this.fbPlotOffer.controls['villageId'].setValue(value.villageId);
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

  editPlotOffer(plotOffer: IFarmerInPlotOfferDto) {
    // this.plotOffer.plotOfferId = plotOffer.plotOfferId;
    this.plotOffer.seasonId = plotOffer.seasonId;
    this.fbPlotOffer.controls['seasonId'].disable();
    this.plotOffer.offerNo = plotOffer.offerNo;
    this.plotOffer.offerDate = new Date(plotOffer.offerDate?.toString() + "");
    this.plotOffer.isNewFarmer = plotOffer.isNewFarmer;
    this.plotOffer.farmerId = plotOffer.farmerId;
    this.fbPlotOffer.controls['farmerId'].disable();
    // this.plotOffer.villageId = plotOffer.plotVillageId;
    this.fbPlotOffer.controls['villageId'].disable();
    // this.plotOffer.expectedArea = plotOffer.expectedArea;
    // this.plotOffer.plantTypeId = plotOffer.plantTypeId;
    // this.plotOffer.plantingDate = new Date(plotOffer.plantingDate?.toString() + "");
    // this.plotOffer.varietyId = plotOffer.varietyId;
    // this.plotOffer.reasonForNotPlantingId = plotOffer.reasonForNotPlantingId;
    // this.plotOffer.isActive = plotOffer.isActive;
    this.plotOffer.isNewFarmer = plotOffer.isNewFarmer;
    this.fbPlotOffer.patchValue(this.plotOffer);
    this.fbPlotOffer.controls['ryotName'].setValue(plotOffer.farmerName);
    this.fbPlotOffer.controls['fatherName'].setValue(plotOffer.fatherName);
    this.fbPlotOffer.controls['farmerVillage'].setValue(plotOffer.farmerVillageName);
    this.fbPlotOffer.controls['farmerDivision'].setValue(plotOffer.farmerDivisionName);
    this.fbPlotOffer.controls['farmerCircle'].setValue(plotOffer.farmerCircleName);
    this.fbPlotOffer.controls['farmerSection'].setValue(plotOffer.farmerSectionName);

    // this.fbPlotOffer.controls['plotDivision'].setValue(plotOffer.plotDivisionName);
    // this.fbPlotOffer.controls['plotCircle'].setValue(plotOffer.plotCircleName);
    // this.fbPlotOffer.controls['plotSection'].setValue(plotOffer.plotSectionName);

    this.addFlag = false;
    this.submitLabel = 'Update Allotted Plot';
    this.showDialog = true;
  }

  editApproval(plotOffer: IFarmerInPlotOfferDto) {
    this.editPlotOffer(plotOffer);
    this.showDialog = false;
    this.showApprovalDialog = true;
  }

  saveAllottedPlot(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.monitoringService.CreatePlotOffer(this.fbPlotOffer.value)
    else return this.monitoringService.UpdatePlotOffer(this.fbPlotOffer.value)
  }

  onSubmit() {
    if (this.fbPlotOffer.valid) {
      this.fbPlotOffer.value.offerDate = FORMAT_DATE(this.fbPlotOffer.value.offerDate);
      this.fbPlotOffer.value.plantingDate = FORMAT_DATE(this.fbPlotOffer.value.plantingDate);
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

  onApprovalSubmit(data: string) {
    if (data == 'denied') {
      this.fbPlotOffer.controls['remarks'].setValidators(Validators.required);
      this.fbPlotOffer.controls['remarks'].updateValueAndValidity();
    }
    this.onSubmit();
  }

}
