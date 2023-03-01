import { HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { BankDto, BankViewDto,BranchViewDto } from 'src/app/_models/applicationmaster';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { MAX_LENGTH_10,  MAX_LENGTH_20,  MAX_LENGTH_25,  MAX_LENGTH_6,  MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY, RG_NUMERIC_ONLY } from 'src/app/_shared/regex';

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
  Bank: BankViewDto[] = [];
  branches: BranchViewDto = new BranchViewDto();
  //branch:BranchDto = new BranchDto();
  filter: any;
  ShowbranchDetails: boolean = false;
  addfields: any;
  loading: boolean = true;
  fbbank!: FormGroup
  fabranch!: FormArray;
  submitLabel!: string;
  addFlag: boolean = true;
  globalFilterFields: string[] = ['code', 'name','ifsc','address','pinCode', 'isActive', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy'];
  mediumDate: string = MEDIUM_DATE;
  constructor(private formbuilder: FormBuilder,
    private appMasterService: AppMasterService,) { }

  get FormControls() {
    return this.fbbank.controls;
  }
  ngOnInit(): void {
    this.BankForm();
    this.initBank();
  }
  BankForm() {
    this.fbbank = this.formbuilder.group({
      bankId: [0],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_6)]),
      name:new FormControl('', [Validators.required,Validators.pattern(RG_ALPHA_ONLY)]),
      abbr: [''],
      isActive: [true],
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
  generateRow(branchDetail: BranchViewDto = new BranchViewDto()): FormGroup {
    if (!this.addFlag) branchDetail.bankId = this.bank.bankId;
    return this.formbuilder.group({
      bankId: [branchDetail.bankId],
      branchId: [branchDetail.branchId],
      code:new FormControl(branchDetail.code,[Validators.required,Validators.minLength(MIN_LENGTH_2),Validators.maxLength(MAX_LENGTH_20)]),
      name:[branchDetail.name,(Validators.required)],
      ifsc: new FormControl(branchDetail.ifsc,[Validators.required,Validators.pattern(RG_ALPHA_NUMERIC),Validators.maxLength(MAX_LENGTH_25)]),
      abbr: [""],
      address:[branchDetail.address,(Validators.required)],
      pinCode: new FormControl(branchDetail.pinCode,[Validators.required,Validators.pattern(RG_NUMERIC_ONLY),Validators.maxLength(MAX_LENGTH_6)]),
      phoneNo: [branchDetail.phoneNo],
      email: [branchDetail.email],
      isActive: [branchDetail.isActive],
    })
  }
  addBank() {
    this.submitLabel = "Add Bank";
    this.onClose();
    this.addFlag = true;
    this.showDialog = true;
  }
  formArrayControls(i: number, formControlName: string) {
    return this.fabranchDetails().controls[i].get(formControlName);
  }
  initBank() {
     this.appMasterService.GetBanks().subscribe((resp) => {
      this.Bank = resp as unknown as BankViewDto[];
      console.log(this.Bank);
      this.loading = false;
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
        }
      })
    }
    else {
      this.fbbank.markAllAsTouched();
    }
  }
  // showData() {
  //   this.ShowbranchDetails = true;
  //   this.addfields.push(this.fbbank.value);
  // }
  initBranch(bankId: number) {
    this.appMasterService.GetBranchDetails(bankId).subscribe((resp) => {
      this.branches = resp as unknown as BranchViewDto;
      console.log(this.fbbank.value);
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
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
  
  // ngOnDestroy() {
  //   this.Bank = [];
  //   this.bank = new BankDto();
  // }
}
