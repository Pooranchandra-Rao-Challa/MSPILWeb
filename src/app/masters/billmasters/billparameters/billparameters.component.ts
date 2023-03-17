import { AlertMessage, ALERT_CODES } from './../../../_alerts/alertMessage';
import { MessageService } from 'primeng/api';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RG_ALPHA_NUMERIC, RG_ALPHA_ONLY, RG_NUMERIC_ONLY } from 'src/app/_shared/regex';
import { BillParameterDto, BillParameterViewDto } from 'src/app/_models/billingmaster';
import { BillMasterService } from 'src/app/_services/billmaster.service';
import { MAX_LENGTH_10, MIN_LENGTH_2 } from 'src/app/_shared/regex';
import { LookupService } from 'src/app/_services/lookup.service';
import { HttpEvent } from '@angular/common/http';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { MaxLength } from 'src/app/_models/common';

@Component({
  selector: 'app-billparameters',
  templateUrl: './billparameters.component.html',
  styles: [
  ],
})
export class BillParametersComponent implements OnInit {
  billParameters: BillParameterViewDto[] = [];
  billParam: BillParameterDto = new BillParameterDto();
  loading: boolean = true;
  @ViewChild('filter') filter!: ElementRef;
  showDialog: boolean = false;
  fbBillParameters!: FormGroup;
  addFlag: boolean = true;
  globalFilterFields: string[] = ['id', 'type', 'code', 'name', 'caluclationType', 'formula', 'priority', 'isActive', 'createdAt', 'createdByUser',
    'updatedAt', 'updatedByUser'];
  submitLabel!: string;
  billCategories: any;
  types: { label: string; value: string; }[];
  calTypes: { label: string; value: string; }[];
  mediumDate: string = MEDIUM_DATE;
  maxLength: MaxLength = new MaxLength();

  constructor(private formbuilder: FormBuilder,
    private billmasterService: BillMasterService,
    private lookupService: LookupService,
    private alertMessage: AlertMessage) {
    this.calTypes = [
      { label: 'FIXED', value: 'Fixed' },
      { label: 'NETWEIGHT', value: 'NetWeight' },
      { label: 'TOTALWEIGHT', value: 'TotalWeight' },
      { label: 'TPTRATE', value: 'TptRate' },
      { label: 'HGLRATE', value: 'HglRate' },
      { label: 'LOAN', value: 'Loan' },
      { label: 'BURNTCANE', value: 'BurntCane' },
    ];

    this.types = [
      { label: 'Allowance', value: 'A' },
      { label: 'Deduction', value: 'D' },
      { label: 'NA', value: 'NA' }
    ];
  }

  ngOnInit(): void {
    this.initBillParams();
    this.initLookupDetails();
    this.billmasterForm();
  }

  initLookupDetails() {
    this.lookupService.BillCategories().subscribe((resp) => {
      this.billCategories = resp;
    });
  }

  initBillParams() {
    this.billmasterService.GetBillParameters().subscribe((resp) => {
      this.billParameters = resp as unknown as BillParameterViewDto[];
      this.loading = false;
    });
  }

  billmasterForm() {
    this.fbBillParameters = this.formbuilder.group({
      billParameterId: [null],
      categoryId: ['', (Validators.required)],
      type: ['', (Validators.required)],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_10)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      caluclationType: ['', Validators.required],
      priority: new FormControl('', [Validators.required, Validators.pattern(RG_NUMERIC_ONLY)]),
      formula: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2)]),
      isActive: [true]
    });
  }

  get FormControls() {
    return this.fbBillParameters.controls;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  addBillParam() {
    this.submitLabel = "Add Bill Parameter";
    this.addFlag = true;
    this.showDialog = true;
  }

  editBillParam(billParam: BillParameterViewDto) {
    this.billParam.billParameterId = billParam.id;
    this.billParam.categoryId = billParam.billCategoryId;
    this.billParam.type = billParam.type
    this.billParam.code = billParam.code;
    this.billParam.name = billParam.name;
    this.billParam.caluclationType = billParam.caluclationType;
    this.billParam.priority = billParam.priority;
    this.billParam.formula = billParam.formula;
    this.billParam.isActive = billParam.isActive;
    this.fbBillParameters.setValue(this.billParam);
    this.addFlag = false;
    this.submitLabel = "Update Bill Parameter";
    this.showDialog = true;
  }

  saveBillParam(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.billmasterService.CreateBillParam(this.fbBillParameters.value);
    else return this.billmasterService.UpdateBillParam(this.fbBillParameters.value);
  }

  onSubmit() {
    if (this.fbBillParameters.valid) {
      this.saveBillParam().subscribe(resp => {
        if (resp) {
          this.initBillParams();
          this.fbBillParameters.reset();
          this.showDialog = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMBMBP001" : "SMBMBP002"]);
          // this.service.add({ key: 'tst', severity: 'success', summary: 'Success Message', detail: 'Message sent' });
        }
      })
    }
    else {
      this.fbBillParameters.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.billParameters = [];
    this.billCategories = [];
    this.billParam = new BillParameterDto();
  }

}
