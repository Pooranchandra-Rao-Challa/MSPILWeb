import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-plantsubtype',
  templateUrl: './plantsubtype.component.html',
  styles: [
  ]
})
export class PlantsubtypeComponent implements OnInit {
  fbplantsubtype!:FormGroup;
  showDialog: boolean = false;
  submitLabel!: string;
  addFlag: boolean = true;
  loading: boolean = false;
  filter: any;
  
  constructor(private formbuilder: FormBuilder,) { }
  get FormControls() {
    return this.fbplantsubtype.controls;
  }
  initPlantsub() {
    this.fbplantsubtype.reset();
    this.submitLabel = "Add Plant Sub Type";
    this.addFlag = true;
    this.showDialog = true;
  }
  ngOnInit(): void {
    this. plantSubTypeForm();
  }
  plantSubTypeForm(){
    this.fbplantsubtype = this.formbuilder.group({
      plantTypeId:[0],
      Planttypeid: ['', Validators.required],
      code: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
      name: new FormControl('', [Validators.required, Validators.pattern(('[a-zA-Z ]*'))]),
      isActive:true
    });
  }
  onSubmit() {
    if (this.fbplantsubtype.valid) {
      
    }
    else {
      // alert("please fill the fields")
      this.fbplantsubtype.markAllAsTouched();
    }
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  } 

}
