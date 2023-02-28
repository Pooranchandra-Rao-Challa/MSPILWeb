import { HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs/internal/Observable';
import { LookupDetailViewDto, LookUpHeaderDto, LookupViewDto } from 'src/app/_models/applicationmaster';
import { AppMasterService } from 'src/app/_services/appmaster.service';



@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',

})
export class LookupComponent implements OnInit {

  showDialog: boolean = false;
  look: LookupViewDto[] = [];
  lookupDetails: LookupDetailViewDto = new LookupDetailViewDto();
  lookup: LookUpHeaderDto = new LookUpHeaderDto();
  filter: any;
  dataShown: boolean = false;
  ShowlookupDetails: boolean = false;
  addfields: any;
  loading: boolean = true;
  fblookup!: FormGroup;
  lookUpDetails!: FormArray;
  addFlag: boolean = true;
  submitLabel!: string;
  globalFilterFields: string[] = ['code', 'name', 'isActive', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy'];
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
      lookUpId: [0],
      code: ['', (Validators.required)],
      name: ['', (Validators.required)],
      isActive: [true],
      lookUpDetails: this.formbuilder.array([]),
    });
  }
  // add lookupdtls fields
  addLookupDtls() {
    this.ShowlookupDetails = true;
    this.lookUpDetails = this.fblookup.get("lookUpDetails") as FormArray
    this.lookUpDetails.push(this.generaterow())
  }
  falookupDtls(): FormArray {
    return this.fblookup.get("lookUpDetails") as FormArray
  }
  generaterow(lookupDetail: LookupDetailViewDto = new LookupDetailViewDto()): FormGroup {
    return this.formbuilder.group({
      lookupId: [lookupDetail.lookupId],
      lookUpDetailId:[lookupDetail.lookUpDetailId],
      code: [lookupDetail.code],
      name: [lookupDetail.name],
      remarks: [lookupDetail.remarks],
      listingorder: [lookupDetail.listingorder],
      isActive: [lookupDetail.isActive],
    })
  }

  //  post lookup 
  savelookup(): Observable<HttpEvent<LookUpHeaderDto>> {
    if (this.addFlag) return this.appMasterService.Createlookup(this.fblookup.value)
    else return this.appMasterService.Updatelookup(this.fblookup.value)
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
    this.appMasterService.GetlookUp().subscribe((resp) => {
      this.look = resp as unknown as LookupViewDto[];
      console.log(this.look);
      this.loading = false;
    })
  }
  initlookupDetails(lookupId: number) {
    this.appMasterService.GetlookupDetails(lookupId).subscribe((resp) => {
      this.lookupDetails = resp as unknown as LookupDetailViewDto;
      console.log(this.lookupDetails);
      this.lookupDetails.lookupDetails?.forEach((lookupDetails: LookupDetailViewDto) => {
        this.falookupDtls().push(this.generaterow(lookupDetails));
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
}



