import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-distancerateslab',
  templateUrl: './distancerateslab.component.html',
  styles: [
  ]
})
export class DistanceRateSlabComponent implements OnInit {
  showDialog: boolean = false;
  loading: boolean = false;
  distanceRates: any;
  globalFilterFields: any;
  @ViewChild('filter') filter!: ElementRef;
  fbDistanceRate!: FormGroup;

  constructor(private formbuilder: FormBuilder) { }

  ngOnInit(): void {
    this.distanceRateForm();
  }

  distanceRateForm() {
    this.fbDistanceRate = this.formbuilder.group({
      id: [0],
      distance: ['', (Validators.required)],
      rate: ['', (Validators.required)],
      isActive: [true, Validators.requiredTrue]
    });
  }

  get FormControls() {
    return this.fbDistanceRate.controls;
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
