import { HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs/internal/Observable';
import { LookUpHeaderDto, LookupViewDto } from 'src/app/_models/applicationmaster';
import { AppMasterService } from 'src/app/_services/appmaster.service';



@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',

})
export class LookupComponent implements OnInit {

  showDialog: boolean = false;
  look: LookupViewDto[] = [];
  lookup: LookUpHeaderDto = new LookUpHeaderDto();
  filter: any;
  dataShown: boolean = false;
  addfields: any;
  loading: boolean = true;
  fblookup!: FormGroup;
  lookUpDetails!: FormArray;
  addFlag: boolean = true;
  submitLabel!: string;
  constructor(private formbuilder: FormBuilder,
    private appmasterservice: AppMasterService,) { }

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
      code: ['', (Validators.required)],
      name: ['', (Validators.required)],
      isActive: ['',],
      lookUpDetails: this.formbuilder.array([]),
    });
  }

  // add lookupdtls fields
  addLookupDtls() {
    this.dataShown = true;
    this.lookUpDetails = this.fblookup.get("lookUpDetails") as FormArray
    this.lookUpDetails.push(this.generaterow())
  }
  get lookupDtl() {
    return this.fblookup.get("lookUpDetails") as FormArray
  }
  generaterow() {
    return this.formbuilder.group({
      code:[''],
      name:[''],
      remarks:[''],
      listingorder:[0]
    })
  }

  //  post lookup 
  savelookup(): Observable<HttpEvent<LookUpHeaderDto>> {
    if (this.addFlag) return this.appmasterservice.Createlookup(this.fblookup.getRawValue())
    else return this.appmasterservice.Updatelookup(this.fblookup.getRawValue())
  }
  onClose() {
    this.fblookup.reset();
  }
  onSubmit() {
    if(this.fblookup.valid) {
      this.savelookup().subscribe(resp => {
        if (resp) {
          this.GetLookUp();
          this.onClose();
          this.showDialog = false;
        }
      })
    }
    else {
      // alert("please fill the fields")
      this.fblookup.markAllAsTouched();
    }
  }

  // getmethod
  GetLookUp() {
    this.appmasterservice.GetlookUp().subscribe((resp) => {
      this.look = resp as unknown as LookupViewDto[];
      console.log(this.look);
      this.loading = false;
    })
  }
 
}



