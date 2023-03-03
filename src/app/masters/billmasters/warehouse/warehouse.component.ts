import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Table } from 'primeng/table';
import { WareHouseViewDto, WareHouseDto } from '../../../_models/billingmaster';
import { BillMasterService } from 'src/app/_services/billmaster.service';
import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styles: [],
})
export class WareHouseComponent implements OnInit {
  warehouses: WareHouseViewDto[] = [];
  warehouse: WareHouseDto = new WareHouseDto();
  loading: boolean = true;
  filter: any;
  showDialog: boolean = false;
  fbwarehouse!: FormGroup;
  addFlag: boolean = true;
  submitLabel!: string;
  mediumDate: string = MEDIUM_DATE;

  constructor(
    private formbuilder: FormBuilder,
    private billmasterService: BillMasterService
  ) {}

  ngOnInit(): void {
    this.loadwarehouses();
    this.warehouseform();
  }

  loadwarehouses() {
    this.billmasterService.GetWareHouse().subscribe((resp) => {
      this.warehouses = resp as unknown as WareHouseViewDto[];
      console.log(this.warehouses);
      this.loading = false;
    });
  }
  addwarehouse() {
    this.submitLabel = 'Add Ware House';
    this.addFlag = true;
    this.showDialog = true;
  }

  warehouseform() {
    this.fbwarehouse = this.formbuilder.group({
      id: [0],
      code: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+$/),
      ]),
      name: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z ]*'),
      ]),
      isActive: new FormControl(true, Validators.required),
      glcode: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+$/),
      ]),
      subGlcode: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\d+$/),
      ]),
    });
  }

  get FormControls() {
    return this.fbwarehouse.controls;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  editWarehouse(warehouses: WareHouseViewDto) {
    this.warehouse.id = warehouses.id;
    this.warehouse.code = warehouses.code;
    this.warehouse.name = warehouses.name;
    this.warehouse.glcode = warehouses.glcode;
    this.warehouse.subGlcode = warehouses.subGlcode;
    this.warehouse.isActive = warehouses.isActive;
    this.fbwarehouse.setValue(this.warehouse);
    this.addFlag = false;
    this.showDialog = true;
    this.submitLabel = 'Update Warehouse';
  }

  saveWarehouse(): Observable<HttpEvent<any>> {
    if (this.addFlag)
      return this.billmasterService.CreateWareHouse(this.fbwarehouse.value);
    else return this.billmasterService.UpdateWareHouse(this.fbwarehouse.value);
  }

  onSubmit() {
    if (this.fbwarehouse.valid) {
      console.log(this.fbwarehouse.value);
      this.saveWarehouse().subscribe((resp) => {
        if (resp) {
          this.loadwarehouses();
          this.fbwarehouse.reset();
          this.showDialog = false;
        }
      });
    } else {
      this.fbwarehouse.markAllAsTouched();
    }
  }
}
