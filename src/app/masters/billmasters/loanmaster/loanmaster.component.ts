import { LookupDetailDto } from 'src/app/_models/applicationmaster';
import { LookupService } from 'src/app/_services/lookup.service';
import { MIN_LENGTH_2, MAX_LENGTH_20 } from 'src/app/_shared/regex';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, ValidationErrors, AbstractControl, } from '@angular/forms';
import { RG_ALPHA_NUMERIC, RG_ALPHA_ONLY } from 'src/app/_shared/regex';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { LoanTypeViewDto, LoanTypeDto, LoanSubTypeViewDto, } from 'src/app/_models/billingmaster';
import { BillMasterService } from 'src/app/_services/billmaster.service';
import { ITableHeader, MaxLength } from 'src/app/_models/common';
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { JWTService } from 'src/app/_services/jwt.service';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { FormArrayValidationForDuplication } from 'src/app/_common/uniqeBranchValidators/unique-branch-validator';

@Component({
  selector: 'app-loanmaster',
  templateUrl: './loanmaster.component.html',
  styles: [
  ],
})
export class LoanMasterComponent implements OnInit {
  loanTypes: LoanTypeViewDto[] = [];
  loanType: LoanTypeDto = new LoanTypeDto();
  loanSubTypes: LoanSubTypeViewDto[] = [];
  loadingLoanType: boolean = true;
  globalFilterFields: string[] = ['categoryName', 'code', 'name', 'interestRate', 'priority', 'glCode', 'subGLcode', 'isActive', 'createdAt',
    'createdBy', 'updatedAt', 'updatedBy',];
  @ViewChild('filter') filter!: ElementRef;
  fbloantype!: FormGroup;
  submitLabel!: string;
  addFlag: boolean = true;
  showDialog: boolean = false;
  showloantype: boolean = false;
  uom: LookupDetailDto[] = [];
  defaults: { name: string; id: boolean }[];
  billCategories: any;
  mediumDate: string = MEDIUM_DATE;
  maxLength: MaxLength = new MaxLength();
  permissions: any;
  loanQtyTypes: { name: string; value: string; }[];
  headers: ITableHeader[] = [
    { field: 'categoryName', header: 'categoryName', label: 'Category' },
    { field: 'code', header: 'code', label: 'Code' },
    { field: 'name', header: 'name', label: 'Name' },
    { field: 'interestRate', header: 'interestRate', label: 'Interest Rate' },
    { field: 'priority', header: 'priority', label: 'Priority' },
    { field: 'glCode', header: 'glCode', label: 'GL Code' },
    { field: 'subGLcode', header: 'subGLcode', label: 'Sub GL Code' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ];

  constructor(
    private formbuilder: FormBuilder,
    private LookupService: LookupService,
    private BillMasterService: BillMasterService,
    private alertMessage: AlertMessage,
    private jwtService: JWTService
  ) {
    this.defaults = [
      { name: 'Yes', id: true },
      { name: 'No', id: false },
    ];
    this.loanQtyTypes = [
      { name: 'N/A', value: 'N' },
      { name: 'Fertilizer', value: 'F' },
      { name: 'Weed', value: 'W' },
      { name: 'Disease', value: 'D' },
      { name: 'Pest', value: 'P' },
    ];
  }
  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    this.initLoanTypes();
    this.initUom();
    this.loanTypesForm();
    this.initLookupDetails();
  }
  initLoanTypes() {
    this.BillMasterService.GetLoanTypes().subscribe((resp) => {
      this.loanTypes = resp as unknown as LoanTypeViewDto[];
      console.log('loanTypes',this.loanTypes);
      
    });
  }
  initLoanSubtype(loanTypeId: any) {
    this.BillMasterService.GetLoanSubTypes(loanTypeId).subscribe((resp) => {
      this.loanSubTypes = resp as unknown as LoanSubTypeViewDto[];
      this.faLoanSubType().clear();
      this.loanSubTypes.forEach((loanSubType) => {
        this.faLoanSubType().push(this.generateRow(loanSubType));
      });
    });
  }
  initUom() {
    this.LookupService.UOMs().subscribe((resp) => {
      this.uom = resp as unknown as LookupDetailDto[];
    });
  }

  initLookupDetails() {
    this.LookupService.BillCategories().subscribe((resp) => {
      this.billCategories = resp;
    });
  }
  loanTypesForm() {
    this.fbloantype = this.formbuilder.group({
      loanTypeId: [null],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      categoryId: [null, Validators.required],
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      interestRate: new FormControl(null, [Validators.required]),
      priority: new FormControl(null, [Validators.required]),
      glcode: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      subGlcode: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      isActive: [null],
      loanSubTypes: this.formbuilder.array([],FormArrayValidationForDuplication()),
    });
  }

  get FormControls() {
    return this.fbloantype.controls;
  }

  formArrayControls(i: number, formControlName: string) {
    return this.faLoanSubType().controls[i].get(formControlName);
  }

  /* Form Array For loantype Details */
  faLoanSubType(): FormArray {
    return this.fbloantype.get('loanSubTypes') as FormArray;
  }

  addLoanSubType() {
    this.showloantype = true;
    this.faLoanSubType().push(this.generateRow());
    this.loadingLoanType = false;
  }

  generateRow(
    loanSubTypes: LoanSubTypeViewDto = new LoanSubTypeViewDto()):
    FormGroup {
    if (!this.addFlag) loanSubTypes.loanTypeId = this.loanType.loanTypeId;
    return this.formbuilder.group({
      loanSubTypeId: loanSubTypes.loanSubTypeId,
      loanTypeId: loanSubTypes.loanTypeId,
      code: new FormControl(loanSubTypes.code, [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2)]),
      name: new FormControl(loanSubTypes.name, [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      requestReq: [loanSubTypes.requestReq, Validators.required],
      priority: [loanSubTypes.priority],
      interestRate: new FormControl(loanSubTypes.interestRate, [Validators.required]),
      rate: new FormControl(loanSubTypes.rate, [Validators.required]),
      uomid: [loanSubTypes.uomId, Validators.required],
      loanQtyType: [loanSubTypes.loanQtyType],
      glcode: new FormControl(loanSubTypes.glCode, [Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2)]),
      subGlcode: new FormControl(loanSubTypes.subGLcode, [Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2)]),
      isActive: (loanSubTypes.isActive = true),
    });
  }
  editLoanType(loanType: LoanTypeViewDto) {
    this.initLoanSubtype(loanType.loanTypeId);
    this.loanType.loanTypeId = loanType.loanTypeId;
    this.loanType.code = loanType.code;
    this.loanType.categoryId = loanType.categoryId;
    this.loanType.name = loanType.name;
    this.loanType.interestRate = loanType.interestRate;
    this.loanType.priority = loanType.priority;
    this.loanType.glcode = loanType.glCode;
    this.loanType.subGlcode = loanType.subGLcode;
    this.loanType.isActive = loanType.isActive;
    this.loanType.loanSubTypes = this.loanSubTypes ? this.loanSubTypes : [];
    this.fbloantype.patchValue(this.loanType);
    this.addFlag = false;
    this.submitLabel = 'Update loanType';
    this.showDialog = true;
    this.showloantype = true;
  }
  addLoanType() {
    this.fbloantype.controls['isActive'].setValue(true);
    this.submitLabel = 'Add Loan SubType';
    this.addFlag = true;
    this.addLoanSubType();
    this.showDialog = true;
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  saveLoantype(): Observable<HttpEvent<LoanTypeDto>> {
    if (this.addFlag)
      return this.BillMasterService.CreateLoanType(this.fbloantype.value);
    else return this.BillMasterService.UpdateLoanType(this.fbloantype.value);
  }
  isUniqueLoanTypeCode() {
    const existingLoanTypeCodes = this.loanTypes.filter(loanType => 
      loanType.code === this.fbloantype.value.code && 
      loanType.loanTypeId !== this.fbloantype.value.loanTypeId
    )
    return existingLoanTypeCodes.length > 0; 
  }
  onSubmit() {
    if (this.fbloantype.valid) {
      if (this.addFlag) {
        
        if (this.isUniqueLoanTypeCode()) {
          this.alertMessage.displayErrorMessage(
            `LoanType Code :"${this.fbloantype.value.code}" already exists.`
          );
        } else {
          this.save();
        }
      } else {
        this.save(); 
      }
    } else {
      this.fbloantype.markAllAsTouched(); 
    }
  }
  save() {
    if (this.fbloantype.valid) {
      this.saveLoantype().subscribe((resp) => {
        if (resp) {
          this.initLoanTypes();
          this.showDialog = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMBMLM001" : "SMBMLM002"]);
        }
      });
    } else {
      this.fbloantype.markAllAsTouched();
    }
  }
  onClose() {
    this.fbloantype.reset();
    this.faLoanSubType().clear();
    this.showloantype = false;
  }
  ngOnDestroy() {
    this.loanTypes = [];
    this.loanSubTypes = [];
  }

}
