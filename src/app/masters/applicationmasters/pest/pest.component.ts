import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-pest',
  templateUrl: './pest.component.html',
  styles: [
  ]
})
export class PestComponent implements OnInit {

  representatives:any
  dataShown = false;
  fbpest:any
  display:any
  loading: boolean = false;
  filter: any;
  showDialog: boolean=false
  selectedCity2: any;

  constructor(private formbuilder: FormBuilder,) { }


  showData() {
    this.dataShown = true;
  }

  ngOnInit(): void {
    this.PestForm();
  }

  valSwitch:boolean = false;

  get FormControals(){
    return this.fbpest.controls
  }

  PestForm() {
    this.fbpest = this.formbuilder.group({
      Code:  new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      Name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      isActive: [true, Validators.requiredTrue]
    });
  }

  get FormControls() {
    return this.fbpest.controls;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  onSubmit() {
    if (this.fbpest.valid) {
      console.log(this.fbpest.value);
    }
    else {
      this.fbpest.markAllAsTouched();
    }
  }

}
