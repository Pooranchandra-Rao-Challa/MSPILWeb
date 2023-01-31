import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CirclesViewDto, DistrictDto, DistrictViewDto, StateDto } from 'src/app/_models/geomodels';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { CustomerService } from 'src/app/demo/service/customer.service';

@Component({
  selector: 'app-district',
  templateUrl: './district.component.html',
  providers: [MessageService, ConfirmationService]
})
export class DistrictComponent implements OnInit {

  cities: any = [];
  selectedDrop: any;
  display: boolean = false;
  districts: DistrictViewDto[] = [];
  district: DistrictDto = new DistrictDto();
  states: StateDto[] = [];
  loading: boolean = true;
  fbdistricts!: FormGroup;
  filter: any;
  submitLabel!: string;
  addFlag: boolean = true;

  constructor(private formbuilder: FormBuilder,
    private customerService: CustomerService,
    private geoMasterService: GeoMasterService,
    private commonService: CommonService,
    public jwtService: JWTService,
  ) {

  }
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
    this.customerService.getCustomersLarge().then(customers => {
      this.loading = false;
    });
    this.fbdistricts = this.formbuilder.group({
      code: ['', (Validators.required)],
      name: ['', (Validators.required)],
      stateId: ['', (Validators.required)],
      districtId: [''],
      isActive: [true, Validators.required]
    });


  }
  initDistricts() {
    this.geoMasterService.GetDistricts().subscribe((resp) => {
      this.districts = resp as unknown as DistrictViewDto[]
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

  private UpdateForm() {

  }
  onClose() {
    this.fbdistricts.reset();
  }

  saveDistrict() : Observable<HttpEvent<DistrictDto>>{
    if (this.addFlag) return this.geoMasterService.CreateDistrict(this.fbdistricts.value)
    else return this.geoMasterService.UpdateDistrict(this.fbdistricts.value)
  }
  onSubmit() {
    if (this.fbdistricts.valid) {
      this.saveDistrict().subscribe(resp =>{
          if (resp) {
            this.initDistricts();
            this.onClose();
            this.display = false;
          }
      })
    }
    else {
      // alert("please fill the fields")
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


  valSwitch: boolean = true;

}


