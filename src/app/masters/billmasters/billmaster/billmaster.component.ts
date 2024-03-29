import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { LookupService } from 'src/app/_services/lookup.service';
import { BillMasterService } from 'src/app/_services/billmaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { BillViewDto } from 'src/app/_models/billingmaster';
import { FORMAT_DATE, MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { JWTService } from 'src/app/_services/jwt.service';
import { DateValidators } from 'src/app/_validators/dateRangeValidator';
import { ITableHeader } from 'src/app/_models/common';
import { CURRENT_SEASON } from 'src/environments/environment';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { SeasonDto } from 'src/app/_models/applicationmaster';

@Component({
  selector: 'app-billmaster',
  templateUrl: './billmaster.component.html',
  styles: [
  ]
})
export class BillMasterComponent implements OnInit {
  bills: BillViewDto[] = [];
  globalFilterFields: string[] = ["billCategoryName", "billNo", "seasonCode", "fromDate", "toDate", "runDate", "isFinal", "isActive", "createdAt", "createdBy",
    "updatedAt", "updatedBy"];
  @ViewChild('filter') filter!: ElementRef;
  showDialog: boolean = false;
  submitLabel!: string;
  fbBillMaster!: FormGroup;
  seasons: any;
  permissions: any;
  addFlag: boolean = true;
  billCategories: any;
  mediumDate: string = MEDIUM_DATE;
  currentSeason: SeasonDto = {};

  headers: ITableHeader[] = [
    { field: 'billCategoryName', header: 'billCategoryName', label: 'Billing Category' },
    { field: 'billNo', header: 'billNo', label: 'Billing Number' },
    { field: 'seasonCode', header: 'seasonCode', label: 'Season Code' },
    { field: 'fromDate', header: 'fromDate', label: 'From Date' },
    { field: 'toDate', header: 'toDate', label: 'To Date' },
    { field: 'runDate', header: 'runDate', label: 'Run Date' },
    { field: 'isFinal', header: 'isFinal', label: 'Is Final' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ];

  constructor(private formbuilder: FormBuilder,
    private commonService: CommonService,
    private billmasterService: BillMasterService,
    private lookupService: LookupService,
    private appMasterservice: AppMasterService,
    private alertMessage: AlertMessage,
    private jwtService: JWTService) { }

  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    this.initBills();
    this.initLookupDetails();
    this.initCurrentSeason(CURRENT_SEASON());
    this.billmasterForm();
  }

  initLookupDetails() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp;
    });

    this.lookupService.BillCategories().subscribe((resp) => {
      this.billCategories = resp;
    });
  }

  initBills() {
    this.billmasterService.GetBills().subscribe((resp) => {
      this.bills = resp as unknown as BillViewDto[];
    });
  }

  initCurrentSeason(seasonCode: string) {
    this.appMasterservice.CurrentSeason(seasonCode).subscribe((resp) => {
      this.currentSeason = resp as SeasonDto;
    });
  }

  billmasterForm() {
    this.fbBillMaster = this.formbuilder.group({
      billId: [null],
      billNo: [null],
      categoryId: [null, (Validators.required)],
      seasonsId: [null, (Validators.required)],
      fromDate: [null, (Validators.required)],
      toDate: [null, (Validators.required)],
      isFinal: [true],
      isActive: [true]
    }, {
      validators: Validators.compose([
        DateValidators.dateRangeValidator('fromDate', 'toDate', { 'fromDate': true }),
      ])
    });
  }

  get FormControls() {
    return this.fbBillMaster.controls;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  addBill() {
    this.fbBillMaster.controls['isFinal'].setValue(true);
    this.fbBillMaster.controls['isActive'].setValue(true);
    this.fbBillMaster.controls['seasonsId'].setValue(this.currentSeason.seasonId);
    this.submitLabel = "Add Bill";
    this.addFlag = true;
    this.showDialog = true;
  }

  // saveBill(): Observable<HttpEvent<any>> {
  //   if (this.addFlag) return this.billmasterService.CreateBill(this.fbBillMaster.value)
  //   else return this.billmasterService.UpdateBill(this.fbBillMaster.value)
  // }

  onSubmit() {
    if (this.fbBillMaster.valid) {
      this.fbBillMaster.value.fromDate = FORMAT_DATE(this.fbBillMaster.value.fromDate);
      this.fbBillMaster.value.toDate = FORMAT_DATE(this.fbBillMaster.value.toDate);
      this.billmasterService.CreateBill(this.fbBillMaster.value).subscribe(resp => {
        if (resp) {
          this.initBills();
          this.fbBillMaster.reset();
          this.showDialog = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES["SMBMB001"]);
        }
      })
    }
    else {
      this.fbBillMaster.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.bills = [];
    this.seasons = [];
    this.billCategories = [];
  }

}
