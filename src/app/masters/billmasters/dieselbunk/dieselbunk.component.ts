import { BillMasterService } from 'src/app/_services/billmaster.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { DieselBunkViewDto } from 'src/app/_models/billingmaster';

@Component({
  selector: 'app-dieselbunk',
  templateUrl: './dieselbunk.component.html',
  styles: [
  ]
})
export class DieselBunkComponent implements OnInit {
  dieselBunks: DieselBunkViewDto[] = [];
  loading: boolean = true;
  filter: any;
  showDialog: boolean = false;
  fbDieselBunk!: FormGroup;

  constructor(private formbuilder: FormBuilder,
              private billmasterService: BillMasterService) { }

  ngOnInit(): void {
    this.billmasterService.GetDieselBunks().subscribe((resp) => {
      this.dieselBunks = resp as unknown as DieselBunkViewDto[];
      console.log(this.dieselBunks);
      this.loading = false;
    });
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
