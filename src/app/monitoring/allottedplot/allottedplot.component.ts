import { SeasonDto } from './../../_models/applicationmaster';
import { LookupService } from 'src/app/_services/lookup.service';
import { MonitoringService } from 'src/app/_services/monitoring.service';
import { AppMasterService } from './../../_services/appmaster.service';
import { GeoMasterService } from './../../_services/geomaster.service';
import { CommonService } from './../../_services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { AllottedPlotDto, IAllottedPlotViewDto } from 'src/app/_models/monitoring';
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
  selector: 'app-allottedplot',
  templateUrl: './allottedplot.component.html',
  styles: [
  ]
})

export class AllottedplotComponent implements OnInit {
  allottedPlots: IAllottedPlotViewDto[] = [];
  allottedPlot: AllottedPlotDto = new AllottedPlotDto();
  loading: boolean = false;
  globalFilterFields: string[] = ["seasonName", "offerNo", "offerDate", "farmerId", "farmerVillageName", "farmerName", "plotVillageName", "plantType",
    "expectedArea", "varietyId", "plantingDate"];
  @ViewChild('filter') filter!: ElementRef;
  showDialog: boolean = false;
  addFlag: boolean = true;
  submitLabel!: string;
  fbAllottedPlot!: FormGroup;
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
  headers: IHeader[] = [
    { field: 'seasonName', header: 'seasonName', label: 'Season' },
    { field: 'offerNo', header: 'offerNo', label: 'Offer No' },
    { field: 'offerDate', header: 'offerDate', label: 'Offer Date' },
    { field: 'farmerCode', header: 'farmerCode', label: 'Farmer Code' },
    { field: 'farmerName', header: 'farmerName', label: 'Farmer Name' },
    { field: 'farmerVillageName', header: 'farmerVillageName', label: 'Farmer Village' },
    { field: 'plotVillageName', header: 'plotVillageName', label: 'Plot Village' },
    { field: 'plantType', header: 'plantType', label: 'Plant Type' },
    { field: 'expectedArea', header: 'expectedArea', label: 'Area' },
    { field: 'varietyId', header: 'varietyId', label: 'Variety' },
    { field: 'plantingDate', header: 'plantingDate', label: 'Planting Date' },
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
    //if (this.forapproval == false) {

      this.initCurrentSeason(currentSeason);
      this.initFarmers();
      this.initVillages();
      this.initPlantType();
      this.initVarieties();
      this.initReasonForNotPlanting();
      this.allottedPlotForm();
    //}


    this.disabledFormControls();
    console.log(this.forapproval);

  }

  initAllottedPlots(seasonId: number) {
    let param1 = this.filter.nativeElement.value == "" ? null : this.filter.nativeElement.value;
    this.monitoringService.GetAllottedPlots(seasonId, this.forapproval, param1).subscribe((resp) => {
      this.allottedPlots = resp as unknown as IAllottedPlotViewDto[];
      console.log(this.allottedPlots);

    });
  }

  onSearch() {
    this.initAllottedPlots(this.currentSeason.seasonId!);
  }

  initFarmers() {
    this.appMasterservice.GetFarmers().subscribe((resp) => {
      this.farmers = resp as unknown as FarmersViewDto[];
      this.loading = false;
    })
  }

  initVillages() {
    this.geoMasterService.GetVillage().subscribe((resp) => {
      this.villages = resp as unknown as VillagesViewDto[];
      this.loading = false;
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
      this.initAllottedPlots(this.currentSeason.seasonId!);
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
    console.log(this.allottedPlot.allottedPlotId);

    if (this.allottedPlot.allottedPlotId == null)
      this.monitoringService.GetNewOfferNo(seasonId).subscribe((resp) => {
        if (resp) this.fbAllottedPlot.controls['offerNo'].setValue(resp);
      });
  }

  get IsAdd(): boolean { return this.allottedPlot?.allottedPlotId == null; }

  allottedPlotForm() {
    this.fbAllottedPlot = this.formbuilder.group({
      allottedPlotId: [null],
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
      isActive: [false]
    });
  }

  get FormControls() {
    return this.fbAllottedPlot.controls;
  }

  addAllottedPlot() {
    this.submitLabel = 'Add Allotted Plot';

    this.fbAllottedPlot.controls['seasonId'].enable();
    this.fbAllottedPlot.controls['villageId'].enable();
    this.fbAllottedPlot.controls['farmerId'].enable();
    this.fbAllottedPlot.controls['isNewFarmer'].setValue(false);
    this.showDialog = true;
  }

  disabledFormControls() {
    // this.fbAllottedPlot.controls['offerNo'].disable();
    this.fbAllottedPlot.controls['ryotName'].disable();
    this.fbAllottedPlot.controls['fatherName'].disable();
    this.fbAllottedPlot.controls['farmerVillage'].disable();
    this.fbAllottedPlot.controls['farmerDivision'].disable();
    this.fbAllottedPlot.controls['farmerCircle'].disable();
    this.fbAllottedPlot.controls['farmerSection'].disable();
    this.fbAllottedPlot.controls['plotDivision'].disable();
    this.fbAllottedPlot.controls['plotCircle'].disable();
    this.fbAllottedPlot.controls['plotSection'].disable();
  }

  onSelectedFarmer(farmerId: number) {
    this.fbAllottedPlot.controls['isNewFarmer'].setValue(this.IsNewFarmer(farmerId));
    this.farmers.forEach((value) => {
      if (value.farmerId == farmerId) {
        this.fbAllottedPlot.controls['ryotName'].setValue(value.farmerName);
        this.fbAllottedPlot.controls['fatherName'].setValue(value.fatherName);
        this.fbAllottedPlot.controls['farmerVillage'].setValue(value.villageName);
        this.fbAllottedPlot.controls['farmerDivision'].setValue(value.divisionName);
        this.fbAllottedPlot.controls['farmerCircle'].setValue(value.circleName);
        this.fbAllottedPlot.controls['farmerSection'].setValue(value.sectionName);
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
        this.fbAllottedPlot.controls['villageId'].setValue(value.villageId);
        this.fbAllottedPlot.controls['plotDivision'].setValue(value.divisionName);
        this.fbAllottedPlot.controls['plotCircle'].setValue(value.circleName);
        this.fbAllottedPlot.controls['plotSection'].setValue(value.sectionName);
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

  editAllottedPlot(allottedPlot: IAllottedPlotViewDto) {
    this.allottedPlot.allottedPlotId = allottedPlot.allottedPlotId;
    this.allottedPlot.seasonId = allottedPlot.seasonId;
    this.fbAllottedPlot.controls['seasonId'].disable();
    this.allottedPlot.offerNo = allottedPlot.offerNo;
    this.allottedPlot.offerDate = new Date(allottedPlot.offerDate?.toString() + "");
    this.allottedPlot.isNewFarmer = allottedPlot.isNewFarmer;
    this.allottedPlot.farmerId = allottedPlot.farmerId;
    this.fbAllottedPlot.controls['farmerId'].disable();
    this.allottedPlot.villageId = allottedPlot.plotVillageId;
    this.fbAllottedPlot.controls['villageId'].disable();
    this.allottedPlot.expectedArea = allottedPlot.expectedArea;
    this.allottedPlot.plantTypeId = allottedPlot.plantTypeId;
    this.allottedPlot.plantingDate = new Date(allottedPlot.plantingDate?.toString() + "");
    this.allottedPlot.varietyId = allottedPlot.varietyId;
    this.allottedPlot.reasonForNotPlantingId = allottedPlot.reasonForNotPlantingId;
    this.allottedPlot.isActive = allottedPlot.isActive;
    this.allottedPlot.isNewFarmer = allottedPlot.isNewFarmer;
    this.fbAllottedPlot.patchValue(this.allottedPlot);
    this.fbAllottedPlot.controls['ryotName'].setValue(allottedPlot.farmerName);
    this.fbAllottedPlot.controls['fatherName'].setValue(allottedPlot.fatherName);
    this.fbAllottedPlot.controls['farmerVillage'].setValue(allottedPlot.farmerVillageName);
    this.fbAllottedPlot.controls['farmerDivision'].setValue(allottedPlot.farmerDivisionName);
    this.fbAllottedPlot.controls['farmerCircle'].setValue(allottedPlot.farmerCircleName);
    this.fbAllottedPlot.controls['farmerSection'].setValue(allottedPlot.farmerSectionName);

    this.fbAllottedPlot.controls['plotDivision'].setValue(allottedPlot.plotDivisionName);
    this.fbAllottedPlot.controls['plotCircle'].setValue(allottedPlot.plotCircleName);
    this.fbAllottedPlot.controls['plotSection'].setValue(allottedPlot.plotSectionName);

    this.addFlag = false;
    this.submitLabel = 'Update Allotted Plot';
    this.showDialog = true;
  }

  saveAllottedPlot(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.monitoringService.CreateAllottedPlot(this.fbAllottedPlot.value)
    else return this.monitoringService.UpdateAllottedPlot(this.fbAllottedPlot.value)
  }

  onSubmit() {
    console.log(this.fbAllottedPlot.value);
    if (this.fbAllottedPlot.valid) {
      this.fbAllottedPlot.value.offerDate = FORMAT_DATE(this.fbAllottedPlot.value.offerDate);
      this.fbAllottedPlot.value.plantingDate = FORMAT_DATE(this.fbAllottedPlot.value.plantingDate);
      this.saveAllottedPlot().subscribe(resp => {
        if (resp) {
          this.initAllottedPlots(this.currentSeason.seasonId!);
          this.fbAllottedPlot.reset();
          this.showDialog = false;
        }
      })
    }
    else {
      this.fbAllottedPlot.markAllAsTouched();
    }
  }

}
