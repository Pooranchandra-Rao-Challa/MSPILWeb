import { BankDto, BranchDto, TptdetailViewDto, TptdetailDto, LookupDetailDto } from './../../../_models/applicationmaster';
import { LookupService } from './../../../_services/lookup.service';
import { RG_PHONE_NO, RG_NUMERIC_ONLY, RG_VEHICLE } from './../../../_shared/regex';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BankViewDto, TptDto, TptViewDto, VehicleTypeViewDto } from 'src/app/_models/applicationmaster';
import { Table } from 'primeng/table';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { RG_ALPHA_NUMERIC, RG_ALPHA_ONLY } from 'src/app/_shared/regex';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { LoanTypeViewDto, LoanTypeDto, LoanSubTypeViewDto } from '../../../_models/billingmaster';
import { BillMasterService } from '../../../_services/billmaster.service';


@Component({
  selector: 'app-loanmaster',
  templateUrl: './loanmaster.component.html',
  styles: [
  ]
})

export class LoanMasterComponent implements OnInit {

  loanTypes: LoanTypeViewDto[] = [];
  loanType: LoanTypeDto = new LoanTypeDto();
  loanSubTypes: LoanSubTypeViewDto[] = [];
  loading: boolean = true;
  loadingTptDetails: boolean = true;
  globalFilterFields: string[] = ['code', 'name', 'relationType', 'relationName', 'gender', 'address', 'pinCode', 'phoneNo', 'email', 'panNo', 'tax', 'tds', 'guarantor1',
    'guarantor2', 'guarantor3', 'bankName', 'branchName', 'ifsc', 'accountNo', 'glCode', 'subGLCode', 'isActive', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy'];
  globalFilterFieldsTptDetails: string[] = ['vehicleNo', 'vehicleTypeId', 'insuranceNo', 'receivableAmt', 'receivedAmt', 'gateEntryFreeze', 'transporterFreeze'];
    @ViewChild('filter') filter!: ElementRef;
  fbloantype!: FormGroup;
  submitLabel!: string;
  addFlag: boolean = true;
  showDialog: boolean = false;
  showloantype: boolean = false;
  uom: LookupDetailDto[] = [];
  defaults: { name: string; id: boolean; }[];
  billCategories:any;

  constructor(private formbuilder: FormBuilder,
    private appMasterService: AppMasterService,
    private LookupService: LookupService,
    private BillMasterService:BillMasterService) {
    this.defaults = [
      { name: 'Yes', id: true },
      { name: 'No', id: false }
    ];
  }

  ngOnInit(): void {
    this.initLoanTypes();
   this.initUom();
    this.loanTypesForm();
    this.initLookupDetails()
  }

  initLoanTypes() {
    this.BillMasterService.GetLoanTypes().subscribe((resp) => {
      this.loanTypes = resp as unknown as LoanTypeViewDto[];
      this.loading = false;
    });
  }

  initLoanSubtype(loanTypeId: number) {
    this.BillMasterService.GetLoanSubTypes(loanTypeId).subscribe((resp) => {
      this.loanSubTypes = resp as unknown as LoanSubTypeViewDto[];
      this.faLoanSubType().clear();
      this.loanSubTypes.forEach((loanSubType) => {
        this.faLoanSubType().push(this.generateRow(loanSubType));
      });
      this.loadingTptDetails = false;
    });
  }


  initUom() {
    this.LookupService.UOMs().subscribe((resp) => {
      this.uom = resp as unknown as LookupDetailDto[];
      console.log(this.uom)
    });
  }

  initLookupDetails() {
    this.LookupService.BillCategories().subscribe((resp) => {
      this.billCategories = resp;
    });
  }

  loanTypesForm() {
    this.fbloantype = this.formbuilder.group({
      loanTypeId: [15],
      code: new FormControl(''),
      categoryId: [''],
      name: new FormControl('',),
      interestRate: new FormControl('', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
      priority:[''],
      glcode: [''],
      subGlcode: [''],
      isActive: [true],
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
    return this.fbloantype.get("loanSubTypes") as FormArray;
  }

  addLoanSubType() {
    this.showloantype = true;
    this.faLoanSubType().push(this.generateRow());
    this.loadingTptDetails = false;
  }

  generateRow(loanSubType: LoanSubTypeViewDto = new LoanSubTypeViewDto()): FormGroup {
    if (!this.addFlag) loanSubType.loanTypeId = this.loanType.loanTypeId;
    return this.formbuilder.group({
    
      loanSubTypeId:loanSubType.loanSubTypeId,
      loanTypeId: loanSubType.loanTypeId,
      code: [loanSubType.code || 'AA'],
      name: [loanSubType.name || 'AA'],
      requestReq: [loanSubType.requestReq],
      priority: [loanSubType.priority],
      interestRate: [loanSubType.interestRate,],
      rate:[ loanSubType.rate,],
      uomid: loanSubType.uomId,
      loanQtyType: [loanSubType.loanQtyType],
      glcode: [loanSubType.glCode,],
      subGlcode: [loanSubType.subGLcode,],
      isActive: loanSubType.isActive=true
    });
  }

  editTpt(loanType: LoanTypeViewDto) {

  //  this.initLoanSubtype(loanType.loanTypeId);
    this.loanType.loanTypeId = loanType.loanTypeId;
    this.loanType.code = loanType.code;
    this.loanType.categoryId = loanType.categoryId;
    this.loanType.name = loanType.name;
    this.loanType.interestRate = loanType.interestRate;
    this.loanType.priority = loanType.priority;
    this.loanType.glcode = loanType.glCode;
    this.loanType.subGlcode = loanType.subGLcode;
    this.loanType.isActive = loanType.isActive;
    this.loanType.loanSubTypes = this.loanSubTypes ? [] : this.loanSubTypes;

    this.fbloantype.setValue(this.loanType);
    this.addFlag = false;
    this.submitLabel = "Update loanType";
    this.showDialog = true;
    this.showloantype = true;

   
}

  addLoanType() {
    this.submitLabel = "Add Loan SubType";
    this.addFlag = true;
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
    if (this.addFlag) return this.BillMasterService.CreateLoanType(this.fbloantype.value)
    else return this.BillMasterService.UpdateLoanType(this.fbloantype.value)
  }

  onSubmit() { 
    debugger;
    console.log(this.fbloantype.value)
    if (this.fbloantype.valid) {
      this.saveLoantype().subscribe(resp => {
        if (resp) {
          this.initLoanTypes();
          this.fbloantype.reset();
          this.showDialog = false;
        }
      })
    }
    else {
      this.fbloantype.markAllAsTouched();
    }
   
  }

  onClose() {
    this.fbloantype.reset();
    this.faLoanSubType().clear();
    this.showloantype = false;
  
  }

}
