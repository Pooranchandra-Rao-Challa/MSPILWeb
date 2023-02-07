import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-disease',
  templateUrl: './disease.component.html',
  styles: [
  ]
})
export class DiseaseComponent implements OnInit {

  representatives:any
  dataShown = false;
  fbdisease:any
  display:any
  loading: boolean = false;
  filter: any;
  showDialog: boolean=false

  constructor(private formbuilder: FormBuilder) { }

  showData() {
    this.dataShown = true;
  }

  ngOnInit(): void {
    this.weedForm();
  }

  valSwitch:boolean = false;

  get FormControals(){
    return this.fbdisease.controls
  }

  weedForm() {
    this.fbdisease = this.formbuilder.group({
      Code:  new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      Name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      isActive: [true, Validators.requiredTrue]
    });
  }

  get FormControls() {
    return this.fbdisease.controls;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  onSubmit() {
    if (this.fbdisease.valid) {
      console.log(this.fbdisease.value);
    }
    else {
      this.fbdisease.markAllAsTouched();
    }
  }

}
