import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { VillagesViewDto } from 'src/app/_models/geomodels';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { BillMasterService } from 'src/app/_services/billmaster.service';
import { VillageParamRateViewDto, VillageParamRateDto, BillParameterViewDto } from 'src/app/_models/billingmaster';

@Component({
  selector: 'app-villageparamrates',
  templateUrl: './villageparamrates.component.html',
  styles: ['.p-dropdown{ width: 100% }']
})
export class VillageParamRatesComponent implements OnInit {
  villageParamRates: VillageParamRateViewDto[] = [];
  villageParamRate: VillageParamRateDto = new VillageParamRateDto();
  showDialog: boolean = false;
  addFlag: boolean = true;
  globalFilterFields: string[] = ['seasonName', 'divisionName', 'circleName', 'sectionName', 'villageName', 'billParameterName', 'rate', 'isActive',
    'createdAt', 'createdBy', 'updatedAt', 'updatedBy'];
  @ViewChild('filter') filter!: ElementRef;
  fbVillageParamRate!: FormGroup;
  seasons: any;
  villages: VillagesViewDto[] = [];
  billParameters: BillParameterViewDto[] = [];
  submitLabel!: string;
  mediumDate: string = MEDIUM_DATE;

  constructor(private formbuilder: FormBuilder,
    private billMasterService: BillMasterService,
    private commonService: CommonService,
    private geoMasterService: GeoMasterService
  ) { }

  ngOnInit(): void {
    this.initVillageParamRates();
    this.initDefaults();
    this.villageParamRateForm();
  }

  initVillageParamRates() {
    this.billMasterService.GetVillageParamRates().subscribe((resp) => {
      this.villageParamRates = resp as unknown as VillageParamRateViewDto[];
    });
  }

  getVillageParamRatesBySeason(seasonId: number) {
    var seasonId = seasonId ? seasonId : 0;
    this.billMasterService.GetVillageParamRatesBySeasonId(seasonId).subscribe((resp) => {
      this.villageParamRates = resp as unknown as VillageParamRateViewDto[];
    });
  }

  initDefaults() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp;
    });

    this.geoMasterService.GetVillage().subscribe((resp) => {
      this.villages = resp as unknown as VillagesViewDto[];
    });

    this.billMasterService.GetBillParameters().subscribe((resp) => {
      this.billParameters = resp as unknown as BillParameterViewDto[];
    });
  }

  villageParamRateForm() {
    this.fbVillageParamRate = this.formbuilder.group({
      id: [null],
      seasonsId: ['', (Validators.required)],
      villageName: ['', (Validators.required)],
      villageId: ['', (Validators.required)],
      billParameterId: ['', (Validators.required)],
      rate: [null, Validators.required],
      isActive: [true]
    });
  }

  get FormControls() {
    return this.fbVillageParamRate.controls;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  addVillageParamRate() {
    this.submitLabel = "Add Village Param Rate";
    this.addFlag = true;
    this.showDialog = true;
  }

  editVillageParamRate(vParamRate: VillageParamRateViewDto) {
    this.villageParamRate.id = vParamRate.id;
    this.villageParamRate.seasonsId = vParamRate.seasonsId;
    this.villageParamRate.villageId = vParamRate.villageId;
    this.villageParamRate.villageName = vParamRate.villageName;
    this.villageParamRate.billParameterId = vParamRate.billParameterId;
    this.villageParamRate.rate = vParamRate.rate;
    this.fbVillageParamRate.setValue(this.villageParamRate);
    this.addFlag = false;
    this.submitLabel = "Update Village Param Rate";
    this.showDialog = true;
  }

  saveBillParam(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.billMasterService.CreateVillageParamRate(this.fbVillageParamRate.value)
    else return this.billMasterService.UpdateVillageParamRate(this.fbVillageParamRate.value)
  }

  onSubmit() {
    if (this.fbVillageParamRate.valid) {
      this.saveBillParam().subscribe(resp => {
        if (resp) {
          this.initVillageParamRates();
          this.fbVillageParamRate.reset();
          this.showDialog = false;
        }
      })
    }
    else {
      this.fbVillageParamRate.markAllAsTouched();
    }
  }

  onSelectedVillage(villageId: number) {
    this.villages.forEach((value) => {
      if (value.villageId == villageId) {
        this.fbVillageParamRate.controls['villageId'].setValue(value.villageId);
        this.fbVillageParamRate.controls['villageName'].setValue(value.villageName);
      }
    });
  }

  ngOnDestroy() {
    this.villageParamRates = [];
    this.villages = [];
    this.seasons = [];
    this.billParameters = [];
    this.villageParamRate = new VillageParamRateDto();
  }

}
