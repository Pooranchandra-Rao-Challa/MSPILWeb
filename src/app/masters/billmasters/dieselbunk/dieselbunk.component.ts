import { DieselBunkDto } from './../../../_models/billingmaster';
import { BillMasterService } from 'src/app/_services/billmaster.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { DieselBunkViewDto } from 'src/app/_models/billingmaster';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';

@Component({
  selector: 'app-dieselbunk',
  templateUrl: './dieselbunk.component.html',
  styles: [
  ]
})
export class DieselBunkComponent implements OnInit {
  dieselBunks: DieselBunkViewDto[] = [];
  dieselBunk: DieselBunkDto = new DieselBunkDto();
  loading: boolean = true;
  filter: any;
  showDialog: boolean = false;
  fbDieselBunk!: FormGroup;
  addFlag: boolean = true;

  constructor(private formbuilder: FormBuilder,
    private billmasterService: BillMasterService) { }

  ngOnInit(): void {
    this.loadDieselBunks();
    this.dieselRateForm();
  }

  loadDieselBunks() {
    this.billmasterService.GetDieselBunks().subscribe((resp) => {
      this.dieselBunks = resp as unknown as DieselBunkViewDto[];
      console.log(this.dieselBunks);
      this.loading = false;
    });
  }

  dieselRateForm() {
    this.fbDieselBunk = this.formbuilder.group({
      id: [0],
      code: ['', (Validators.required)],
      name: ['', (Validators.required)],
      address: ['', (Validators.required)],
      pinCode: ['', (Validators.required)],
      phoneNo: [''],
      email: [''],
      gLcode: [''],
      subGLcode: [''],
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

  editDieselBunk(dieselBunk: DieselBunkViewDto) {
    debugger
    this.dieselBunk.id = dieselBunk.id;
    this.dieselBunk.code = dieselBunk.code;
    this.dieselBunk.name = dieselBunk.name;
    this.dieselBunk.address = dieselBunk.address;
    this.dieselBunk.pinCode = dieselBunk.pinCode;
    this.dieselBunk.phoneNo = dieselBunk.phoneNo;
    this.dieselBunk.email = dieselBunk.email;
    this.dieselBunk.gLcode = dieselBunk.glCode;
    this.dieselBunk.subGLcode = dieselBunk.subGLCode;
    this.dieselBunk.rate = dieselBunk.rate;
    this.dieselBunk.isActive = dieselBunk.isActive;
    this.fbDieselBunk.setValue(this.dieselBunk);
    this.addFlag = false;
    this.showDialog = true;
  }

  saveBillParam(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.billmasterService.CreateDieselBunk(this.fbDieselBunk.value)
    else return this.billmasterService.UpdateDieselBunk(this.fbDieselBunk.value)
  }

  onSubmit() {
    debugger
    if (this.fbDieselBunk.valid) {
      console.log(this.fbDieselBunk.value);
      this.saveBillParam().subscribe(resp => {
        if (resp) {
          this.loadDieselBunks();
          this.fbDieselBunk.reset();
          this.showDialog = false;
        }
      })
    }
    else {
      this.fbDieselBunk.markAllAsTouched();
    }
  }

}
