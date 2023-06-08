import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { BillMasterService } from 'src/app/_services/billmaster.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { Table } from 'primeng/table';
import { DistanceRateDto, DistanceRateViewDto } from 'src/app/_models/billingmaster';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { JWTService } from 'src/app/_services/jwt.service';
import { ITableHeader } from 'src/app/_models/common';
import { RG_DECIMAL } from 'src/app/_shared/regex';

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
  permissions: any;
  headers: ITableHeader[] = [
    { field: 'distance', header: 'distance', label: 'Distance(KM)' },
    { field: 'rate', header: 'rate', label: 'Rate' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ];

  constructor(private formbuilder: FormBuilder,
    private billMasterService: BillMasterService,
    private alertMessage: AlertMessage,
    private jwtService: JWTService) { }

  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
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
      rate: [null, [Validators.required, Validators.pattern(RG_DECIMAL)]],
      isActive: [null]
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
    this.fbDistanceRate.controls['isActive'].setValue(true);
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

  isUniqueDistanceRateCode() {
    const existingDistrictCodes = this.distanceRates.filter(BillParameter => 
      BillParameter.distance === this.fbDistanceRate.value.distance && 
      BillParameter.id !== this.fbDistanceRate.value.id
    )
    return existingDistrictCodes.length > 0; 
  }
  
  onSubmit() {
    if (this.fbDistanceRate.valid) {
      if (this.addFlag) {
        if (this.isUniqueDistanceRateCode()) {
          this.alertMessage.displayErrorMessage(
            `DistanceRate Code :'${this.fbDistanceRate.value.distance}' already exists.`
          );
        } else {
          this.save();
        }
      } else {
        this.save(); 
      }
    } else {
      this.fbDistanceRate.markAllAsTouched(); 
    }
  }
  save() {
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
