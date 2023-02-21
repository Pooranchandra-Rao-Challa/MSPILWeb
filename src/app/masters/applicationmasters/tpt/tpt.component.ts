import { BankDto, BranchDto, TptdetailViewDto, TptdetailDto } from './../../../_models/applicationmaster';
import { LookupService } from './../../../_services/lookup.service';
import { PHONE_NO, NUMERIC_ONLY, RG_VEHICLE } from './../../../_shared/regex';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BankViewDto, TptDto, TptViewDto, VehicleTypeViewDto } from 'src/app/_models/applicationmaster';
import { Table } from 'primeng/table';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { ALPHA_NUMERIC, ALPHA_ONLY } from 'src/app/_shared/regex';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';

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
  loading: boolean = true;
  loadingTptDetails: boolean = true;
  globalFilterFields: string[] = ['code', 'name', 'relationType', 'relationName', 'gender', 'address', 'pinCode', 'phoneNo', 'email', 'panNo', 'tax', 'tds', 'guarantor1',
    'guarantor2', 'guarantor3', 'bankName', 'branchName', 'ifsc', 'accountNo', 'glCode', 'subGLCode', 'isActive', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy'];
  globalFilterFieldsTptDetails2: string[] = ['vehicleNo', 'vehicleTypeId', 'insuranceNo', 'receivableAmt', 'receivedAmt', 'gateEntryFreeze', 'transporterFreeze'];
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

  constructor(private formbuilder: FormBuilder,
    private appMasterService: AppMasterService,
    private LookupService: LookupService) {
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
    this.initTpts();
    this.initBanks();
    this.initRelationTypes();
    this.initVehicles();
    this.tptForm();
  }

  initTpts() {
    this.appMasterService.GetTpts().subscribe((resp) => {
      this.tpts = resp as unknown as TptViewDto[];
      this.loading = false;
    });
  }

  initTptDetails(tptId: number) {
    this.appMasterService.GetTptDetails(tptId).subscribe((resp) => {
      this.tptDetails = resp as unknown as TptdetailViewDto[];
      this.faTptDetails().clear();
      this.tptDetails.forEach((tptDetail) => {
        this.faTptDetails().push(this.generateRow(tptDetail));
      });
      this.loadingTptDetails = false;
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

  getBranchByBankId(Id: number) {
    this.appMasterService.GetBank(Id).subscribe(resp => {
      if (resp) {
        this.bank = resp as unknown as BankDto;
        this.branches = this.bank.branches as unknown as BranchDto[];
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
      tptId: [0],
      code: new FormControl('', [Validators.required, Validators.pattern(ALPHA_NUMERIC)]),
      name: new FormControl('', [Validators.required, Validators.pattern(ALPHA_ONLY)]),
      relationTypeId: ['', (Validators.required)],
      relationName: new FormControl('', [Validators.required, Validators.pattern(ALPHA_ONLY)]),
      gender: ['', (Validators.required)],
      address: ['', (Validators.required)],
      pinCode: ['', (Validators.required)],
      phoneNo: ['', (Validators.pattern(PHONE_NO))],
      tax: ['', (Validators.required)],
      email: [''],
      panNo: ['', Validators.pattern(ALPHA_NUMERIC)],
      tds: [false],
      guarantor1: ['', Validators.pattern(ALPHA_NUMERIC)],
      guarantor2: ['', Validators.pattern(ALPHA_NUMERIC)],
      guarantor3: ['', Validators.pattern(ALPHA_NUMERIC)],
      glCode: ['', Validators.pattern(ALPHA_NUMERIC)],
      subGlcode: ['', Validators.pattern(ALPHA_NUMERIC)],
      otherCode: ['', Validators.pattern(ALPHA_NUMERIC)],
      bankId: ['', (Validators.required)],
      branchId: ['', (Validators.required)],
      accountNo: new FormControl('', [Validators.required, Validators.pattern(NUMERIC_ONLY)]),
      isActive: [true],
      tptdetails: this.formbuilder.array([]),
    });
  }

  get FormControls() {
    return this.fbTpt.controls;
  }

  FormArrayControls(i: number, formControlName: string) {
    return this.faTptDetails().controls[i].get(formControlName);
  }

  /* Form Array For Tpt Details */

  faTptDetails(): FormArray {
    return this.fbTpt.get("tptdetails") as FormArray;
  }

  addTptDetail() {
    this.showTptDetails = true;
    this.faTptDetails().push(this.generateRow());
    this.loadingTptDetails = false;
  }

  generateRow(tptDetail: TptdetailViewDto = new TptdetailViewDto()): FormGroup {
    if (!this.addFlag) tptDetail.tptId = this.tpt.tptId;
    return this.formbuilder.group({
      id: tptDetail.tptdetailId,
      tptId: tptDetail.tptId,
      vehicleNo: new FormControl(tptDetail.vehicleNo, [Validators.pattern(RG_VEHICLE)]),
      vehicleTypeId: [tptDetail.vehicleTypeId, (Validators.required)],
      insuranceNo: [tptDetail.insuranceNo, (Validators.pattern(ALPHA_NUMERIC))],
      receivableAmt: [tptDetail.receivableAmt],
      receivedAmt: tptDetail.receivedAmt,
      transporterFreeze: tptDetail.transporterFreeze,
      gateEntryFreeze: tptDetail.gateEntryFreeze,
      isActive: tptDetail.isActive
    });
  }

  editTpt(tpt: TptViewDto) {
    this.initTptDetails(tpt.tptId);
    this.getBranchByBankId(tpt.bankId || 0);
    setTimeout(() => {
      this.getIFSCByBranch(tpt.branchId || 0);
    }, 5000);
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
    this.fbTpt.setValue(this.tpt);
    this.addFlag = false;
    this.submitLabel = "Update TPT";
    this.showDialog = true;
    this.showTptDetails = true;
  }

  addTPT() {
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

  onSubmit() {
    this.fbTpt.value.pinCode = this.fbTpt.value.pinCode + "";
    if (this.fbTpt.valid) {
      this.saveTpt().subscribe(resp => {
        if (resp) {
          this.initTpts();
          this.fbTpt.reset();
          this.showDialog = false;
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

}
