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
import { MAX_LENGTH_20, MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY } from 'src/app/_shared/regex';
import { MaxLength } from 'src/app/_models/common';
import { ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { AlertMessage } from '../../../_alerts/alertMessage';

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
  maxLength: MaxLength = new MaxLength();

  constructor(
    private formbuilder: FormBuilder,
    private billmasterService: BillMasterService,
    private alertMessage:AlertMessage
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
      code:new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      name:new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      isActive: new FormControl(true, Validators.required),
      glcode:['', Validators.pattern(RG_ALPHA_NUMERIC)],
      subGlcode:['', Validators.pattern(RG_ALPHA_NUMERIC)],
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
      this.saveWarehouse().subscribe((resp) => {
        if (resp) {
          this.loadwarehouses();
          this.fbwarehouse.reset();
          this.showDialog = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMBMWH001" : "SMBMWH002"]);
        }
      });
    } else {
      this.fbwarehouse.markAllAsTouched();
    }
  }
}
