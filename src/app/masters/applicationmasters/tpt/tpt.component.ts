import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { RG_PANNO, MIN_ACCNO } from 'src/app/_shared/regex';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { RG_ADDRESS, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY, RG_EMAIL } from 'src/app/_shared/regex';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BankViewDto, TptDto, TptViewDto, VehicleTypeViewDto } from 'src/app/_models/applicationmaster';
import { BankDto, BranchDto, TptdetailViewDto } from 'src/app/_models/applicationmaster';
import { LookupService } from 'src/app/_services/lookup.service';
import { RG_PHONE_NO, RG_NUMERIC_ONLY, RG_VEHICLE, MIN_LENGTH_2, MAX_LENGTH_20 } from 'src/app/_shared/regex';
import { ITableHeader, MaxLength } from 'src/app/_models/common';
import { JWTService } from 'src/app/_services/jwt.service';

@Component({
  selector: 'app-tpt',
  templateUrl: './tpt.component.html',
  styles: [
  ]
})
export class TptComponent implements OnInit {
  tpts: TptViewDto[] = [];
  tpt: TptDto = new TptDto();
  tptDetails: TptdetailViewDto[] = [];
  globalFilterFields: string[] = ['code', 'name', 'relationTypeName', 'relationName', 'gender', 'address', 'pinCode', 'phoneNo', 'email', 'panNo', 'tax', 'tds', 'guarantor1',
    'guarantor2', 'guarantor3', 'bankName', 'branchName', 'ifsc', 'accountNo', 'glCode', 'subGLCode', 'isActive', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy'];
  globalFilterFieldsTptDetails: string[] = ['vehicleNo', 'vehicleTypeId', 'insuranceNo', 'receivableAmt', 'receivedAmt', 'gateEntryFreeze', 'transporterFreeze'];
  @ViewChild('filter') filter!: ElementRef;
  fbTpt!: FormGroup;
  submitLabel!: string;
  addFlag: boolean = true;
  showDialog: boolean = false;
  showTptDetails: boolean = false;
  relationTypes: any;
  banks: BankViewDto[] = [];
  bank: BankDto = new BankDto();
  branches: BranchDto[] = [];
  genders: { label: string; value: string; }[];
  vehicleTypes: VehicleTypeViewDto[] = [];
  defaults: { name: string; id: boolean; }[];
  IFSC?: string;
  mediumDate: string = MEDIUM_DATE;
  maxLength: MaxLength = new MaxLength();
  permissions: any;
  headers: ITableHeader[] = [
    { field: 'code', header: 'code', label: 'Code' },
    { field: 'name', header: 'name', label: 'Name' },
    { field: 'relationTypeName', header: 'relationTypeName', label: 'Relationship Type' },
    { field: 'relationName', header: 'relationName', label: 'Relationship Name' },
    { field: 'gender', header: 'gender', label: 'Gender' },
    { field: 'address', header: 'address', label: 'Address' },
    { field: 'pinCode', header: 'pinCode', label: 'PinCode' },
    { field: 'phoneNo', header: 'phoneNo', label: 'Phone No' },
    { field: 'email', header: 'email', label: 'Email' },
    { field: 'panNo', header: 'panNo', label: 'Pan No' },
    { field: 'tax', header: 'tax', label: 'Tax' },
    { field: 'tds', header: 'tds', label: 'TDS' },
    { field: 'guarantor1', header: 'guarantor1', label: 'Guarantor1' },
    { field: 'guarantor2', header: 'guarantor2', label: 'Guarantor2' },
    { field: 'guarantor3', header: 'guarantor3', label: 'Guarantor3' },
    { field: 'bankName', header: 'bankName', label: 'Bank Name' },
    { field: 'branchName', header: 'branchName', label: 'Branch Name' },
    { field: 'ifsc', header: 'ifsc', label: 'IFSC' },
    { field: 'accountNo', header: 'accountNo', label: 'Account No' },
    { field: 'glCode', header: 'glCode', label: 'Gang Leader Code' },
    { field: 'subGLCode', header: 'subGLCode', label: 'Sub Gang Leader Code' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ];

  constructor(private formbuilder: FormBuilder,
    private appMasterService: AppMasterService,
    private LookupService: LookupService,
    private alertMessage: AlertMessage,
    private jwtService: JWTService) {
    this.defaults = [
      { name: 'Yes', id: true },
      { name: 'No', id: false }
    ];
    this.genders = [
      { label: 'Male', value: 'M' },
      { label: 'Female', value: 'F' }
    ];
  }

  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    this.initTpts();
    this.initBanks();
    this.initRelationTypes();
    this.initVehicles();
    this.tptForm();
  }

  initTpts() {
    this.appMasterService.GetTpts().subscribe((resp) => {
      this.tpts = resp as unknown as TptViewDto[];
    });
  }

  initTptDetails(tptId: number) {
    this.appMasterService.GetTptDetails(tptId).subscribe((resp) => {
      this.tptDetails = resp as unknown as TptdetailViewDto[];
      this.faTptDetails().clear();
      if (this.tptDetails.length > 0) {
        this.tptDetails.forEach((tptDetail) => {
          this.faTptDetails().push(this.generateRow(tptDetail));
        });
      }
      else {
        this.addTptDetail();
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

  getBranchByBankId(Id: number, edit: boolean = false) {
    this.IFSC = '';
    this.appMasterService.GetBank(Id).subscribe(resp => {
      if (resp) {
        this.bank = resp as unknown as BankDto;
        this.branches = this.bank.branches as unknown as BranchDto[];
        if (edit) {
          this.getIFSCByBranch(this.fbTpt.value.branchId);
        }
      }
    });
  }

  getIFSCByBranch(Id: number) {
    let branch = this.branches.find(x => x.branchId == Id);
    if (branch) this.IFSC = branch.ifsc;
    else this.IFSC = '';
  }

  initVehicles() {
    this.appMasterService.GetVehicleTypes().subscribe((resp) => {
      this.vehicleTypes = resp as unknown as VehicleTypeViewDto[];
    });
  }

  tptForm() {
    this.fbTpt = this.formbuilder.group({
      tptId: [null],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      relationTypeId: ['', (Validators.required)],
      relationName: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      gender: ['', (Validators.required)],
      address: new FormControl('', [Validators.required, Validators.pattern(RG_ADDRESS)]),
      pinCode: [null, (Validators.required)],
      phoneNo: ['', (Validators.pattern(RG_PHONE_NO))],
      tax: [null, (Validators.required)],
      email: ['', (Validators.pattern(RG_EMAIL))],
      panNo: ['', Validators.pattern(RG_PANNO)],
      tds: [false],
      guarantor1: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      guarantor2: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      guarantor3: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      glCode: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      subGlcode: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      otherCode: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      bankId: ['', (Validators.required)],
      branchId: ['', (Validators.required)],
      accountNo: new FormControl('', [Validators.required, Validators.pattern(RG_NUMERIC_ONLY), Validators.minLength(MIN_ACCNO)]),
      isActive: [true],
      tptdetails: this.formbuilder.array([]),
    });
  }

  get FormControls() {
    return this.fbTpt.controls;
  }

  formArrayControls(i: number, formControlName: string) {
    return this.faTptDetails().controls[i].get(formControlName);
  }

  /* Form Array For Tpt Details */

  faTptDetails(): FormArray {
    return this.fbTpt.get("tptdetails") as FormArray;
  }

  addTptDetail() {
    this.branches = [];
    this.showTptDetails = true;
    this.faTptDetails().push(this.generateRow());
  }

  generateRow(tptDetail: TptdetailViewDto = new TptdetailViewDto()): FormGroup {
    if (!this.addFlag) tptDetail.tptId = this.tpt.tptId;
    return this.formbuilder.group({
      id: tptDetail.tptdetailId,
      tptId: tptDetail.tptId,
      vehicleNo: new FormControl(tptDetail.vehicleNo == null ? '' : tptDetail.vehicleNo, [Validators.required,Validators.pattern(RG_VEHICLE)]),
      vehicleTypeId: [tptDetail.vehicleTypeId, (Validators.required)],
      insuranceNo: [tptDetail.insuranceNo, (Validators.pattern(RG_ALPHA_NUMERIC))],
      receivableAmt: [tptDetail.receivableAmt],
      receivedAmt: tptDetail.receivedAmt,
      transporterFreeze: tptDetail.transporterFreeze,
      gateEntryFreeze: tptDetail.gateEntryFreeze,
      isActive: tptDetail.isActive
    });
  }

  editTpt(tpt: TptViewDto) {
    this.initTptDetails(tpt.tptId);
    this.getBranchByBankId(tpt.bankId || 0, true);
    // this.getIFSCByBranch(tpt.branchId || 0);
    this.tpt.tptId = tpt.tptId;
    this.tpt.code = tpt.code;
    this.tpt.name = tpt.name;
    this.tpt.relationTypeId = tpt.relationTypeId;
    this.tpt.relationName = tpt.relationName;
    this.tpt.gender = tpt.gender;
    this.tpt.address = tpt.address;
    this.tpt.pinCode = tpt.pinCode;
    this.tpt.phoneNo = tpt.phoneNo;
    this.tpt.tax = tpt.tax;
    this.tpt.email = tpt.email;
    this.tpt.panNo = tpt.panNo;
    this.tpt.tds = tpt.tds;
    this.tpt.guarantor1 = tpt.guarantor1;
    this.tpt.guarantor2 = tpt.guarantor2;
    this.tpt.guarantor3 = tpt.guarantor3;
    this.tpt.glCode = tpt.glCode;
    this.tpt.subGlcode = tpt.subGLCode;
    this.tpt.otherCode = tpt.otherCode;
    this.tpt.bankId = tpt.bankId;
    this.tpt.branchId = tpt.branchId;
    this.tpt.accountNo = tpt.accountNo;
    this.tpt.isActive = tpt.isActive;
    this.tpt.tptdetails = this.tptDetails ? [] : this.tptDetails;
    this.fbTpt.patchValue(this.tpt);
    this.addFlag = false;
    this.submitLabel = "Update TPT";
    this.showDialog = true;
    this.showTptDetails = true;
  }

  addTPT() {
    this.addTptDetail();
    this.submitLabel = "Add TPT";
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
  saveTpt(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.appMasterService.CreateTpt(this.fbTpt.value)
    else return this.appMasterService.UpdateTpt(this.fbTpt.value)
  }

  isUniqueTptCode() {
    var existingTptCode = this.tpts.filter(tpt =>
      tpt.code == this.fbTpt.value.code && tpt.tptId != this.fbTpt.value.farmerId
    )
    return existingTptCode.length > 0;
  }

  isUniqueTptName() {
    var existingTptNames = this.tpts.filter(tpt =>
      tpt.name == this.fbTpt.value.name && tpt.tptId != this.fbTpt.value.farmerId
    )
    return existingTptNames.length > 0;
  }

  onSubmit() {
    if (this.fbTpt.valid) {
      if (this.addFlag) {
        if (this.isUniqueTptCode()) {
          this.alertMessage.displayErrorMessage(
            `Tpt Code :"${this.fbTpt.value.code}" Already Exists.`
          );
        } else if (this.isUniqueTptName()) {
          this.alertMessage.displayErrorMessage(
            `Tpt Name :"${this.fbTpt.value.name}" Already Exists.`
          );
        } else {
          this.save();
        }
      } else {
        this.save();
      }
    } else {
      this.fbTpt.markAllAsTouched();
    }
  }

  save() {
    this.fbTpt.value.pinCode = this.fbTpt.value.pinCode + "";
    if (this.fbTpt.valid) {
      this.saveTpt().subscribe(resp => {
        if (resp) {
          this.initTpts();
          this.fbTpt.reset();
          this.showDialog = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMAMT001" : "SMAMT002"]);
        }
      })
    }
    else {
      this.fbTpt.markAllAsTouched();
    }
    this.IFSC = '';
  }

  onClose() {
    this.fbTpt.reset();
    this.faTptDetails().clear();
    this.showTptDetails = false;
    this.IFSC = '';
  }

  ngOnDestroy() {
    this.tpts = [];
    this.tptDetails = [];
    this.branches = [];
    this.vehicleTypes = [];
  }

}
