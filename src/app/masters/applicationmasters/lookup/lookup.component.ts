import { HttpEvent } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs/internal/Observable';
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { LookupDetailViewDto, LookUpHeaderDto, LookupViewDto } from 'src/app/_models/applicationmaster';
import { MaxLength } from 'src/app/_models/common';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { MAX_LENGTH_2, MAX_LENGTH_20, MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY} from 'src/app/_shared/regex';



@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',

})
export class LookupComponent implements OnInit {
  @ViewChild('filter') filter!: ElementRef;
  showDialog: boolean = false;
  lookups: LookupViewDto[] = [];
  lookupDetails: LookupDetailViewDto = new LookupDetailViewDto();
  lookup: LookUpHeaderDto = new LookUpHeaderDto();
  dataShown: boolean = false;
  ShowlookupDetails: boolean = false;
  addfields: any;
  loading: boolean = true;
  fblookup!: FormGroup;
  falookUpDetails!: FormArray;
  addFlag: boolean = true;
  submitLabel!: string;
  mediumDate: string = MEDIUM_DATE;
  maxLength: MaxLength = new MaxLength();

  constructor(private formbuilder: FormBuilder,
    private appMasterService: AppMasterService,
    private alertMessage: AlertMessage) { }

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
      code: new FormControl('',[Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      name: new FormControl('',[Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
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
      lookupDetailId: [lookupDetail.lookupDetailId],
      code: new FormControl(lookupDetail.code, [Validators.required,Validators.pattern(RG_ALPHA_NUMERIC),]),
      name:new FormControl(lookupDetail.name, [Validators.required,Validators.minLength(MIN_LENGTH_2)]),
      remarks:new FormControl (lookupDetail.remarks,[Validators.pattern(RG_ALPHA_NUMERIC),Validators.minLength(MIN_LENGTH_2)]),
      listingorder: new FormControl (lookupDetail.listingorder,[Validators.required,Validators.minLength(MAX_LENGTH_2),]),
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
  onSubmit() {
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
      this.loading = false;
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



