import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-warehouse',
  templateUrl: './warehouse.component.html',
  styles: [
  ]
})
export class WareHouseComponent implements OnInit {
  wareHouse: any;
  loading: boolean = false;
  filter: any;
  showDialog: boolean = false;
  fbWareHouse!: FormGroup;

  constructor(private formbuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.dieselRateForm();
  }

  dieselRateForm() {
    this.fbWareHouse = this.formbuilder.group({
      code: ['', (Validators.required)],
      name: ['', (Validators.required)],
      glcode: ['', (Validators.required)],
      subglcode: ['', Validators.required],
      isActive: [true, Validators.requiredTrue]
    });
  }

  get FormControls() {
    return this.fbWareHouse.controls;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  onSubmit() {
    if (this.fbWareHouse.valid) {
      console.log(this.fbWareHouse.value);
    }
    else {
      this.fbWareHouse.markAllAsTouched();
    }
  }

}
