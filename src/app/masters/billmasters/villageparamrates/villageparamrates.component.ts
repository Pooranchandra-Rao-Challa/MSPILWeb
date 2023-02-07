import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-villageparamrates',
  templateUrl: './villageparamrates.component.html',
  styles: ['.p-dropdown{ width: 100% }']
})
export class VillageParamRatesComponent implements OnInit {
  showDialog: boolean = false;
  loading: boolean = false;
  villageParamRates: any;
  globalFilterFields: any;
  @ViewChild('filter') filter!: ElementRef;
  fbVillageParamRate!: FormGroup;

  constructor(private formbuilder: FormBuilder) { }

  ngOnInit(): void {
    this.villageParamRateForm();
  }

  villageParamRateForm() {
    this.fbVillageParamRate = this.formbuilder.group({
      id: [0],
      seasonCode: ['', (Validators.required)],
      village: ['', (Validators.required)],
      villageName: ['', (Validators.required)],
      villageId: ['', (Validators.required)],
      billParam: ['', (Validators.required)],
      rate: ['', Validators.required]
    });
  }

  get FormControls() {
    return this.fbVillageParamRate.controls;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  onSubmit() {
    console.log();

  }

}
