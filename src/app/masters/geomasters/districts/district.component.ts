import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CustomerService } from 'src/app/demo/service/customer.service';
import { ProductService } from 'src/app/demo/service/product.service';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CirclesViewDto, DistrictDto, DistrictViewDto, StateDto } from 'src/app/_models/geomodels';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';

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

  constructor(private formbuilder: FormBuilder,
    private customerService: CustomerService,
    private geoMasterService: GeoMasterService,
    private commonService: CommonService,
    public jwtService: JWTService,
    private productService: ProductService) {

  }
  InitDistrict() {
    this.district = new DistrictDto();
    this.display = true;
  }

  get FormControls(){
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
      isActive: true
    });

  }
  initDistricts(){
    this.geoMasterService.GetDistricts().subscribe((resp) => {
      this.districts = resp as unknown as DistrictViewDto[]
    })
  }
  onClose(){
    this.fbdistricts.reset();
  }
  onSubmit() {
    if (this.fbdistricts.valid) {
      console.log(this.fbdistricts.value);
      this.geoMasterService.CreateDistrict(this.fbdistricts.value).subscribe((resp)=>{
        //console.log(resp);
        this.initDistricts();
        this.onClose();
        this.display = false;
      });
      // success save.
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


