import { HttpEvent } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs/internal/Observable';
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { FormArrayValidationForDuplication } from 'src/app/_common/uniqeBranchValidators/unique-branch-validator';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { LookupDetailViewDto, LookUpHeaderDto, LookupViewDto } from 'src/app/_models/applicationmaster';
import { ITableHeader, MaxLength } from 'src/app/_models/common';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { MAX_LENGTH_2, MAX_LENGTH_20, MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY } from 'src/app/_shared/regex';
@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',

})
export class LookupComponent implements OnInit {
  globalFilterFields: string[] = ['code', 'name', 'isActive', 'createdBy', 'updatedBy', 'createdAt', 'updatedAt']
  @ViewChild('filter') filter!: ElementRef;
  showDialog: boolean = false;
  lookups: LookupViewDto[] = [];
  lookupDetails: LookupDetailViewDto = new LookupDetailViewDto();
  lookup: LookUpHeaderDto = new LookUpHeaderDto();
  dataShown: boolean = false;
  ShowlookupDetails: boolean = false;
  addfields: any;
  fblookup!: FormGroup;
  falookUpDetails!: FormArray;
  addFlag: boolean = true;
  submitLabel!: string;
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
    return this.fblookup.controls;
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
  addLookupDialog() {
    this.addLookupDetails();
     this.fblookup.controls['name'].enable();
    this.fblookup.controls['isActive'].setValue(true);
    this.submitLabel = "Add Lookup";
    this.addFlag = true;
    this.showDialog = true;
  }

  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    this.lookupForm();
    this.GetLookUp();
  }
  lookupForm() {
    this.addfields = []
    this.fblookup = this.formbuilder.group({
      lookUpId: [null],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      isActive: [null],
      lookUpDetails: this.formbuilder.array([],FormArrayValidationForDuplication()),
    });
  }

  // add lookupdtls fields
  addLookupDetails() {
    this.ShowlookupDetails = true;
    this.falookUpDetails = this.fblookup.get("lookUpDetails") as FormArray
    this.falookUpDetails.push(this.generaterow())
  }
  falookupDetails(): FormArray {
    return this.fblookup.get("lookUpDetails") as FormArray
  }
  generaterow(lookupDetail: LookupDetailViewDto = new LookupDetailViewDto()): FormGroup {
    return this.formbuilder.group({
      lookupId: [lookupDetail.lookupId],
      lookupDetailId: [lookupDetail.lookupDetailId],
      code: new FormControl(lookupDetail.code, [Validators.required,]),
      name: new FormControl(lookupDetail.name, [Validators.required, Validators.minLength(MIN_LENGTH_2)]),
      remarks: new FormControl(lookupDetail.remarks, [Validators.pattern(RG_ALPHA_NUMERIC)]),
      listingorder: new FormControl(lookupDetail.listingorder, [Validators.required,]),
      isActive: [lookupDetail.isActive],
    })
  }
  formArrayControls(i: number, formControlName: string) {
    return this.falookupDetails().controls[i].get(formControlName);
  }
  //  post lookup
  savelookup(): Observable<HttpEvent<LookUpHeaderDto>> {
    if (this.addFlag) return this.appMasterService.Createlookup(this.fblookup.value)
    else return this.appMasterService.Updatelookup(this.fblookup.value)
  }
  onClose() {
    this.fblookup.reset();
    this.ShowlookupDetails = false;
    this.falookupDetails().clear();
  }

  isUniqueLookupCode() {
    const existingLookupCodes = this.lookups.filter(lookup =>
      lookup.code === this.fblookup.value.code &&
      lookup.id !== this.fblookup.value.lookUpId
    )
    return existingLookupCodes.length > 0;
  }

  isUniqueLookupName() {
    const existingLookupNames = this.lookups.filter(lookup =>
      lookup.name === this.fblookup.value.name &&
      lookup.id !== this.fblookup.value.lookUpId
    )
    return existingLookupNames.length > 0;
  }
  onSubmit() {
    if (this.fblookup.valid) {
      if (this.addFlag) {
        if (this.isUniqueLookupCode()) {
          this.alertMessage.displayErrorMessage(
            `Lookup Code :"${this.fblookup.value.code}" Already Exists.`
          );
        } else if (this.isUniqueLookupName()) {
          this.alertMessage.displayErrorMessage(
            `Lookup Name :"${this.fblookup.value.name}" Already Exists.`
          );
        } else {
          this.save();
        }
      } else {
        this.save();
      }
    } else {
      this.fblookup.markAllAsTouched();
    }
  }

  save() {
    if (this.fblookup.valid) {
      this.savelookup().subscribe(resp => {
        if (resp) {
          this.GetLookUp();
          this.onClose();
          this.showDialog = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMAMLU001" : "SMAMLU002"]);
        }
      })
    }
    else {
      this.fblookup.markAllAsTouched();
    }
  }
  // getmethod
  GetLookUp() {
    this.appMasterService.GetlookUp().subscribe((resp) => {
      this.lookups = resp as unknown as LookupViewDto[];
      console.log(this.lookups);
    })
  }
  initlookupDetails(lookupId: number) {
    this.appMasterService.GetlookupDetails(lookupId).subscribe((resp) => {
      this.lookupDetails = resp as unknown as LookupDetailViewDto;
      console.log(this.lookupDetails);
      this.lookupDetails.lookupDetails?.forEach((lookupDetails: LookupDetailViewDto) => {
        this.falookupDetails().push(this.generaterow(lookupDetails));
      })
    });
  }
  editLookUp(lookup: LookupViewDto) {
    this.initlookupDetails(lookup.id);
    this.lookup.lookUpId = lookup.id;
    this.lookup.lookupDetailId = lookup.lookupDetailId;
    this.lookup.code = lookup.code;
    this.lookup.name = lookup.name;
    // this.fblookup.controls['name'].setValue(lookup.name);
    // this.fblookup.controls['name'].disable();
    this.lookup.isActive = lookup.isActive;
    this.lookup.lookUpDetails = this.lookupDetails ? [] : this.lookupDetails;
    this.fblookup.patchValue(this.lookup);
    this.addFlag = false;
    this.submitLabel = "Update Lookup";
    this.showDialog = true;
    this.ShowlookupDetails = true;
  }
  ngOnDestroy() {
    this.lookups = [];
    this.lookupDetails = new LookupDetailViewDto();
  }
}



