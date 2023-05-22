import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Table } from 'primeng/table';
import { WareHouseViewDto, WareHouseDto } from 'src/app/_models/billingmaster';
import { BillMasterService } from 'src/app/_services/billmaster.service';
import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { MAX_LENGTH_20, MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY } from 'src/app/_shared/regex';
import { ITableHeader, MaxLength } from 'src/app/_models/common';
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { JWTService } from 'src/app/_services/jwt.service';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styles: [],
})
export class WareHouseComponent implements OnInit {
  warehouses: WareHouseViewDto[] = [];
  warehouse: WareHouseDto = new WareHouseDto();
  showDialog: boolean = false;
  @ViewChild('filter') filter!: ElementRef;
  fbwarehouse!: FormGroup;
  addFlag: boolean = true;
  submitLabel!: string;
  mediumDate: string = MEDIUM_DATE;
  maxLength: MaxLength = new MaxLength();
  permissions: any;
  globalFilterFields: string[] = ['code', 'name', 'glcode', 'subGlcode', 'isActive', 'createdAt' , 'createdByUser', 'updatedAt', 'updatedByUser'];
  headers: ITableHeader[] = [
    { field: 'code', header: 'code', label: 'Code' },
    { field: 'name', header: 'name', label: 'Name' },
    { field: 'glcode', header: 'glcode', label: 'GL Code' },
    { field: 'subGlcode', header: 'subGlcode', label: 'Sub GL Code' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdByUser', header: 'createdByUser', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedByUser', header: 'updatedByUser', label: 'Updated By' },
  ];

  constructor(
    private formbuilder: FormBuilder,
    private billmasterService: BillMasterService,
    private alertMessage: AlertMessage,
    private jwtService: JWTService) { }

  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    this.loadwarehouses();
    this.warehouseform();
  }

  loadwarehouses() {
    this.billmasterService.GetWareHouse().subscribe((resp) => {
      this.warehouses = resp as unknown as WareHouseViewDto[];
      console.log('warehouses', this.warehouses);
    });
  }
  addwarehouse() {
    this.fbwarehouse.controls['isActive'].setValue(true);
    this.submitLabel = 'Add Ware House';
    this.addFlag = true;
    this.showDialog = true;
  }
  warehouseform() {
    this.fbwarehouse = this.formbuilder.group({
      id: [null],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      glcode: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      subGlcode: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      isActive: [null]
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
  editWarehouse(warehouse: WareHouseViewDto) {
    this.warehouse.id = warehouse.id;
    this.warehouse.code = warehouse.code;
    this.warehouse.name = warehouse.name;
    this.warehouse.glcode = warehouse.glcode;
    this.warehouse.subGlcode = warehouse.subGlcode;
    this.warehouse.isActive = warehouse.isActive;
    this.fbwarehouse.setValue(this.warehouse);
    this.addFlag = false;
    this.showDialog = true;
    this.submitLabel = 'Update Warehouse';
  }

  saveWarehouse(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.billmasterService.CreateWareHouse(this.fbwarehouse.value);
    else return this.billmasterService.UpdateWareHouse(this.fbwarehouse.value);
  }
  onSubmit() {
    if (this.fbwarehouse.valid) {
      if (this.addFlag) {
        var oldWareHouse = this.warehouses.filter(x => x.code == this.fbwarehouse.value.code && x.id != this.fbwarehouse.value.id)
        if (oldWareHouse.length > 0) {
          this.alertMessage.displayErrorMessage(ALERT_CODES["SMBMWH003"]);
        }
        else this.save();
      }
      else this.save();
    }
    else {
      this.fbwarehouse.markAllAsTouched();
    }
  }
  save() {
    this.saveWarehouse().subscribe((resp) => {
      if (resp) {
        this.loadwarehouses();
        this.fbwarehouse.reset();
        this.showDialog = false;
        this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMBMWH001" : "SMBMWH002"]);
      }
    });
  }

}
