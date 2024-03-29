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
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { ITableHeader } from 'src/app/_models/common';

@Component({
  selector: 'app-district',
  templateUrl: './district.component.html',
})
export class DistrictComponent implements OnInit {
  globalFilterFields: string[] = ['districtName', 'districtCode', 'stateName', 'updatedAt', 'createdAt', 'updatedBy', 'createdBy']
  valSwitch: boolean = true;
  display: boolean = false;
  districts: DistrictViewDto[] = [];
  district: DistrictDto = new DistrictDto();
  state: StateDto[] = [];
  fbdistricts!: FormGroup;
  @ViewChild('filter') filter!: ElementRef;
  submitLabel!: string;
  addFlag: boolean = true;
  mediumDate: string = MEDIUM_DATE;
  permissions: any;

  headers: ITableHeader[] = [
    { field: 'districtCode', header: 'districtCode', label: 'Code' },
    { field: 'districtName', header: 'districtName', label: 'Name' },
    { field: 'stateName', header: 'stateName', label: 'State' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ];
  constructor(private formbuilder: FormBuilder,
    private geoMasterService: GeoMasterService,
    private commonService: CommonService,
    public jwtService: JWTService,
    private alertMessage: AlertMessage) { }

  InitDistrict() {
    this.district = new DistrictDto();
    this.fbdistricts.controls['isActive'].setValue(true);
    this.submitLabel = "Add District";
    this.addFlag = true;
    this.display = true;
  }

  get FormControls() {
    return this.fbdistricts.controls;
  }

  ngOnInit() {
    this.permissions = this.jwtService.Permissions;
    this.initDistricts();

    this.commonService.GetStates().subscribe((resp) => {
      this.state = resp as unknown as StateDto[]
    })
    this.fbdistricts = this.formbuilder.group({
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.maxLength(MAX_LENGTH_6)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      stateId: [null, (Validators.required)],
      districtId: [null],
      isActive: [null]
    });
  }

  initDistricts() {
    this.geoMasterService.GetDistricts().subscribe((resp) => {
      this.districts = resp as unknown as DistrictViewDto[]
    })
  }

  editProduct(district: DistrictViewDto) {
    this.fbdistricts.setValue({
      code: district.districtCode,
      name: district.districtName,
      isActive: district.isActive,
      districtId: district.districtId,
      stateId: district.stateId.toString(),
    });
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

  isUniqueDistrictCode() {
    const existingDistrictCodes = this.districts.filter(plantType => 
      plantType.districtCode === this.fbdistricts.value.code && 
      plantType.districtId !== this.fbdistricts.value.districtId
    )
    return existingDistrictCodes.length > 0; 
  }
  
  isUniqueDistrictName() {
    const existingDistrictNames = this.districts.filter(plantType =>
      plantType.districtName === this.fbdistricts.value.name && 
      plantType.districtId !== this.fbdistricts.value.districtId
    )
    return existingDistrictNames.length > 0;
  }
  
  onSubmit() {
    if (this.fbdistricts.valid) {
      if (this.addFlag) {
        if (this.isUniqueDistrictCode()) {
          this.alertMessage.displayErrorMessage(
            `District Code :"${this.fbdistricts.value.code}" already exists.`
          );
        } else if (this.isUniqueDistrictName()) {
          this.alertMessage.displayErrorMessage(
            `District Name :"${this.fbdistricts.value.name}" already exists.` 
          );
        } else {
          this.save();
        }
      } else {
        this.save(); 
      }
    } else {
      this.fbdistricts.markAllAsTouched(); 
    }
  }
  
  save() {
    if (this.fbdistricts.valid) {
      this.saveDistrict().subscribe(resp => {
        if (resp) {
          this.initDistricts();
          this.onClose();
          this.display = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMGMDIS001" : "SMGMDIS002"]);
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
    this.state = [];
  }

}


