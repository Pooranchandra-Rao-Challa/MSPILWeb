import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-billmaster',
  templateUrl: './billmaster.component.html',
  styles: [
  ]
})
export class BillMasterComponent implements OnInit {
  billMasters: any;
  loading: boolean = false;
  filter: any;
  showDialog: boolean = false;
  fbBillMaster!: FormGroup;

  constructor(private formbuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.billmasterForm();
  }

  billmasterForm() {
    this.fbBillMaster = this.formbuilder.group({
      category: ['', (Validators.required)],
      season: ['', (Validators.required)],
      fromDate: ['', (Validators.required)],
      toDate: ['', (Validators.required)],
      isFinal: [true, Validators.requiredTrue]
    });
  }

  get FormControls() {
    return this.fbBillMaster.controls;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  onSubmit() {
    if (this.fbBillMaster.valid) {
      console.log(this.fbBillMaster.value);
    }
    else {
      this.fbBillMaster.markAllAsTouched();
    }
  }

}
