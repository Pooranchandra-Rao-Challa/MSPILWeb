import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CirclesViewDto, MandalDto, MandalsViewDto, DistrictDto } from 'src/app/_models/geomodels';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';

@Component({
  selector: 'app-mandal',
  templateUrl: './mandal.component.html',
  providers: [MessageService, ConfirmationService]
})
export class MandalComponent implements OnInit {


  display: boolean = false;
  mandals: MandalsViewDto[] = [];
  mandal: MandalDto = new MandalDto();
  district: DistrictDto[] = [];
  loading: boolean = true;
  fbmandals!: FormGroup;
  filter: any;
  submitLabel!: string;
  addFlag: boolean = true;

  constructor(private formbuilder: FormBuilder,
    private geoMasterService: GeoMasterService,
    private commonService: CommonService,
    public jwtService: JWTService,
  ) {

  }
  InitMandal() {
    this.mandal = new MandalDto();
    this.fbmandals.reset();
    this.submitLabel = "Add Mandal";
    this.addFlag = true;
    this.display = true;
  }

  get FormControls() {
    return this.fbmandals.controls;
  }

  ngOnInit() {
    this.initMandals();
    this.commonService.GetDistrictsForState().subscribe((resp) => {
      this.district = resp as unknown as DistrictDto[]
      console.log(this.district);    
    })
    
    this.fbmandals = this.formbuilder.group({
      code: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
      name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      districtId: ['', (Validators.required)],
      mandalId: [''],
      isActive: new FormControl (true, Validators.required),
    });
  }
  initMandals() {
    this.geoMasterService.GetMandals().subscribe((resp) => {
      this.mandals = resp as unknown as MandalsViewDto[]
      this.loading = false;
    })
  }

  editProduct(mandal: MandalsViewDto) {
    this.mandal.code = mandal.mandalCode;
    this.mandal.name = mandal.mandalName;
    this.mandal.districtId = mandal.districtId;
    this.mandal.isActive = mandal.isActive;
    this.mandal.mandalId = mandal.mandalId;
    // this.mandal.districtId = mandal.districtName;
    // this.mandal.mandalId = mandal.mandalId;
    this.fbmandals.setValue(this.mandal);
    this.submitLabel = "Update Mandal";
    this.addFlag = false;
    this.display = true;
  }

  private UpdateForm() {

  }
  onClose() {
    this.fbmandals.reset();
  }

  saveMandal(): Observable<HttpEvent<MandalDto>> {
    if (this.addFlag) return this.geoMasterService.CreateMandal(this.fbmandals.value)
    else return this.geoMasterService.UpdateMandal(this.fbmandals.value)
  }
  onSubmit() {
    if (this.fbmandals.valid) {
      this.saveMandal().subscribe(resp => {
        if (resp) {
          this.initMandals();
          this.onClose();
          this.display = false;
        }
      })
    }
    else {
      // alert("please fill the fields")
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


  valSwitch: boolean = true;

}


