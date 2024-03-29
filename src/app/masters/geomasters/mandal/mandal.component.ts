import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MandalDto, MandalsViewDto, DistrictDto } from 'src/app/_models/geomodels';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { MAX_LENGTH_6, MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY } from 'src/app/_shared/regex';
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { ITableHeader } from 'src/app/_models/common';

@Component({
  selector: 'app-mandal',
  templateUrl: './mandal.component.html',
})
export class MandalComponent implements OnInit {
  globalFilterFields: string[] = ['mandalCode', 'mandalName', 'districtName', 'isActive',
    'createdBy', 'updatedBy', 'createdAt', 'updatedAt']
  display: boolean = false;
  mandals: MandalsViewDto[] = [];
  mandal: MandalDto = new MandalDto();
  district: DistrictDto[] = [];
  fbmandals!: FormGroup;
  @ViewChild('filter') filter!: ElementRef;
  submitLabel!: string;
  addFlag: boolean = true;
  valSwitch: boolean = true;
  mediumDate: string = MEDIUM_DATE;
  permissions: any;

  headers: ITableHeader[] = [
    { field: 'mandalCode', header: 'mandalCode', label: 'Code' },
    { field: 'mandalName', header: 'mandalName', label: 'Name' },
    { field: 'districtName', header: 'districtName', label: 'District' },
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

  InitMandal() {
    this.mandal = new MandalDto();
    this.fbmandals.controls['isActive'].setValue(true);
    this.submitLabel = "Add Mandal";
    this.addFlag = true;
    this.display = true;
  }

  get FormControls() {
    return this.fbmandals.controls;
  }

  ngOnInit() {
    this.permissions = this.jwtService.Permissions;
    this.initMandals();

    this.commonService.GetDistricts().subscribe((resp) => {
      this.district = resp as unknown as DistrictDto[];
    });

    this.fbmandals = this.formbuilder.group({
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_6)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      districtId: [null, [Validators.required]],
      mandalId: [0],
      isActive: new FormControl(null),
    });
  }

  initMandals() {
    this.geoMasterService.GetMandals().subscribe((resp) => {
      this.mandals = resp as unknown as MandalsViewDto[]
    })
  }

  editProduct(mandal: MandalsViewDto) {
    // this.mandal.mandalId = mandal.mandalId;
    // this.mandal.code = mandal.mandalCode;
    // this.mandal.name = mandal.mandalName;
    // this.mandal.districtId = mandal.districtId;
    // this.mandal.isActive = mandal.isActive;
    this.fbmandals.setValue({
      mandalId: mandal.mandalId,
      code: mandal.mandalCode,
      name: mandal.mandalName,
      districtId: mandal.districtId.toString(),
      isActive: mandal.isActive
    })
    this.submitLabel = "Update Mandal";
    this.addFlag = false;
    this.display = true;
  }

  onClose() {
    this.fbmandals.reset();
  }

  saveMandal(): Observable<HttpEvent<MandalDto>> {
    if (this.addFlag) return this.geoMasterService.CreateMandal(this.fbmandals.value)
    else return this.geoMasterService.UpdateMandal(this.fbmandals.value)
  }

  isUniqueMandalCode() {
    const existingDistrictCodes = this.mandals.filter(division => 
      division.mandalCode === this.fbmandals.value.code && 
      division.mandalId !== this.fbmandals.value.mandalId
    )
    return existingDistrictCodes.length > 0; 
  }
  isUniqueMandalName() {
    const existingDistrictNames = this.mandals.filter(division =>
      division.mandalName === this.fbmandals.value.name && 
      division.mandalId !== this.fbmandals.value.mandalId
    )
    return existingDistrictNames.length > 0;
  }
  
  onSubmit() {
    if (this.fbmandals.valid) {
      if (this.addFlag) {
        if (this.isUniqueMandalCode()) {
          this.alertMessage.displayErrorMessage(
            `Mandal Code :"${this.fbmandals.value.code}" already exists.`
          );
        } else if (this.isUniqueMandalName()) {
          this.alertMessage.displayErrorMessage(
            `Mandal Name :"${this.fbmandals.value.name}" already exists.` 
          );
        } else {
          this.save();
        }
      } else {
        this.save(); 
      }
    } else {
      this.fbmandals.markAllAsTouched(); 
    }
  }
  
  save() {
    if (this.fbmandals.valid) {
      this.saveMandal().subscribe(resp => {
        if (resp) {
          this.initMandals();
          this.onClose();
          this.display = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMGMM001" : "SMGMM002"]);
        }
      })
    }
    else {
      this.fbmandals.markAllAsTouched();
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
    this.mandals = [];
    this.district = [];
  }

}


