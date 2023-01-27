import { JWTService } from 'src/app/_services/jwt.service';
import { CommonService } from 'src/app/_services/common.service';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Customer, Representative } from 'src/app/demo/api/customer';
import { CustomerService } from 'src/app/demo/service/customer.service';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SortEvent } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DistrictViewDto, DistrictDto, StateDto } from 'src/app/_models/geomodels';


@Component({
  selector: 'app-district',
  templateUrl: './district.component.html',
  providers: [MessageService, ConfirmationService]
})
export class DistrictComponent implements OnInit {

  cities: any = [];
  selectedDrop: any;


  showDialog() {
    this.display = false;
  }


  display: boolean = false;

  districts: DistrictViewDto[] = [];

  district: DistrictDto = new DistrictDto();

  states: StateDto[] = []


  customers1: Customer[] = [];

  customers2: Customer[] = [];

  customers3: Customer[] = [];

  selectedCustomers1: Customer[] = [];

  selectedCustomer: Customer = {};

  representatives: Representative[] = [];

  statuses: any[] = [];

  products: Product[] = [];

  // cols: any[];

  rowGroupMetadata: any;

  activityValues: number[] = [0, 100];

  isExpanded: boolean = false;

  idFrozen: boolean = false;

  loading: boolean = true;


  @ViewChild('filter') filter!: ElementRef;

  fbdistricts!: FormGroup;

  constructor(private formbuilder: FormBuilder, private customerService: CustomerService,
    private geoMasterService: GeoMasterService, private commonService: CommonService,
    public jwtService: JWTService,
    private productService: ProductService) {
    this.cities = [
      { label: 'New York', value: { id: 1, name: 'New York', code: 'NY' } },
      { label: 'Rome', value: { id: 2, name: 'Rome', code: 'RM' } },
      { label: 'London', value: { id: 3, name: 'London', code: 'LDN' } },
      { label: 'Istanbul', value: { id: 4, name: 'Istanbul', code: 'IST' } },
      { label: 'Paris', value: { id: 5, name: 'Paris', code: 'PRS' } }
    ];
  }

  InitDistrict() {
    this.district = new DistrictDto();
    this.display = true;
  }

  get FormControls(){
    return this.fbdistricts.controls;
  }

  ngOnInit() {

    this.geoMasterService.GetDistricts().subscribe((resp) => {
      this.districts = resp as unknown as DistrictViewDto[]
    })

    this.commonService.GetStates().subscribe((resp) => {
      this.states = resp as unknown as StateDto[]
    })
    this.customerService.getCustomersLarge().then(customers => {
      this.customers1 = customers;
      this.loading = false;

      // @ts-ignore
      this.customers1.forEach(customer => customer.date = new Date(customer.date));
    });

    this.customerService.getCustomersLarge().then(customers => this.customers3 = customers);

    this.fbdistricts = this.formbuilder.group({
      code: ['', (Validators.required)],
      name: ['', (Validators.required)],
      state: ['', (Validators.required)],
      active: true
    });

  }
  onSubmit() {
    if (this.fbdistricts.valid) {
      console.log(this.fbdistricts.value);
    }
    else {
      // alert("please fill the fields")
      this.fbdistricts.markAllAsTouched();
    }
  }

  dropdownItems = [
    { name: '' },
    { name: 'Telengana', code: 'Telengana' },
    { name: 'Andhra Pradesh', code: 'Andhra Pradesh' }
  ];

  customSort(event: SortEvent) {

  }
  onSort() {
    this.updateRowGroupMetaData();
  }

  updateRowGroupMetaData() {
    this.rowGroupMetadata = {};

    if (this.customers3) {
      for (let i = 0; i < this.customers3.length; i++) {
        const rowData = this.customers3[i];
        const representativeName = rowData?.representative?.name || '';

        if (i === 0) {
          this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
        }
        else {
          const previousRowData = this.customers3[i - 1];
          const previousRowGroup = previousRowData?.representative?.name;
          if (representativeName === previousRowGroup) {
            this.rowGroupMetadata[representativeName].size++;
          }
          else {
            this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
          }
        }
      }
    }
  }


  formatCurrency(value: number) {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
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


