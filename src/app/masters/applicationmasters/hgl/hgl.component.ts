import { BankDto, BranchDto } from 'src/app/_models/applicationmaster';
import { LookupService } from 'src/app/_services/lookup.service';
import { RG_PHONE_NO, RG_NUMERIC_ONLY, RG_EMAIL, MIN_LENGTH_2, MAX_LENGTH_20, RG_PANNO, MIN_ACCNO, MIN_AADHAAR, RG_AADHAAR, RG_ADDRESS, } from 'src/app/_shared/regex';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BankViewDto, VehicleTypeViewDto, } from 'src/app/_models/applicationmaster';
import { Table } from 'primeng/table';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators, ValidationErrors, AbstractControl, } from '@angular/forms';
import { RG_ALPHA_NUMERIC, RG_ALPHA_ONLY } from 'src/app/_shared/regex';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { HglViewDto, SubHglViewDto, HglDto, } from 'src/app/_models/applicationmaster'
import { ITableHeader, MaxLength } from 'src/app/_models/common';
import { MIN_LENGTH_6 } from 'src/app/_shared/regex';
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { JWTService } from 'src/app/_services/jwt.service';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { FormArrayValidationForDuplication, } from 'src/app/_common/uniqeBranchValidators/unique-branch-validator';
@Component({
  selector: 'app-hgl',
  templateUrl: './hgl.component.html',
  styles: [],
})
export class HglComponent implements OnInit {
  hgls: HglViewDto[] = [];
  hgl: HglDto = new HglDto();
  subHgls: SubHglViewDto[] = [];
  globalFilterFields: string[] = [
    'code',
    'name',
    'relationTypeName',
    'relationName',
    'relationType',
    'gender',
    'address',
    'pinCode',
    'phoneNo',
    'email',
    'panNo',
    'tax',
    'tds',
    'guarantor1',
    'guarantor2',
    'guarantor3',
    'bankName',
    'branchName',
    'ifsc',
    'accountNo',
    'glCode',
    'subGLCode',
    'aadhaarNo',
    'otherCode',
    'isActive',
    'createdAt',
    'createdBy',
    'updatedAt',
    'updatedBy',
  ];
  @ViewChild('filter') filter!: ElementRef;
  fbHgl!: FormGroup;
  submitLabel!: string;
  addFlag: boolean = true;
  showDialog: boolean = false;
  showSubHgl: boolean = false;
  relationTypes: any;
  banks: BankViewDto[] = [];
  bank: BankDto = new BankDto();
  branches: BranchDto[] = [];
  genders: { label: string; value: string }[];
  vehicleTypes: VehicleTypeViewDto[] = [];
  IFSC?: any;
  maxLength: MaxLength = new MaxLength();
  permissions: any;
  mediumDate: string = MEDIUM_DATE;
  plotHeader: ITableHeader[] = [
    { field: 'code', header:'code', label: 'Code' },
    { field: 'name', header:'name', label: 'Name' },
    { field: 'gender', header:'gender', label: 'Gender' },
    { field: 'relationTypeName', header:'relationTypeName', label: 'Relationship Type' },
    { field: 'relationName', header:'relationName', label: 'Relationship Name' },
    { field: 'address', header: 'address', label: 'Address' },
    { field: 'pinCode',header:'pinCode', label: 'PinCode' },
    { field: 'phoneNo', header:'phoneNo', label: 'Phone No' },
    { field: 'email', header:'email', label: 'Email' },
    { field: 'panNo', header:'panNo', label: 'Pan No' },
    { field: 'aadhaarNo', header: 'aadhaarNo', label: 'Aadhaar No' },
    { field: 'tax', header: 'tax  ', label: 'Tax' },
    { field: 'tds', header: 'tds', label: 'TDS' },
    { field: 'guarantor1', header: 'guarantor1  ', label: 'Guarantor1' },
    { field: 'guarantor2', header:'guarantor2', label: 'Guarantor2' },
    { field: 'guarantor3', header: 'guarantor3', label: 'Guarantor3' },
    { field: 'bankName', header: 'bankName  ', label: 'Bank Name' },
    { field: 'branchName', header: 'branchName', label: 'Branch Name' },
    { field: 'ifsc', header: 'ifsc  ', label: 'IFSC' },
    { field: 'accountNo', header: 'accountNo', label: 'Account No' },
    { field: 'glCode', header: 'glCode  ', label: 'Gang Leader Code' },
    { field: 'subGLCode', header: 'subGLCode', label: 'Sub Gang Leader Code' },
    { field: 'otherCode', header: 'otherCode  ', label: 'Other Code' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdBy', header: 'createdBy  ', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedBy', header: 'updatedBy  ', label: 'Updated By' },
  ];
  constructor(
    private formbuilder: FormBuilder,
    private appMasterService: AppMasterService,
    private LookupService: LookupService,
    private alertMessage: AlertMessage,
    private jwtService: JWTService) {
    this.genders = [
      { label: 'Male', value: 'M' },
      { label: 'Female', value: 'F' },
    ];
  }
  hglform() {
    this.fbHgl = this.formbuilder.group({
      hglId: [null],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      relationTypeId: new FormControl(null, [Validators.required]),
      relationName: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      gender: [null, Validators.required],
      address: new FormControl('', [Validators.required, Validators.pattern(RG_ADDRESS)]),
      pinCode: new FormControl(null, [Validators.required, Validators.minLength(MIN_LENGTH_6)]),
      phoneNo: [null, Validators.pattern(RG_PHONE_NO)],
      tax: [null, Validators.required],
      email: ['', (Validators.pattern(RG_EMAIL))],
      panNo: ['', Validators.pattern(RG_PANNO)],
      tds: [false],
      guarantor1: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      guarantor2: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      guarantor3: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      glcode: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      subGlcode: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      otherCode: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      bankId: [null, Validators.required],
      branchId: [null, Validators.required],
      accountNo: new FormControl(null, [Validators.required, Validators.pattern(RG_NUMERIC_ONLY), Validators.minLength(MIN_ACCNO)]),
      aadhaarNo: new FormControl(null, [Validators.required, Validators.pattern(RG_AADHAAR), Validators.minLength(MIN_AADHAAR)]),
      isActive: [true],
      subHgls: this.formbuilder.array([],FormArrayValidationForDuplication()),
    });
    this.addSubHgl();
  }
  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    this.inithgls();
    this.initBanks();
    this.initRelationTypes();
    this.initVehicles();
    this.hglform();
  }
  inithgls() {
    this.appMasterService.GetHgls().subscribe((resp) => {
      this.hgls = resp as unknown as HglViewDto[];
    });
  }
  initsubHgls(hglId: any) {
    this.appMasterService.GetSubHgl(hglId).subscribe((resp) => {
      this.subHgls = resp as unknown as SubHglViewDto[];
      this.faSubHgl().clear();
      if (this.subHgls.length > 0) {
        this.subHgls.forEach((subHgl) => {
          this.faSubHgl().push(this.generateRow(subHgl));
        });
      }
      else {
        this.addSubHgl();
      }
    });
  }
  initRelationTypes() {
    this.LookupService.RelationTypes().subscribe((resp) => {
      this.relationTypes = resp;
    });
  }
  initBanks() {
    this.appMasterService.GetBanks().subscribe((resp) => {
      this.banks = resp as unknown as BankViewDto[];
    });
  }
  initVehicles() {
    this.appMasterService.GetVehicleTypes().subscribe((resp) => {
      this.vehicleTypes = resp as unknown as VehicleTypeViewDto[];
    });
  }
  get FormControls() {
    return this.fbHgl.controls;
  }
  formArrayControls(i: number, formControlName: string) {
    return this.faSubHgl().controls[i].get(formControlName);
  }
  /* Form Array For hgl Details */
  faSubHgl(): FormArray {
    return this.fbHgl.get('subHgls') as FormArray;
  }

  isUniqueSubHGLCode(code: string, subHglId: number) {
    var existingCodes = this.subHgls.filter(
      (subHgl) =>
        subHgl.code === code && subHgl.subHglId !== subHglId
    );
    return existingCodes.length > 0;
  }
  addSubHgl() {
    this.showSubHgl = true;
    this.faSubHgl().push(this.generateRow());
  }

  filterInput(event: any) {
    const initialValue = event.target.value;
    const filteredValue = initialValue.replace(/[^0-9.]/g, '').replace(/(\.\d{0,2}).*/g, '$1');
    if (initialValue !== filteredValue) {
      event.target.value = filteredValue;
    }
  }  
  
  generateRow(subHgls: SubHglViewDto = new SubHglViewDto()): FormGroup {
    if (!this.addFlag) subHgls.hglId = this.hgl.hglId;
    return this.formbuilder.group({
      subHglId: subHgls.subHglId == undefined ? null : subHgls.subHglId,
      hglId: subHgls.hglId,
      code: new FormControl(subHgls.code, [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      name: new FormControl(subHgls.name, [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      vehicleTypeId: [subHgls.vehicleTypeId, Validators.required],
      noOfPersons: [subHgls.noOfPersons, Validators.required,Validators.pattern(/^\d+(\.\d{1,3})?$/)],
      isActive: subHgls.isActive,
    });
  }
  getBranchByBankId(Id: number, edit: boolean = false) {
    this.IFSC = '';
    this.appMasterService.GetBank(Id).subscribe((resp) => {
      if (resp) {
        this.bank = resp as unknown as BankDto;
        this.branches = this.bank.branches as unknown as BranchDto[];
      }
      if (edit) {
        this.getIFSCByBranch(this.fbHgl.value.branchId);
      }
    });
  }

 
  getIFSCByBranch(Id: number) {
    let branch = this.branches.find((x) => x.branchId == Id);
    if (branch) this.IFSC = branch.ifsc;
    else this.IFSC = '';
  }
  editHgl(hgl: HglViewDto) {
    this.hglform();
    this.initsubHgls(hgl.hglId);
    this.initRelationTypes();
    this.getBranchByBankId(hgl.bankId!, true);
    this.hgl.hglId = hgl.hglId
    this.hgl.code = hgl.code;
    this.hgl.name = hgl.name;
    this.hgl.relationTypeId = hgl.relationTypeId;
    this.hgl.relationName = hgl.relationName;
    this.hgl.gender = hgl.gender;
    this.hgl.address = hgl.address;
    this.hgl.pinCode = hgl.pinCode;
    this.hgl.phoneNo = hgl.phoneNo;
    this.hgl.tax = hgl.tax;
    this.hgl.email = hgl.email;
    this.hgl.panNo = hgl.panNo;
    this.hgl.tds = hgl.tds;
    this.hgl.guarantor1 = hgl.guarantor1;
    this.hgl.guarantor2 = hgl.guarantor2;
    
    this.hgl.guarantor3 = hgl.guarantor3;
    this.hgl.glcode = hgl.glCode;
    this.hgl.subGlcode = hgl.subGLCode;
    this.hgl.otherCode = hgl.otherCode;
    this.hgl.branchId = hgl.branchId;
    this.hgl.bankId = hgl.bankId;
    this.hgl.accountNo = hgl.accountNo;
    this.hgl.aadhaarNo = hgl.aadhaarNo;
    this.hgl.isActive = hgl.isActive;
    this.hgl.subHgls = this.subHgls ? this.subHgls : [];
    this.fbHgl.patchValue(this.hgl);
    this.addFlag = false;
    this.submitLabel = 'Update Hgl';
    this.showDialog = true;
    this.showSubHgl = true;
  }
  addHgl() {
    
    this.submitLabel = 'Add Hgl';
    this.addFlag = true;
    this.hglform();
    this.showDialog = true;
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
  saveHgl(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.appMasterService.CreateHgl(this.fbHgl.value);
    else return this.appMasterService.UpdateHgl(this.fbHgl.value);
  }

  isUniqueHglCode() {
    var existingTptCode = this.hgls.filter(tpt =>
      tpt.code == this.fbHgl.value.code && tpt.hglId != this.fbHgl.value.hglId
    )
    return existingTptCode.length > 0;
  }

  isUniqueHglName() {
    var existingTptNames = this.hgls.filter(tpt =>
      tpt.name == this.fbHgl.value.name && tpt.hglId != this.fbHgl.value.hglId
    )
    return existingTptNames.length > 0;
  }
 
  onSubmit() {
    if (this.fbHgl.valid) {
      for (let i = 0; i < this.faSubHgl().length; i++) {
    var subHglGroup = this.faSubHgl().controls[i] as FormGroup;
    if (this.isUniqueSubHGLCode(subHglGroup.value.code, subHglGroup.value.subHglId)) {
      this.alertMessage.displayErrorMessage(
        `Sub HGL Code :"${subHglGroup.value.code}" Already Exists.`
      );
      return;
    }
  }
      if (this.addFlag) {
        if (this.isUniqueHglCode()) {
          this.alertMessage.displayErrorMessage(
            `Tpt Code :"${this.fbHgl.value.code}" Already Exists.`
          );
        } else if (this.isUniqueHglName()) {
          this.alertMessage.displayErrorMessage(
            `Tpt Name :"${this.fbHgl.value.name}" Already Exists.`
          );
        } else {
          this.save();
        }
      } else {
        this.save();
      }
    } else {
      this.fbHgl.markAllAsTouched();
    }
  }

  save() {
    this.fbHgl.value.panNo = this.fbHgl.value.panNo.toUpperCase();
    this.fbHgl.value.pinCode = this.fbHgl.value.pinCode + '';
    if (this.fbHgl.valid) {
      this.saveHgl().subscribe((resp) => {
        if (resp) {
          this.inithgls();
          this.hglform();
          this.showDialog = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMAMHG001" : "SMAMHG002"]);
        }
      });
    } else {
      this.fbHgl.markAllAsTouched();
    }}
  
  onClose() {
    this.hglform();
    this.faSubHgl().clear();
    this.showSubHgl = false;
  }
  ngOnDestroy() {
    this.hgls = [];
    this.subHgls = [];
    this.vehicleTypes = [];
    this.branches = [];
  }
}