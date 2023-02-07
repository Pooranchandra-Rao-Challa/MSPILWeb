import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-weed',
  templateUrl: './weed.component.html',
  styles: [
  ]
})
export class WeedComponent implements OnInit {

  representatives:any
  dataShown = false;
  dieselBunks:any
  fbweed:any
  display:any
  loading: boolean = false;
  filter: any;
  showDialog: boolean=false

  showData() {
    this.dataShown = true;
  }

  constructor(private formbuilder: FormBuilder,) { }

  ngOnInit(): void {
    this.weedForm();
  }

  valSwitch:boolean = false;

  get FormControals(){
    return this.fbweed.controls
  }

  weedForm() {
    this.fbweed = this.formbuilder.group({
      Code:  new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      Name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      isActive: [true, Validators.requiredTrue]
    });
  }

  get FormControls() {
    return this.fbweed.controls;
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  onSubmit() {
    if (this.fbweed.valid) {
      console.log(this.fbweed.value);
    }
    else {
      this.fbweed.markAllAsTouched();
    }
  }
}
