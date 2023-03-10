import { LookupDetailDto } from './../../../_models/applicationmaster';
import { LookupService } from './../../../_services/lookup.service';
import {RG_NUMERIC_ONLY,RG_VEHICLE,MIN_LENGTH_2, MAX_LENGTH_20,} from './../../../_shared/regex';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { FormGroup, FormBuilder, FormControl,Validators,FormArray,} from '@angular/forms';
import { RG_ALPHA_NUMERIC, RG_ALPHA_ONLY } from 'src/app/_shared/regex';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { LoanTypeViewDto, LoanTypeDto, LoanSubTypeViewDto, } from '../../../_models/billingmaster';
import { BillMasterService } from '../../../_services/billmaster.service';

@Component({
  selector: 'app-loanmaster',
  templateUrl: './loanmaster.component.html',
  styles: [],
})
export class LoanMasterComponent implements OnInit {
  loanTypes: LoanTypeViewDto[] = [];
  loanType: LoanTypeDto = new LoanTypeDto();
  loanSubTypes: LoanSubTypeViewDto[] = [];
  loading: boolean = true;
  loadingLoanType: boolean = true;
  globalFilterFields: string[] = ['code', 'categoryId', 'categoryName', 'name', 'interestRate', 'priority', 'glCode', 'subGLcode', 'isActive', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy',];
  @ViewChild('filter') filter!: ElementRef;
  fbloantype!: FormGroup;
  submitLabel!: string;
  addFlag: boolean = true;
  showDialog: boolean = false;
  showloantype: boolean = false;
  uom: LookupDetailDto[] = [];
  defaults: { name: string; id: boolean }[];
  billCategories: any;

  constructor(
    private formbuilder: FormBuilder,
    private appMasterService: AppMasterService,
    private LookupService: LookupService,
    private BillMasterService: BillMasterService
  ) {
    this.defaults = [
      { name: 'Yes', id: true },
      { name: 'No', id: false },
    ];
  }

  ngOnInit(): void {
    this.initLoanTypes();
    this.initUom();
    this.loanTypesForm();
    this.initLookupDetails();
  }
  initLoanTypes() {
    this.BillMasterService.GetLoanTypes().subscribe((resp) => {
      this.loanTypes = resp as unknown as LoanTypeViewDto[];
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
      console.log(this.uom);
    });
  }
  initLookupDetails() {
    this.LookupService.BillCategories().subscribe((resp) => {
      this.billCategories = resp;
      console.log(this.billCategories);
    });
  }

  loanTypesForm() {
    this.fbloantype = this.formbuilder.group({
      loanTypeId: [0],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20),]),
      categoryId: ['', Validators.required],
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY),]),
      interestRate: new FormControl('', [Validators.required, Validators.pattern(RG_NUMERIC_ONLY),]),
      priority: new FormControl('', [Validators.required, Validators.pattern(RG_NUMERIC_ONLY),]),
      glcode: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      subGlcode: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      isActive: [false],
      loanSubTypes: this.formbuilder.array([]),
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
      code: [loanSubTypes.code, Validators.pattern(RG_ALPHA_NUMERIC)],
      name: [loanSubTypes.name, Validators.pattern(RG_ALPHA_NUMERIC)],
      requestReq: [loanSubTypes.requestReq, Validators.required],
      priority: new FormControl(loanSubTypes.priority,Validators.pattern(RG_ALPHA_NUMERIC)),
      interestRate: new FormControl(loanSubTypes.interestRate, [Validators.required, Validators.pattern(RG_NUMERIC_ONLY),]),
      rate: new FormControl(loanSubTypes.rate, [ Validators.required, Validators.pattern(RG_NUMERIC_ONLY),]),
      uomid: [loanSubTypes.uomId, Validators.required],
      loanQtyType: [loanSubTypes.loanQtyType],
      glcode: [loanSubTypes.glCode, Validators.pattern(RG_ALPHA_NUMERIC)],
      subGlcode: [loanSubTypes.subGLcode, Validators.pattern(RG_ALPHA_NUMERIC)],
      isActive: (loanSubTypes.isActive = true),
    });
  }

  editTpt(loanType: LoanTypeViewDto) {
    this.loanTypesForm();
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
    setTimeout(() => {
      this.fbloantype.setValue(this.loanType);
    }, 5000);
    this.addFlag = false;
    this.submitLabel = 'Update loanType';
    this.showDialog = true;
    this.showloantype = true;
  }

  addLoanType() {
    this.submitLabel = 'Add Loan SubType';
    this.addFlag = true;
    this.loanTypesForm();
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
  onSubmit() {
    console.log(this.fbloantype.value);
    if (this.fbloantype.valid) {
      this.saveLoantype().subscribe((resp) => {
        if (resp) {
          this.initLoanTypes();
          this.loanTypesForm();
          this.showDialog = false;
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
