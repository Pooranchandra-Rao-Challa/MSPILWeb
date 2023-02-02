import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-dieselbunk',
  templateUrl: './dieselbunk.component.html',
  styles: [
  ]
})
export class DieselBunkComponent implements OnInit {
  dieselBunks: any;
  loading: boolean = false;
  filter: any;
  showDialog: boolean = false;
  fbDieselBunk!: FormGroup;

  constructor(private formbuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.dieselRateForm();
  }

  dieselRateForm() {
    this.fbDieselBunk = this.formbuilder.group({
      code: ['', (Validators.required)],
      name: ['', (Validators.required)],
      address: ['', (Validators.required)],
      pinCode: ['', (Validators.required)],
      phoneNo: [''],
      email: [''],
      glcode: [''],
      subglcode: [''],
      rate: ['', (Validators.required)],
      isActive: [true, Validators.requiredTrue]
    });
  }

  get FormControls() {
    return this.fbDieselBunk.controls;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  onSubmit() {
    if (this.fbDieselBunk.valid) {
      console.log(this.fbDieselBunk.value);
    }
    else {
      this.fbDieselBunk.markAllAsTouched();
    }
  }

}
