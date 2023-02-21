import { BankDto, BranchDto, TptdetailViewDto, TptdetailDto } from './../../../_models/applicationmaster';
import { LookupService } from './../../../_services/lookup.service';
import { PHONE_NO, NUMERIC_ONLY, } from './../../../_shared/regex';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BankViewDto, VehicleTypeViewDto } from 'src/app/_models/applicationmaster';
import { Table } from 'primeng/table';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { ALPHA_NUMERIC, ALPHA_ONLY } from 'src/app/_shared/regex';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { HglViewDto, SubHglViewDto, HglDto } from '../../../_models/applicationmaster';

@Component({
  selector: 'app-hgl',
  templateUrl: './hgl.component.html',
  styles: [
  ]
})
export class HglComponent implements OnInit {

  hgls: HglViewDto[] = [];
  hgl: HglDto = new HglDto();
  subHgls: SubHglViewDto[] = [];
  loading: boolean = true;
  globalFilterFields: string[] = ['code', 'name', 'relationType', 'relationName', 'gender', 'address', 'pinCode', 'phoneNo', 'email', 'panNo', 'tax', 'tds', 'guarantor1',
    'guarantor2', 'guarantor3', 'bankName', 'branchName', 'ifsc', 'accountNo', 'glCode', 'subGLCode', 'isActive', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy'];
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
    this.inithgls();
    this.initBanks();
    this.initRelationTypes();
    this.initVehicles();
    this.tptForm();
  }

  inithgls() {
    this.appMasterService.GetHgls().subscribe((resp) => {
      this.hgls = resp as unknown as HglViewDto[];
      this.loading = false;
    });
  }

  initsubHgls(hglId: number) {
    this.appMasterService.GetSubHgl(hglId).subscribe((resp) => {
      this.subHgls = resp as unknown as SubHglViewDto[];
      console.log(this.subHgls);

      this.faSubHgl().clear();
      this.subHgls.forEach((subHgl) => {
        this.faSubHgl().push(this.generateRow(subHgl));
      });
      this.loading = false;
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
    debugger
    this.appMasterService.GetBank(Id).subscribe(resp => {
      if (resp) {
        this.bank = resp as unknown as BankDto;
        this.branches = this.bank.branches as unknown as BranchDto[];
      }
    });
  }

  initVehicles() {
    this.appMasterService.GetVehicleTypes().subscribe((resp) => {
      this.vehicleTypes = resp as unknown as VehicleTypeViewDto[];
      console.log(this.vehicleTypes);
    });
  }

  tptForm() {
    this.fbTpt = this.formbuilder.group({
      hglId: [0],
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
      glcode: ['', Validators.pattern(ALPHA_NUMERIC)],
      subGlcode: ['', Validators.pattern(ALPHA_NUMERIC)],
      otherCode: ['', Validators.pattern(ALPHA_NUMERIC)],
      branchId: ['', (Validators.required)],
      accountNo: new FormControl('', [Validators.required, Validators.pattern(NUMERIC_ONLY)]),
      aadhaarNo:new FormControl('', [Validators.required, Validators.pattern(NUMERIC_ONLY)]),
      isActive: [false],
      subHgls: this.formbuilder.array([]),
    });
  }
 

  get FormControls() {
    return this.fbTpt.controls;
  }

  /* Form Array For Tpt Details */

  faSubHgl(): FormArray {
    return this.fbTpt.get("subHgls") as FormArray;
  }

  addSubHgl() {
    this.showTptDetails = true;
    this.faSubHgl().push(this.generateRow());
  }

  generateRow(subHgl: SubHglViewDto = new SubHglViewDto()): FormGroup {
    debugger
    if (!this.addFlag) subHgl.hglId = this.hgl.hglId;
    return this.formbuilder.group({
      subHglId: subHgl.subHglId == undefined ? 0 : subHgl.subHglId,
      hglId: subHgl.hglId,subHgl,
      code: new FormControl(subHgl.code,),
      name: [subHgl.name, (Validators.required)],
      vehicleTypeId:[subHgl.vehicleTypeId, (Validators.required)],
      noOfPersons:[subHgl.noOfPersons, (Validators.required)],
      isActive: subHgl.isActive
    });
  }

  editHgl(hgl: HglViewDto) {
    this.hgl.hglId = hgl.hglId;
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
    this.hgl.accountNo = hgl.accountNo;
    this.hgl.aadhaarNo=hgl. aadhaarNo;
    this.hgl.isActive = hgl.isActive;
    this.hgl.subHgls = this.subHgls ? [] : this.subHgls;
    this.fbTpt.setValue(this.hgl);
    this.addFlag = false;
    this.submitLabel = "Update TPT";
    this.showDialog = true;
    this.showTptDetails = true;
  }

  addHgl() {
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



  saveHgl(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.appMasterService.CreateHgl(this.fbTpt.value)
    else return this.appMasterService.UpdateHgl(this.fbTpt.value)
  }

  onSubmit() {
    // this.fbTpt.value.tds = false;
    // this.fbTpt.value.tptId = 0;

    this.fbTpt.value.pinCode = this.fbTpt.value.pinCode + "";
    // this.fbTpt.value.tptdetails.vehicleTypeId = 1;
    console.log(this.fbTpt.value);
    if (this.fbTpt.valid) {
      this.saveHgl().subscribe(resp => {
        if (resp) {
          this.inithgls();
          this.fbTpt.reset();
          this.showDialog = false;
        }
      })
    }
    else {
      this.fbTpt.markAllAsTouched();
    }
  }

  onClose() {
    this.fbTpt.reset();
    this.faSubHgl().clear();
    this.showTptDetails = false;
  }

}
