import { BillMasterService } from 'src/app/_services/billmaster.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { DieselRateViewDto, DieselRateDto } from 'src/app/_models/billingmaster';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';

@Component({
  selector: 'app-dieselrates',
  templateUrl: './dieselrates.component.html',
  styles: [
  ]
})
export class DieselRatesComponent implements OnInit {
  globalFilterFields: string[] = ['fromDate', 'toDate', 'rate', 'isActive', 'createdAt', 'createdByUser', 'updatedAt', 'updatedByUser'];
  dieselRates: DieselRateViewDto[] = [];
  dieselRate: DieselRateDto = new DieselRateDto();
  loading: boolean = false;
  addFlag: boolean = true;
  filter: any;
  showDialog: boolean = false;
  fbDieselRate!: FormGroup;
  submitLabel!: string;
  // short_Date: string = SHORT_DATE;
  // medium_Date: string = MEDIUM_DATE;
  // long_Date: string = LONG_DATE;

  constructor(private formbuilder: FormBuilder,
    private billMasterService: BillMasterService) { }

  ngOnInit(): void {
    this.initDieselRates();
    this.dieselRateForm();
  }

  initDieselRates() {
    this.billMasterService.GetDieselRates().subscribe((resp) => {
      this.dieselRates = resp as unknown as DieselRateViewDto[];
    });
  }

  dieselRateForm() {
    this.fbDieselRate = this.formbuilder.group({
      id: [0],
      fromDate: ['', (Validators.required)],
      toDate: ['', (Validators.required)],
      rate: ['', (Validators.required)],
      isActive: [true]
    });
  }

  get FormControls() {
    return this.fbDieselRate.controls;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  addDieselRate() {
    this.submitLabel = "Add Diesel Rate";
    this.addFlag = true;
    this.showDialog = true;
  }

  editDieselRate(dieselRate: DieselRateViewDto) {
    this.dieselRate.id = dieselRate.id;
    this.dieselRate.fromDate = new Date(dieselRate.fromDate?.toString() + "");
    this.dieselRate.toDate = new Date(dieselRate.toDate?.toString() + "");
    this.dieselRate.rate = dieselRate.rate;
    this.dieselRate.isActive = dieselRate.isActive;
    this.fbDieselRate.setValue(this.dieselRate);
    this.addFlag = false;
    this.submitLabel = "Update Diesel Rate";
    this.showDialog = true;
  }

  saveBillParam(): Observable<HttpEvent<any>> {
    this.fbDieselRate.value.fromDate = new Date(Date.UTC(this.fbDieselRate.value.fromDate.getFullYear(),
      this.fbDieselRate.value.fromDate.getMonth(),
      this.fbDieselRate.value.fromDate.getDate(),
      this.fbDieselRate.value.fromDate.getHours(),
      this.fbDieselRate.value.fromDate.getMinutes(),
      this.fbDieselRate.value.fromDate.getSeconds()));
    if (this.addFlag) return this.billMasterService.CreateDieselRate(this.fbDieselRate.value)
    else return this.billMasterService.UpdateDieselRate(this.fbDieselRate.value)
  }

  onSubmit() {
    if (this.fbDieselRate.valid) {
      this.saveBillParam().subscribe(resp => {
        if (resp) {
          this.initDieselRates();
          this.fbDieselRate.reset();
          this.showDialog = false;
        }
      })
    }
    else {
      this.fbDieselRate.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.dieselRates = [];
    this.dieselRate = new DieselRateDto();
  }

}
