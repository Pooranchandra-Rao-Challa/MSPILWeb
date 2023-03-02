import { HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs/internal/Observable';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { LookupDetailViewDto, LookUpHeaderDto, LookupViewDto } from 'src/app/_models/applicationmaster';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { MAX_LENGTH_20, MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY } from 'src/app/_shared/regex';



@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',

})
export class LookupComponent implements OnInit {

  showDialog: boolean = false;
  lookups: LookupViewDto[] = [];
  lookupDetails: LookupDetailViewDto = new LookupDetailViewDto();
  lookup: LookUpHeaderDto = new LookUpHeaderDto();
  filter: any;
  dataShown: boolean = false;
  ShowlookupDetails: boolean = false;
  addfields: any;
  loading: boolean = true;
  fblookup!: FormGroup;
  falookUpDetails!: FormArray;
  addFlag: boolean = true;
  submitLabel!: string;
  mediumDate: string = MEDIUM_DATE;
  constructor(private formbuilder: FormBuilder,
    private appMasterService: AppMasterService,) { }

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
    this.submitLabel = "Add Lookup";
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
      lookUpId: [null],
      code:new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      name:new FormControl('', [Validators.required,Validators.pattern(RG_ALPHA_ONLY)]),
      isActive: [true],
      lookUpDetails: this.formbuilder.array([]),
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
      lookUpDetailId:[lookupDetail.lookUpDetailId],
      code:new FormControl(lookupDetail.code,[Validators.required,Validators.maxLength(MAX_LENGTH_20)]),
      name: [lookupDetail.name,(Validators.required)],
      remarks: [lookupDetail.remarks],
      listingorder: [lookupDetail.listingorder,(Validators.required)],
      isActive: [lookupDetail.isActive],
    })
  }
  formArrayControls(i: number, formControlName: string) {
    return this. falookupDetails().controls[i].get(formControlName);
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
    this.appMasterService.GetlookUp().subscribe((resp) => {
      this.lookups = resp as unknown as LookupViewDto[];
      console.log(this.lookups);
      this.loading = false;
    })
  }
  initlookupDetails(lookupId: number) {
    this.appMasterService.GetlookupDetails(lookupId).subscribe((resp) => {
      this.lookupDetails = resp as unknown as LookupDetailViewDto;
      console.log(this.lookupDetails);
      this.lookupDetails.lookupDetails?.forEach((lookupDetails: LookupDetailViewDto) => {
        this. falookupDetails().push(this.generaterow(lookupDetails));
      })
    });
  }
  editLookUp(lookup: LookupViewDto) {
    this.initlookupDetails(lookup.id);
    this.lookup.lookUpId = lookup.id;
    this.lookup.code = lookup.code;
    this.lookup.name = lookup.name;
    this.lookup.isActive = lookup.isActive;
    this.lookup.lookupDetails = this.lookupDetails ? [] : this.lookupDetails;
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



