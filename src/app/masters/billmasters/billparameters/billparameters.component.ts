import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
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
import { ITableHeader, MaxLength } from 'src/app/_models/common';
import { JWTService } from 'src/app/_services/jwt.service';

@Component({
  selector: 'app-billparameters',
  templateUrl: './billparameters.component.html',
  styles: [
  ],
})
export class BillParametersComponent implements OnInit {
  billParameters: BillParameterViewDto[] = [];
  billParam: BillParameterDto = new BillParameterDto();
  @ViewChild('filter') filter!: ElementRef;
  showDialog: boolean = false;
  fbBillParameters!: FormGroup;
  addFlag: boolean = true;
  globalFilterFields: string[] = ['billCategoryName', 'type', 'code', 'name', 'caluclationType', 'formula', 'priority', 'isActive', 'createdAt', 'createdByUser',
    'updatedAt', 'updatedByUser'];
  submitLabel!: string;
  billCategories: any;
  types: { label: string; value: string; }[];
  calTypes: { label: string; value: string; }[];
  mediumDate: string = MEDIUM_DATE;
  maxLength: MaxLength = new MaxLength();
  permissions: any;
  headers: ITableHeader[] = [
    { field: 'billCategoryName', header: 'billCategoryName', label: 'Billing Category' },
    { field: 'type', header: 'type', label: 'Type' },
    { field: 'code', header: 'code', label: 'Code' },
    { field: 'name', header: 'name', label: 'Name' },
    { field: 'caluclationType', header: 'caluclationType', label: 'Calc Type' },
    { field: 'formula', header: 'formula', label: 'Formula' },
    { field: 'priority', header: 'priority', label: 'Priority' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdByUser', header: 'createdByUser', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedByUser', header: 'updatedByUser', label: 'Updated By' },
  ];

  constructor(private formbuilder: FormBuilder,
    private billmasterService: BillMasterService,
    private lookupService: LookupService,
    private alertMessage: AlertMessage,
    private jwtService: JWTService) {
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
    this.permissions = this.jwtService.Permissions;
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
    });
  }

  billmasterForm() {
    this.fbBillParameters = this.formbuilder.group({
      billParameterId: [null],
      categoryId: [null, (Validators.required)],
      type: ['', (Validators.required)],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_10)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      caluclationType: ['', Validators.required],
      priority: new FormControl('', [Validators.required, Validators.pattern(RG_NUMERIC_ONLY)]),
      formula: new FormControl('', [Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2)]),
      isActive: [null]
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
    this.fbBillParameters.controls['isActive'].setValue(true);
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
  isUniqueBillParameterCode() {
    const existingDistrictCodes = this.billParameters.filter(BillParameter => 
      BillParameter.code === this.fbBillParameters.value.code && 
      BillParameter.billCategoryId !== this.fbBillParameters.value.billCategoryId
    )
    return existingDistrictCodes.length > 0; 
  }
  
  onSubmit() {
    if (this.fbBillParameters.valid) {
      if (this.addFlag) {
        if (this.isUniqueBillParameterCode()) {
          this.alertMessage.displayErrorMessage(
            `BillParameter Code :"${this.fbBillParameters.value.code}" already exists.`
          );
        } else {
          this.save();
        }
      } else {
        this.save(); 
      }
    } else {
      this.fbBillParameters.markAllAsTouched(); 
    }
  }
  save() {
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
