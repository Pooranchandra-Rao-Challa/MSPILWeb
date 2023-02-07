import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-fertilizer',
  templateUrl: './fertilizer.component.html',
  styles: [
  ]
})
export class FertilizerComponent implements OnInit {

  representatives:any
  dataShown = false;
  dieselBunks:any
  fbfertilizer:any
  display:any
  loading: boolean = false;
  filter: any;
  showDialog: boolean=false;
  valSwitch:boolean = false;

  constructor(private formbuilder: FormBuilder,) { }


  showData() {
    this.dataShown = true;
  }

  ngOnInit(): void {
    this.PestForm();
  }

  get FormControals(){
    return this.fbfertilizer.controls
  }

  PestForm() {
    this.fbfertilizer = this.formbuilder.group({
      Code:  new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      Name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      isActive: [true, Validators.requiredTrue]
    });
  }

  get FormControls() {
    return this.fbfertilizer.controls;
  }

  

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  onSubmit() {
    if (this.fbfertilizer.valid) {
      console.log(this.fbfertilizer.value);
    }
    else {
      this.fbfertilizer.markAllAsTouched();
    }
  }

}
