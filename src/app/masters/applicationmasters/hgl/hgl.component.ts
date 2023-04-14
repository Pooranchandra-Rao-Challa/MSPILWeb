import { BankDto, BranchDto } from './../../../_models/applicationmaster';
import { LookupService } from './../../../_services/lookup.service';
import { RG_PHONE_NO, RG_NUMERIC_ONLY, RG_EMAIL, MIN_LENGTH_2, MAX_LENGTH_20, RG_PANNO, MIN_ACCNO, MIN_AADHAAR, RG_AADHAAR, } from './../../../_shared/regex';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BankViewDto, VehicleTypeViewDto, } from 'src/app/_models/applicationmaster';
import { Table } from 'primeng/table';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators, } from '@angular/forms';
import { RG_ALPHA_NUMERIC, RG_ALPHA_ONLY } from 'src/app/_shared/regex';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { HglViewDto, SubHglViewDto, HglDto, } from '../../../_models/applicationmaster'
import { MaxLength } from 'src/app/_models/common';
import { MIN_LENGTH_6 } from '../../../_shared/regex';
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { JWTService } from 'src/app/_services/jwt.service';

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
    'relationTypeId',
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
      hglId: [0],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      relationTypeId: new FormControl('', [Validators.required]),
      relationName: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      gender: ['', Validators.required],
      address: ['', Validators.required],
      pinCode: new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_6)]),
      phoneNo: ['', Validators.pattern(RG_PHONE_NO)],
      tax: ['', Validators.required],
      email: ['', (Validators.pattern(RG_EMAIL))],
      panNo: new FormControl('', [Validators.pattern(RG_PANNO)]),
      tds: [false],
      guarantor1: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      guarantor2: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      guarantor3: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      glcode: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      subGlcode: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      otherCode: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      bankId: ['', Validators.required],
      branchId: ['', Validators.required],
      accountNo: new FormControl('', [Validators.required, Validators.pattern(RG_NUMERIC_ONLY), Validators.minLength(MIN_ACCNO)]),
      aadhaarNo: new FormControl('', [Validators.pattern(RG_AADHAAR), Validators.minLength(MIN_AADHAAR)]),
      isActive: [true],
      subHgls: this.formbuilder.array([]),
    });
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
      console.log(  this.hgls

      );
      
    });
  }

  initsubHgls(hglId: any) {
    this.appMasterService.GetSubHgl(hglId).subscribe((resp) => {
      this.subHgls = resp as unknown as SubHglViewDto[];
      this.faSubHgl().clear();
      this.subHgls.forEach((subHgl) => {
        this.faSubHgl().push(this.generateRow(subHgl));
      });
    });
  }

  initRelationTypes() {
    this.LookupService.RelationTypes().subscribe((resp) => {
      this.relationTypes = resp;
      console.log(this.relationTypes);
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
  /* Form Array For hgl Details */
  faSubHgl(): FormArray {
    return this.fbHgl.get('subHgls') as FormArray;
  }
  addSubHgl() {
    this.showSubHgl = true;
    this.faSubHgl().push(this.generateRow());
  }
  generateRow(subHgls: SubHglViewDto = new SubHglViewDto()): FormGroup {
    if (!this.addFlag) subHgls.hglId = this.hgl.hglId;
    return this.formbuilder.group({
      subHglId: subHgls.subHglId == undefined ? 0 : subHgls.subHglId,
      hglId: subHgls.hglId,
      code: new FormControl(subHgls.code),
      name: [subHgls.name, Validators.required],
      vehicleTypeId: [subHgls.vehicleTypeId, Validators.required],
      noOfPersons: [subHgls.noOfPersons, Validators.required],
      isActive: subHgls.isActive,
    });
  }
  getBranchByBankId(Id: number) {
    this.appMasterService.GetBank(Id).subscribe((resp) => {
      if (resp) {
        this.bank = resp as unknown as BankDto;
        this.branches = this.bank.branches as unknown as BranchDto[];
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
    this.getBranchByBankId(hgl.bankId || 0);
    this.getIFSCByBranch(hgl.branchId || 0);
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
    this.addSubHgl();
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
  onSubmit() {
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
    }
  }

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
