import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { LookupViewDto } from 'src/app/_models/applicationmaster';
import { LookupService } from 'src/app/_services/lookup.service';


@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  
})
export class LookupComponent implements OnInit {

  display: boolean = false;
  showDialog: boolean=false;
  lookup: [] = [];
  filter: any;
  dataShown:boolean=false;
  addfields:any;
  loading: boolean = true;
  fblookup!:FormGroup;
  lookupDtls!:FormArray;
  look:LookupViewDto[]=[];
  constructor(private formbuilder:FormBuilder ,
     private lookupService:LookupService,) { }
 
  get FormControls() {
    return this.fblookup.controls;
  }
  ngOnInit(): void { 
        this.lookupForm(); 
        this. Getlook();

  }
  lookupForm() {
    this.addfields=[]
    this.fblookup= this.formbuilder.group({
      code:['', (Validators.required)],
      name: ['', (Validators.required)],
      isActive:['', Validators.required],
      lookupDtls:this.formbuilder.array([]),

    });
  }
  addlookupdtls(){
    this.dataShown=true;
    this.lookupDtls=this.fblookup.get("lookupDtls") as FormArray
    this.lookupDtls.push(this.generaterow())
  }
  generaterow(){
    return this.formbuilder.group({
      code:[''],
      name:[''],
     remark:[''],
     order:[''] 
    })
  }
  get lookupDtl(){
    return this.fblookup.get("lookupDtls") as FormArray
  }
  onSubmit() {
    if (this.fblookup.valid) {
       console.log(this.fblookup.value)
    }
    else {
      // alert("please fill the fields")
      this.fblookup.markAllAsTouched();
    }
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value='';
  }
  // getmethod
  Getlook(){
      this. lookupService.GetlookUp().subscribe((resp: unknown) => {
          this.look=resp as unknown as LookupViewDto[];
          console.log(this.look);
          
          this.loading = false;
      })
    }

    
}
