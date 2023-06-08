import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { BillMasterService } from 'src/app/_services/billmaster.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { DieselRateViewDto, DieselRateDto } from 'src/app/_models/billingmaster';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { FORMAT_DATE, MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { JWTService } from 'src/app/_services/jwt.service';
import { DateValidators } from 'src/app/_validators/dateRangeValidator';
import { ITableHeader } from 'src/app/_models/common';
import { RG_DECIMAL } from 'src/app/_shared/regex';

@Component({
  selector: 'app-dieselrates',
  templateUrl: './dieselrates.component.html',
  styles: [
  ]
})
export class DieselRatesComponent implements OnInit {
  globalFilterFields: string[] = ['fromDate', 'toDate', 'rate', 'isActive', 'createdAt', 'createdByUser', 'updatedAt', 'updatedByUser'];
  dieselRates: DieselRateViewDto[] = [];
  dieselRate: DieselRateDto = new DieselRateDto();
  addFlag: boolean = true;
  @ViewChild('filter') filter!: ElementRef;
  showDialog: boolean = false;
  fbDieselRate!: FormGroup;
  submitLabel!: string;
  mediumDate: string = MEDIUM_DATE;
  permissions: any;
  headers: ITableHeader[] = [
    { field: 'fromDate', header: 'fromDate', label: 'From Date' },
    { field: 'toDate', header: 'toDate', label: 'To Date' },
    { field: 'rate', header: 'rate', label: 'Rate' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdByUser', header: 'createdByUser', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedByUser', header: 'updatedByUser', label: 'Updated By' },
  ];

  constructor(private formbuilder: FormBuilder,
    private billMasterService: BillMasterService,
    private alertMessage: AlertMessage,
    private jwtService: JWTService) { }

  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    this.initDieselRates();
    this.dieselRateForm();
  }

  initDieselRates() {
    this.billMasterService.GetDieselRates().subscribe((resp) => {
      this.dieselRates = resp as unknown as DieselRateViewDto[];
    });
  }

  dieselRateForm() {
    this.fbDieselRate = this.formbuilder.group({
      id: [null],
      fromDate: [null, (Validators.required)],
      toDate: [null, (Validators.required)],
      rate: [null, [Validators.required, Validators.pattern(RG_DECIMAL)]],
      isActive: [null]
    }, {
      validators: Validators.compose([
        DateValidators.dateRangeValidator('fromDate', 'toDate', { 'fromDate': true }),
      ])
    });
  }

  get FormControls() {
    return this.fbDieselRate.controls;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  // filterInput(event: any) {
  //   const initialValue = event.target.value;
  //   const filteredValue = initialValue.replace(/[^0-9.]/g, '').replace(/(\.\d{0,2}).*/g, '$1');
  //   if (initialValue !== filteredValue) {
  //     event.target.value = filteredValue;
  //   }
  // }  

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  addDieselRate() {
    this.fbDieselRate.controls['isActive'].setValue(true);
    this.submitLabel = "Add Diesel Rate";
    this.addFlag = true;
    this.showDialog = true;
  }

  editDieselRate(dieselRate: DieselRateViewDto) {
    this.dieselRate.id = dieselRate.id;
    this.dieselRate.fromDate = new Date(dieselRate.fromDate?.toString() + "");
    this.dieselRate.toDate = new Date(dieselRate.toDate?.toString() + "");
    this.dieselRate.rate = dieselRate.rate;
    this.dieselRate.isActive = dieselRate.isActive;
    this.fbDieselRate.setValue(this.dieselRate);
    this.addFlag = false;
    this.submitLabel = "Update Diesel Rate";
    this.showDialog = true;
  }

  saveBillParam(): Observable<HttpEvent<any>> {
    this.fbDieselRate.value.fromDate = FORMAT_DATE(this.fbDieselRate.value.fromDate);
    this.fbDieselRate.value.toDate = FORMAT_DATE(this.fbDieselRate.value.toDate);
    if (this.addFlag) return this.billMasterService.CreateDieselRate(this.fbDieselRate.value)
    else return this.billMasterService.UpdateDieselRate(this.fbDieselRate.value)
  }

  onSubmit() {
    if (this.fbDieselRate.valid) {
      this.saveBillParam().subscribe(resp => {
        if (resp) {
          this.initDieselRates();
          this.fbDieselRate.reset();
          this.showDialog = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMBMDR001" : "SMBMDR002"]);
        }
      })
    }
    else {
      this.fbDieselRate.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.dieselRates = [];
    this.dieselRate = new DieselRateDto();
  }

}
