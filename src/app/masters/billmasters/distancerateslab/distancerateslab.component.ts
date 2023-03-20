import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { BillMasterService } from 'src/app/_services/billmaster.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Table } from 'primeng/table';
import { DistanceRateDto, DistanceRateViewDto } from 'src/app/_models/billingmaster';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';

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
  globalFilterFields: string[] = ['distance', 'rate', 'isActive', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy'];
  @ViewChild('filter') filter!: ElementRef;
  fbDistanceRate!: FormGroup;
  addFlag: boolean = true;
  submitLabel!: string;
  mediumDate: string = MEDIUM_DATE;

  constructor(private formbuilder: FormBuilder,
    private billMasterService: BillMasterService,
    private alertMessage: AlertMessage) { }

  ngOnInit(): void {
    this.initDistanceRates();
    this.distanceRateForm();
  }

  initDistanceRates() {
    this.billMasterService.GetDistanceRates().subscribe((resp) => {
      this.distanceRates = resp as unknown as DistanceRateViewDto[];
    });
  }

  distanceRateForm() {
    this.fbDistanceRate = this.formbuilder.group({
      id: [null],
      distance: [null, (Validators.required)],
      rate: [null, (Validators.required)],
      isActive: [true]
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

  addDistanceRate() {
    this.submitLabel = "Add Distance Rate";
    this.addFlag = true;
    this.showDialog = true;
  }

  editDistanceRate(distanceRate: DistanceRateViewDto) {
    this.distanceRate.id = distanceRate.id;
    this.distanceRate.distance = distanceRate.distance;
    this.distanceRate.rate = distanceRate.rate;
    this.distanceRate.isActive = distanceRate.isActive;
    this.fbDistanceRate.setValue(this.distanceRate);
    this.addFlag = false;
    this.submitLabel = "Update Distance Rate";
    this.showDialog = true;
  }

  saveBillParam(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.billMasterService.CreateDistanceRate(this.fbDistanceRate.value)
    else return this.billMasterService.UpdateDistanceRate(this.fbDistanceRate.value)
  }

  onSubmit() {
    if (this.fbDistanceRate.valid) {
      this.saveBillParam().subscribe(resp => {
        if (resp) {
          this.initDistanceRates();
          this.fbDistanceRate.reset();
          this.showDialog = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMBMDTR001" : "SMBMDTR002"]);
        }
      })
    }
    else {
      this.fbDistanceRate.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.distanceRates = [];
    this.distanceRate = new DistanceRateDto();
  }

}
