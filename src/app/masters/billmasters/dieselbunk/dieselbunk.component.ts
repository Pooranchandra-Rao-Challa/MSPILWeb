import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { DieselBunkViewDto } from 'src/app/_models/billingmaster';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { MAX_LENGTH_6, RG_ADDRESS, RG_ALPHA_ONLY, RG_PINCODE } from 'src/app/_shared/regex';
import { DieselBunkDto } from 'src/app/_models/billingmaster';
import { BillMasterService } from 'src/app/_services/billmaster.service';
import { MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_EMAIL, RG_PHONE_NO } from 'src/app/_shared/regex';
import { ITableHeader, MaxLength } from 'src/app/_models/common';
import { JWTService } from 'src/app/_services/jwt.service';

@Component({
  selector: 'app-dieselbunk',
  templateUrl: './dieselbunk.component.html',
  styles: [
  ]
})
export class DieselBunkComponent implements OnInit {
  dieselBunks: DieselBunkViewDto[] = [];
  dieselBunk: DieselBunkDto = new DieselBunkDto();
  @ViewChild('filter') filter!: ElementRef;
  showDialog: boolean = false;
  fbDieselBunk!: FormGroup;
  addFlag: boolean = true;
  globalFilterFields: string[] = ['code', 'name', 'address', 'pinCode', 'phoneNo', 'email', 'rate', 'glCode', 'subGLCode', 'isActive', 'createdAt', 'createdBy',
    'updatedAt', 'updatedBy'];
  submitLabel!: string;
  mediumDate: string = MEDIUM_DATE;
  maxLength: MaxLength = new MaxLength();
  permissions: any;
  headers: ITableHeader[] = [
    { field: 'code', header: 'code', label: 'Code' },
    { field: 'name', header: 'name', label: 'Name' },
    { field: 'address', header: 'address', label: 'Address' },
    { field: 'pinCode', header: 'pinCode', label: 'Pin Code' },
    { field: 'phoneNo', header: 'phoneNo', label: 'Mobile' },
    { field: 'email', header: 'email', label: 'Email' },
    { field: 'rate', header: 'rate', label: 'Rate' },
    { field: 'glCode', header: 'glCode', label: 'GL Code' },
    { field: 'subGLCode', header: 'subGLCode', label: 'Sub GL Code' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ];

  constructor(private formbuilder: FormBuilder,
    private billmasterService: BillMasterService,
    private alertMessage: AlertMessage,
    private jwtService: JWTService) { }

  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    this.initDieselBunks();
    this.dieselRateForm();
  }

  initDieselBunks() {
    this.billmasterService.GetDieselBunks().subscribe((resp) => {
      this.dieselBunks = resp as unknown as DieselBunkViewDto[];
    });
  }

  dieselRateForm() {
    this.fbDieselBunk = this.formbuilder.group({
      id: [null],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_6)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY)]),
      address: new FormControl('', [Validators.required, Validators.pattern(RG_ADDRESS)]),
      pinCode: new FormControl('', [Validators.required, Validators.pattern(RG_PINCODE)]),
      phoneNo: new FormControl(null, [Validators.pattern(RG_PHONE_NO)]),
      email: new FormControl('', [Validators.pattern(RG_EMAIL)]),
      gLcode: [''],
      subGLcode: [''],
      rate: [null, [Validators.required,Validators.pattern(/^\d+(\.\d{1,3})?$/)]],
      isActive: [null]
    });
  }

  get FormControls() {
    return this.fbDieselBunk.controls;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }


  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  addDieselBunk() {
    this.fbDieselBunk.controls['isActive'].setValue(true);
    this.submitLabel = "Add Diesel Bunk";
    this.addFlag = true;
    this.showDialog = true;
  }

  editDieselBunk(dieselBunk: DieselBunkViewDto) {
    this.dieselBunk.id = dieselBunk.id;
    this.dieselBunk.code = dieselBunk.code;
    this.dieselBunk.name = dieselBunk.name;
    this.dieselBunk.address = dieselBunk.address;
    this.dieselBunk.pinCode = dieselBunk.pinCode;
    this.dieselBunk.phoneNo = dieselBunk.phoneNo;
    this.dieselBunk.email = dieselBunk.email;
    this.dieselBunk.gLcode = dieselBunk.glCode;
    this.dieselBunk.subGLcode = dieselBunk.subGLCode;
    this.dieselBunk.rate = dieselBunk.rate;
    this.dieselBunk.isActive = dieselBunk.isActive;
    this.fbDieselBunk.setValue(this.dieselBunk);
    this.addFlag = false;
    this.submitLabel = "Update Diesel Bunk";
    this.showDialog = true;
  }

  saveBillParam(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.billmasterService.CreateDieselBunk(this.fbDieselBunk.value)
    else return this.billmasterService.UpdateDieselBunk(this.fbDieselBunk.value)
  }
  isUniqueDieselBunkCode() {
    var existingDieselBunkCodes = this.dieselBunks.filter(DieselBunk => 
      DieselBunk.code == this.fbDieselBunk.value.code && DieselBunk.id != this.fbDieselBunk.value.id
    )
    return existingDieselBunkCodes.length > 0; 
  }
  isUniqueDieselBunkName() {
    var existingDieselBunkCodes = this.dieselBunks.filter(DieselBunk => 
      DieselBunk.name == this.fbDieselBunk.value.name && DieselBunk.id != this.fbDieselBunk.value.id
    )
    return existingDieselBunkCodes.length > 0; 
  }
  onSubmit() {
    if (this.fbDieselBunk.valid) {
      if (this.addFlag) {
        if (this.isUniqueDieselBunkCode()) {
          this.alertMessage.displayErrorMessage(
            `DieselBunk Code :"${this.fbDieselBunk.value.code}" Already Exists.`
          );
        } else if (this.isUniqueDieselBunkName()) {
          this.alertMessage.displayErrorMessage(
            `DieselBunk Name :"${this.fbDieselBunk.value.name}" Already Exists.` 
          );
        } else {
          this.save();
        }
      } else {
        this.save(); 
      }
    } else {
      this.fbDieselBunk.markAllAsTouched(); 
    }
  } 
  save() {
    if (this.fbDieselBunk.valid) {
      this.saveBillParam().subscribe(resp => {
        if (resp) {
          this.initDieselBunks();
          this.fbDieselBunk.reset();
          this.showDialog = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMBMDB001" : "SMBMDB002"]);
        }
      })
    }
    else {
      this.fbDieselBunk.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.dieselBunks = [];
    this.dieselBunk = new DieselBunkDto();
  }

}
