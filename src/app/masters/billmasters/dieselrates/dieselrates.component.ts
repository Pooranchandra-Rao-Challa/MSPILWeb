import { BillMasterService } from 'src/app/_services/billmaster.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { DieselRateViewDto, DieselRateDto } from 'src/app/_models/billingmaster';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-dieselrates',
  templateUrl: './dieselrates.component.html',
  styles: [
  ]
})
export class DieselRatesComponent implements OnInit {
  globalFilterFields: string[] = ['fromDate','toDate','rate','createdAt','createdByUser','updatedAt','updatedByUser'];
  dieselRates: DieselRateViewDto[] = [];
  dieselRate: DieselRateDto = new DieselRateDto();
  loading: boolean = false;
  addFlag: boolean = true;
  filter: any;
  showDialog: boolean = false;
  fbDieselRate!: FormGroup;
  value?: Date;

  constructor(private formbuilder: FormBuilder,
    private billMasterService: BillMasterService,
    private datepipe: DatePipe) { }

  ngOnInit(): void {
    this.value = new Date();
    this.loadDieselRates();
    this.dieselRateForm();
  }

  loadDieselRates() {
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
      isActive: [true, Validators.requiredTrue]
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

  editDieselRate(dieselRate: DieselRateViewDto) {
    debugger
    this.dieselRate.id = dieselRate.id;
    this.dieselRate.fromDate = dieselRate.fromDate;
    // this.dieselRate.fromDate = this.datepipe.transform(dieselRate.fromDate, "yyyy-MM-dd");
    this.dieselRate.toDate = dieselRate.toDate;
    this.dieselRate.rate = dieselRate.rate;
    this.dieselRate.isActive = dieselRate.isActive;
    this.fbDieselRate.setValue(this.dieselRate);
    console.log(this.fbDieselRate.value.fromDate);

    this.addFlag = false;
    this.showDialog = true;
  }

  saveBillParam(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.billMasterService.CreateDieselRate(this.fbDieselRate.value)
    else return this.billMasterService.UpdateDieselRate(this.fbDieselRate.value)
  }

  onSubmit() {
    debugger
    if (this.fbDieselRate.valid) {
      console.log(this.fbDieselRate.value);
      this.saveBillParam().subscribe(resp => {
        if (resp) {
          this.loadDieselRates();
          this.fbDieselRate.reset();
          this.showDialog = false;
        }
      })
    }
    else {
      this.fbDieselRate.markAllAsTouched();
    }
  }

}
