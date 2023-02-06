import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-loanmaster',
  templateUrl: './loanmaster.component.html',
  styles: [
  ]
})

export class LoanMasterComponent implements OnInit {

  representatives:any
  dataShown = false;
  dieselBunks:any
  LoanType:any
  cities:any=[];
  selectedDrop: any;
  display:any
  loantypes: any;
  loading: boolean = false;
  filter: any;
  showDialog: boolean = false;
  fbloantype!: FormGroup;
  value1:any;
 
  selectedCity2: any;

 options = [
    {name: 'New York', code: 'NY'},
    {name: 'Rome', code: 'RM'},
    {name: 'London', code: 'LDN'},
    {name: 'Istanbul', code: 'IST'},
    {name: 'Paris', code: 'PRS'}
];



  showData() {
    this.dataShown = true;
  }

  constructor(private formbuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.LoanTypeForm();
  }

  valSwitch:boolean = false;

  get FormControals(){
    return this.loantypes.controls
  }

  LoanTypeForm() {
    this.fbloantype = this.formbuilder.group({
      Category: ['', (Validators.required)],
      Code: ['', (Validators.required)],
      Name: ['', (Validators.required)],
      IntrestRate: ['', (Validators.required)],
      GLCode: ['', (Validators.required)],
      SubGLcode: ['', (Validators.required)],
      isActive: [true, Validators.requiredTrue]
    });
  }

  get FormControls() {
    return this.fbloantype.controls;
  }

  

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  onSubmit() {
    if (this.fbloantype.valid) {
      console.log(this.fbloantype.value);
    }
    else {
      this.fbloantype.markAllAsTouched();
    }
  }
}
