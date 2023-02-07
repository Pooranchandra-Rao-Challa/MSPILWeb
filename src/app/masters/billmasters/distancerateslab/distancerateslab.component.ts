import { BillMasterService } from 'src/app/_services/billmaster.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Table } from 'primeng/table';
import { DistanceRateDto, DistanceRateViewDto } from 'src/app/_models/billingmaster';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';

@Component({
  selector: 'app-distancerateslab',
  templateUrl: './distancerateslab.component.html',
  styles: [
  ]
})
export class DistanceRateSlabComponent implements OnInit {
  distanceRates: DistanceRateViewDto[] = [];
  distanceRate: DistanceRateDto = new DistanceRateDto();
  showDialog: boolean = false;
  loading: boolean = true;
  globalFilterFields: string[] = ['distance', 'rate', 'isActive', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy'];
  @ViewChild('filter') filter!: ElementRef;
  fbDistanceRate!: FormGroup;
  addFlag: boolean = true;

  constructor(private formbuilder: FormBuilder,
    private billMasterService: BillMasterService) { }

  ngOnInit(): void {
    this.loadDistanceRates();
    this.distanceRateForm();
  }

  loadDistanceRates() {
    this.billMasterService.GetDistanceRates().subscribe((resp) => {
      this.distanceRates = resp as unknown as DistanceRateViewDto[];
      this.loading = false;
    });
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

  editDistanceRate(distanceRate: DistanceRateViewDto) {
    this.distanceRate.id = distanceRate.id;
    this.distanceRate.distance = distanceRate.distance;
    this.distanceRate.rate = distanceRate.rate;
    this.distanceRate.isActive = distanceRate.isActive;
    this.fbDistanceRate.setValue(this.distanceRate);
    this.addFlag = false;
    this.showDialog = true;
  }

  saveBillParam(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.billMasterService.CreateDistanceRate(this.fbDistanceRate.value)
    else return this.billMasterService.UpdateDistanceRate(this.fbDistanceRate.value)
  }

  onSubmit() {
    debugger
    if (this.fbDistanceRate.valid) {
      console.log(this.fbDistanceRate.value);
      this.saveBillParam().subscribe(resp => {
        if (resp) {
          this.loadDistanceRates();
          this.fbDistanceRate.reset();
          this.showDialog = false;
        }
      })
    }
    else {
      this.fbDistanceRate.markAllAsTouched();
    }
  }

}
