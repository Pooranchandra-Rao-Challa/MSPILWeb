import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-billparameters',
  templateUrl: './billparameters.component.html',
  styles: [
  ]
})
export class BillParametersComponent implements OnInit {
  billParameters: any;
  loading: boolean = false;
  filter: any;
  showDialog: boolean = false;
  fbBillParameters!: FormGroup;

  constructor(private formbuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.billmasterForm();
  }

  billmasterForm() {
    this.fbBillParameters = this.formbuilder.group({
      category: ['', (Validators.required)],
      type: ['', (Validators.required)],
      code: ['', (Validators.required)],
      name: ['', (Validators.required)],
      calcType: ['', Validators.required],
      priority: ['', Validators.required],
      formula: ['', Validators.required],
      isActive: [true, Validators.requiredTrue]
    });
  }

  get FormControls() {
    return this.fbBillParameters.controls;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  onSubmit() {
    if (this.fbBillParameters.valid) {
      console.log(this.fbBillParameters.value);
    }
    else {
      this.fbBillParameters.markAllAsTouched();
    }
  }

}
