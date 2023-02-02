import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-dieselrates',
  templateUrl: './dieselrates.component.html',
  styles: [
  ]
})
export class DieselRatesComponent implements OnInit {
  dieselRates: any;
  loading: boolean = false;
  filter: any;
  showDialog: boolean = false;
  fbDieselRate!: FormGroup;

  constructor(private formbuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.dieselRateForm();
  }

  dieselRateForm() {
    this.fbDieselRate = this.formbuilder.group({
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

  onSubmit() {
    if (this.fbDieselRate.valid) {
      console.log(this.fbDieselRate.value);
    }
    else {
      this.fbDieselRate.markAllAsTouched();
    }
  }

}
