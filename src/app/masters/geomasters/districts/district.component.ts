import { RG_ALPHA_NUMERIC, MIN_LENGTH_2, MAX_LENGTH_6, RG_ALPHA_ONLY } from 'src/app/_shared/regex';
import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DistrictDto, DistrictViewDto, StateDto } from 'src/app/_models/geomodels';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';

@Component({
  selector: 'app-district',
  templateUrl: './district.component.html',
  providers: [MessageService, ConfirmationService]
})
export class DistrictComponent implements OnInit {
  valSwitch: boolean = true;
  display: boolean = false;
  districts: DistrictViewDto[] = [];
  district: DistrictDto = new DistrictDto();
  states: StateDto[] = [];
  loading: boolean = true;
  fbdistricts!: FormGroup;
  @ViewChild('filter') filter!: ElementRef;
  submitLabel!: string;
  addFlag: boolean = true;
  mediumDate: string = MEDIUM_DATE;

  constructor(private formbuilder: FormBuilder,
    private geoMasterService: GeoMasterService,
    private commonService: CommonService,
    public jwtService: JWTService,
  ) { }

  InitDistrict() {
    this.district = new DistrictDto();
    this.fbdistricts.reset();
    this.submitLabel = "Add District";
    this.addFlag = true;
    this.display = true;
  }

  get FormControls() {
    return this.fbdistricts.controls;
  }

  ngOnInit() {
    this.initDistricts();
    this.commonService.GetStates().subscribe((resp) => {
      this.states = resp as unknown as StateDto[]
    })
    this.fbdistricts = this.formbuilder.group({
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_6)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY)]),
      stateId: ['', (Validators.required)],
      districtId: [''],
      isActive: [Validators.required]
    });
  }

  initDistricts() {
    this.geoMasterService.GetDistricts().subscribe((resp) => {
      this.districts = resp as unknown as DistrictViewDto[]
      this.loading = false;
    })
  }

  editProduct(district: DistrictViewDto) {
    this.district.code = district.districtCode;
    this.district.name = district.districtName
    this.district.isActive = district.isActive;
    this.district.districtId = district.districtId
    this.district.stateId = district.stateId;
    this.fbdistricts.setValue(this.district);
    this.submitLabel = "Update District";
    this.addFlag = false;
    this.display = true;
  }

  onClose() {
    this.fbdistricts.reset();
  }

  saveDistrict(): Observable<HttpEvent<DistrictDto>> {
    if (this.addFlag) return this.geoMasterService.CreateDistrict(this.fbdistricts.value)
    else return this.geoMasterService.UpdateDistrict(this.fbdistricts.value)
  }

  onSubmit() {
    if (this.fbdistricts.valid) {
      this.saveDistrict().subscribe(resp => {
        if (resp) {
          this.initDistricts();
          this.onClose();
          this.display = false;
        }
      })
    }
    else {
      this.fbdistricts.markAllAsTouched();
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  ngOnDestroy() {
    this.districts = [];
    this.states = [];
  }

}


