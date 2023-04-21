import { HttpEvent } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { BankDto, BankViewDto, BranchDto, BranchViewDto } from 'src/app/_models/applicationmaster';
import { MaxLength } from 'src/app/_models/common';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { MAX_LENGTH_20, MAX_LENGTH_25, MAX_LENGTH_6, MIN_LENGTH_11, MIN_LENGTH_2, MIN_LENGTH_6, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY, RG_NUMERIC_ONLY } from 'src/app/_shared/regex';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styles: [
  ]
})
export class BankComponent implements OnInit {
  display: boolean = false;
  showDialog: boolean = false;
  bank: BankDto = new BankDto()
  banks: BankViewDto[] = [];
  branches: BranchViewDto = new BranchViewDto();
  @ViewChild('filter') filter!: ElementRef;
  ShowbranchDetails: boolean = false;
  addfields: any;
  fbbank!: FormGroup
  fabranch!: FormArray;
  submitLabel!: string;
  addFlag: boolean = true;
  mediumDate: string = MEDIUM_DATE;
  maxLength: MaxLength = new MaxLength();
  permissions: any;
  
  constructor(private formbuilder: FormBuilder,
    private appMasterService: AppMasterService,
    private alertMessage: AlertMessage,
    private jwtService:JWTService) { }

  get FormControls() {
    return this.fbbank.controls;
  }

  onGlobalFilter(table: Table, event: Event) {
    
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    this.BankForm();
    this.initBank();
  }
  BankForm() {
    this.fbbank = this.formbuilder.group({
      bankId: [null],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_6)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      abbr: ['',[ Validators.minLength(MIN_LENGTH_2)]],
      isActive: [null],
      branches: this.formbuilder.array([]),
    });
  }
  addBranches() {
    this.ShowbranchDetails = true;
    this.fabranch = this.fbbank.get("branches") as FormArray
    this.fabranch.push(this.generateRow())
  }
  fabranchDetails() {
    return this.fbbank.get("branches") as FormArray
  }
  initBankdailog() {
    this.addBranches();
    this.fbbank.controls['isActive'].setValue(true);
    this.submitLabel = "Add Bank";
    this.addFlag = true;
    this.showDialog = true;
  }
  generateRow(branchDetail: BranchViewDto = new BranchViewDto()): FormGroup {
    if (!this.addFlag) branchDetail.bankId = this.bank.bankId;
    return this.formbuilder.group({
      bankId: [branchDetail.bankId],
      branchId: [branchDetail.branchId],
      code: new FormControl(branchDetail.code, [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      name: new FormControl(branchDetail.name, [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2)]),
      ifsc: new FormControl(branchDetail.ifsc, [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.maxLength(MAX_LENGTH_25),Validators.minLength(MIN_LENGTH_11)]),
      abbr: [""],
      address: [branchDetail.address, (Validators.required)],
      pinCode: new FormControl(branchDetail.pinCode, [Validators.required, Validators.pattern(RG_NUMERIC_ONLY), Validators.maxLength(MIN_LENGTH_6)]),
      phoneNo: [branchDetail.phoneNo],
      email: [branchDetail.email],
      isActive: [branchDetail.isActive],
    })
  }

  formArrayControls(i: number, formControlName: string) {
    return this.fabranchDetails().controls[i].get(formControlName);
  }
  initBank() {
    this.appMasterService.GetBanks().subscribe((resp) => {
      this.banks = resp as unknown as BankViewDto[];
      console.log(this.banks);
    });
  }
  onClose() {
    this.fbbank.reset();
    this.ShowbranchDetails = false;
    this.fabranchDetails().clear();
  }
  saveBank(): Observable<HttpEvent<BankDto>> {
    if (this.addFlag) return this.appMasterService.CreateBank(this.fbbank.value)
    else return this.appMasterService.UpdateBank(this.fbbank.value)
  }
  onSubmit() {
    if (this.fbbank.valid) {
      console.log(this.fbbank.value);
      this.saveBank().subscribe(resp => {
        if (resp) {
          this.initBank();
          this.onClose();
          this.showDialog = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMAMBA001" : "SMAMBA002"]);
        }
      })
    }
    else {
      this.fbbank.markAllAsTouched();
    }
  }
  initBranch(bankId: number) {
    this.appMasterService.GetBranchDetails(bankId).subscribe((resp) => {
      this.branches = resp as unknown as BranchViewDto;
      console.log(this.fbbank);
      this.branches.branches?.forEach((branches: BranchViewDto) => {
        this.fabranchDetails().push(this.generateRow(branches));
      })
    });
  }

  editBank(bank: BankViewDto) {
    this.initBranch(bank.bankId);
    this.bank.bankId = bank.bankId;
    this.bank.branchId = bank.branchId;
    this.bank.code = bank.code;
    this.bank.name = bank.name;
    this.bank.abbr = bank.abbr;
    this.bank.isActive = bank.isActive;
    this.bank.branches = this.branches ? [] : this.branches;
    this.fbbank.patchValue(this.bank);
    this.addFlag = false;
    this.submitLabel = "Update Bank";
    this.showDialog = true;
    this.ShowbranchDetails = true;
  }

  ngOnDestroy() {
    this.banks = [];
    this.branches = new BranchViewDto();
  }
}
