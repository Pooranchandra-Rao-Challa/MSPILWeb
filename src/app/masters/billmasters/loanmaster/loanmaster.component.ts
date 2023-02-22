import { HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs/internal/Observable';
import { LookupDetailViewDto, LookUpHeaderDto, LookupViewDto } from 'src/app/_models/applicationmaster';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { BillMasterService } from 'src/app/_services/billmaster.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { LoanTypeViewDto, LoanTypeDto, LoanSubTypeDto, LoanSubTypeViewDto } from '../../../_models/billingmaster';



@Component({
  selector: 'app-loanmaster',
  templateUrl: './loanmaster.component.html',
  styles: [
  ]
})

export class LoanMasterComponent implements OnInit {

  showDialog: boolean = false;
  loantypes: LoanTypeViewDto[] = [];
  loantype: LoanTypeDto = new LoanTypeDto();
  loanSubTypes: LoanTypeViewDto[] = [];
 
  filter: any;
  dataShown: boolean = false;
  ShowlookupDetails: boolean = false;
  addfields: any;
  loading: boolean = true;
  fblookup!: FormGroup;
  fbloantype!: FormArray;
  addFlag: boolean = true;
  submitLabel!: string;
  globalFilterFields: string[] = ['code', 'name', 'isActive', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy'];
  billCategories: any;


  constructor(private formbuilder: FormBuilder,
    private appMasterService: AppMasterService,
    private billmasterService: BillMasterService,
    private lookupService: LookupService) {}

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
    this.submitLabel = "Add LoanType";
    this.addFlag = true;
    this.showDialog = true;
  }

  ngOnInit(): void {
    this.lookupForm();
    this.GetLookUp();
  }
  lookupForm() {
    this.addfields = []
    this.fblookup = this.formbuilder.group({
      lookUpId: [0],
      code: ['', (Validators.required)],
      name: ['', (Validators.required)],
      isActive: [true],
      loanSubTypes: this.formbuilder.array([]),
    });
  }
  // add lookupdtls fields
  addLookupDtls() {
    this.ShowlookupDetails = true;
    this.fbloantype = this.fblookup.get("loanSubTypes") as FormArray
    this.fbloantype.push(this.generaterow())
  }
  falookupDtls(): FormArray {
    return this.fblookup.get("loanSubTypes") as FormArray
  }
  generaterow(loanSubTypes: LoanSubTypeViewDto = new LoanSubTypeViewDto()): FormGroup {
    return this.formbuilder.group({
      lookUpDetailId:[0],
      code:[''],
      name:[''],
      remarks:[''],
      listingorder:[0]
    // if (!this.addFlag) lookupDetail.lookUpId = this.lookup.lookUpId;
    // return this.formbuilder.group({
    //   id: lookupDetail.lookUpDetailId == undefined ? 0 : lookupDetail.lookUpDetailId,
    //   lookupId: lookupDetail.lookUpId,
    //   lookUpDetailId: lookupDetail.lookUpDetailId,
    //   code: lookupDetail.code,
    //   name: lookupDetail.name,
    //   remarks: lookupDetail.remarks,
    //   listingorder: lookupDetail.listingorder,
    //   isActive: lookupDetail.isActive,
    })
  }

  //  post lookup 
  savelookup(): Observable<HttpEvent<LookUpHeaderDto>> {
    if (this.addFlag) return this.appMasterService.Createlookup(this.fblookup.getRawValue())
    else return this.appMasterService.Updatelookup(this.fblookup.getRawValue())
  }
  onClose() {
    this.fblookup.reset();
    this.falookupDtls().clear();
  }
  onSubmit() {
    if (this.fblookup.valid) {
      this.savelookup().subscribe(resp => {
        if (resp) {
          this.GetLookUp();
          this.onClose();
          this.showDialog = false;
        }
      })
    }
    else {
      this.fblookup.markAllAsTouched();
    }
  }

  // getmethod
  GetLookUp() {
    this.billmasterService.GetLoanTypes().subscribe((resp) => {
      this.loantypes = resp as unknown as LoanTypeViewDto[];
      console.log(this.loantypes);
      this.loading = false;
    })
  }
  initlookupDetails(loanTypeId: number) {
    this.appMasterService.GetlookupDetails(loanTypeId).subscribe((resp) => {
      this.loanSubTypes = resp as unknown as LoanSubTypeViewDto[];
      console.log(this.loanSubTypes)
      this.loanSubTypes.forEach((loanSubTypes) => {
        this.falookupDtls().push(this.generaterow(loanSubTypes));
      })
    });
  }
  editLookUp(lookup: LookUpHeaderDto) {
    // this.initlookupDetails(lookup.lookUpId);
    // this.lookup.lookUpId = lookup.lookUpId;
    // this.lookup.code = lookup.code;
    // this.lookup.name = lookup.name;
    // this.lookup.isActive = lookup.isActive;
    // this.lookup.lookUpDetails = this.lookUpDetails ? [] : this.lookUpDetails;
    // this.fblookup.setValue(this.lookup);
    // this.addFlag = false;
    // this.submitLabel = "Update Lookup";
    // this.showDialog = true;
    // this.ShowlookupDetails = true;
  }
}



