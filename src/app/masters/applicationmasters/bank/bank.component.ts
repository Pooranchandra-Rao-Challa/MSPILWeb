import { HttpEvent } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { BankDto, BankViewDto, BranchDto, BranchViewDto } from 'src/app/_models/applicationmaster';
import { ITableHeader, MaxLength } from 'src/app/_models/common';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { MAX_LENGTH_20, MAX_LENGTH_25, MAX_LENGTH_6, MIN_LENGTH_11, MIN_LENGTH_2, MIN_LENGTH_6, RG_ADDRESS, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY, RG_IFSC, RG_NUMERIC_ONLY, RG_PINCODE } from 'src/app/_shared/regex';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styles: [
  ]
})
export class BankComponent implements OnInit {
  globalFilterFields: string[] = ['code', 'name', 'isActive', 'createdBy', 'createdAt', 'updatedBy', 'updatedAt']
  display: boolean = false;
  showDialog: boolean = false;
  bank: BankDto = new BankDto()
  banks: BankViewDto[] = [];
  // branches: BranchViewDto[] = [];  
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

  headers: ITableHeader[] = [
    { field: 'code', header: 'code', label: 'Code' },
    { field: 'name', header: 'name', label: 'Name' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ];
  constructor(private formbuilder: FormBuilder,
    private appMasterService: AppMasterService,
    private alertMessage: AlertMessage,
    private jwtService: JWTService) { }

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
      abbr: [null],
      isActive: [null],
      branches: this.formbuilder.array([], this.uniqueBranchValidator()),
    });   
  }
  uniqueBranchValidator(): Validators {
    return (formArray: FormArray): ValidationErrors | null => {
      const branches: BranchViewDto[] = formArray.value;
      const duplicateControls: AbstractControl<any, any>[] = [];
      const uniqueControls: AbstractControl<any, any>[] = [];
      const duplicateCodeControls: AbstractControl<any, any>[] = [];
      const uniqueCodeControls: AbstractControl<any, any>[] = [];
      formArray.controls.forEach(control => {
      const count = formArray.controls.filter(
        x => x.get("name")!.value
          === control.get("name")!.value
      ).length;
      if (count > 1) {
        if(control.get("name")!.value !=null && control.get("name")!.value !="")
        {
        duplicateControls.push(control);
        }
      } else {
        uniqueControls.push(control);
      }
    });
    formArray.controls.forEach(control => {
      const count1 = formArray.controls.filter(
        x => x.get("code")!.value
          === control.get("code")!.value
      ).length;
      if (count1 > 1) {
        if(control.get("code")!.value !=null && control.get("code")!.value !="")
        {
        duplicateCodeControls.push(control);
        }
      } else {
        uniqueCodeControls.push(control);
      }
    });
    duplicateControls.forEach(duplicateControl => {
      duplicateControl.get("name")!.setErrors(
        Object.assign({}, duplicateControl.get("name")!.errors, {
          notUnique: true
        })
      );
    });
    uniqueControls.forEach((control: any) => {
      let errors = control.get("name").errors;
      if (errors) {
        delete errors.notUnique;
        errors = Object.keys(control.get("name").errors).length ? control.get("name").errors : null;
      }
      control.get("name").setErrors(errors);
    });

    duplicateCodeControls.forEach(duplicateControl => {
      duplicateControl.get("code")!.setErrors(
        Object.assign({}, duplicateControl.get("code")!.errors, {
          notUnique: true
        })
      );
    });

    uniqueCodeControls.forEach((control: any) => {
      let errors = control.get("code").errors;
      if (errors) {
        delete errors.notUnique;
        errors = Object.keys(control.get("code").errors).length ? control.get("code").errors : null;
      }
      control.get("code").setErrors(errors);
    });
    return null;

    };
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
      name: new FormControl(branchDetail.name, [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2) ]),
      ifsc: new FormControl(branchDetail.ifsc, [Validators.required, Validators.pattern(RG_IFSC)]),
      abbr: [""],
      address: new FormControl(branchDetail.address, [Validators.required, Validators.pattern(RG_ADDRESS)]),
      pinCode: new FormControl(branchDetail.pinCode, [Validators.required, Validators.pattern(RG_PINCODE), Validators.maxLength(MIN_LENGTH_6),]),
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
  isUniqueBankCode() {
    const existingBankCodes = this.banks.filter(bank =>
      bank.code === this.fbbank.value.code &&
      bank.bankId !== this.fbbank.value.bankId
    )
    return existingBankCodes.length > 0;
  }

  isUniqueBankName() {
    const existingBankNames = this.banks.filter(bank =>
      bank.name === this.fbbank.value.name &&
      bank.bankId !== this.fbbank.value.bankId
    )
    return existingBankNames.length > 0;
  }

  onSubmit() {
    if (this.fbbank.valid) {
      if (this.addFlag) {
        if (this.isUniqueBankCode()) {
          this.alertMessage.displayErrorMessage(
            `Bnak Code :"${this.fbbank.value.code}" Already Exists.`
          );
        } else if (this.isUniqueBankName()) {
          this.alertMessage.displayErrorMessage(
            `Bank Name :"${this.fbbank.value.name}" Already Exists.`
          );
        } else {
          this.save();
        }
      } else {
        this.save();
      }

    } else {
      this.fbbank.markAllAsTouched();
    }
  }
  save() {
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
