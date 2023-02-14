import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styles: [
  ]
})
export class BankComponent implements OnInit {

  display: boolean = false;
  showDialog: boolean=false;
  lookup: [] = [];
  filter: any;
  dataShown:boolean=false;
  addfields:any;
  loading: boolean = false;
  fbbank!:FormGroup
  constructor(private formbuilder:FormBuilder) { }
 
  get FormControls() {
    return this.fbbank.controls;
  }
  ngOnInit(): void { 
    this.lookupForm(); 
  }
  lookupForm() {
    this.addfields=[]
    this.fbbank= this.formbuilder.group({
      code:['', (Validators.required)],
      name: ['', (Validators.required)],
      abbr: ['', ],
      isActive:[true, Validators.required],
      codedtl:[''],
      namedtl:[''],
      ifsc:[''],
     
    });
  }
  
  onSubmit() {
    if (this.fbbank.valid) {
       console.log(this.fbbank.value)
    }
    else {
      // alert("please fill the fields")
      this.fbbank.markAllAsTouched();
    }
  }
  showData(){
    this.dataShown=true;  
    this.addfields.push(this.fbbank.value)
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value='';
  }
}
