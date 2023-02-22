import { HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { BankDto, BankViewDto } from 'src/app/_models/applicationmaster';
import { AppMasterService } from 'src/app/_services/appmaster.service';

@Component({
  selector: 'app-bank',
  templateUrl: './bank.component.html',
  styles: [
  ]
})
export class BankComponent implements OnInit {
  display: boolean = false;
  showDialog: boolean=false;
  Bank: BankViewDto[] = [];
  filter: any;
  dataShown:boolean=false;
  addfields:any;
  loading: boolean = false;
  fbbank!:FormGroup
  branches!: FormArray;
  submitLabel!: string;
  addFlag: boolean = true;
  constructor(private formbuilder:FormBuilder,
    private appMasterService: AppMasterService,) { }
 
  get FormControls() {
    return this.fbbank.controls;
  }
  ngOnInit(): void { 
    this.BankForm(); 
    this.initBank();
  }
  BankForm() {
    this.addfields=[]
    this.fbbank= this.formbuilder.group({
      bankId:[0],
      code:['', (Validators.required)],
      name: ['', (Validators.required)],
      abbr: ['',],
      isActive:[true, Validators.required],
      branches: this.formbuilder.array([]),
    });
  }
  addBranches() {
    this.dataShown = true;
    this.branches = this.fbbank.get("branches") as FormArray
    this.branches.push(this.generateRow())
  }
  get lookupDtl() {
    return this.fbbank.get("branches") as FormArray
  }
  generateRow() {
    return this.formbuilder.group({
      branchId:[0],
      code:[''],
      name:[''],
      ifsc:[''],
      abbr: [''],
      address:[''],
      pinCode: [''],
      phoneNo:[''],
      email:[''],
    })
  }
  
  addBank() {
    this.submitLabel = "Add Bank";
    this.addFlag = true;
    this.showDialog = true;
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
  }
  saveBank(): Observable<HttpEvent<BankDto>> {
    debugger
    if (this.addFlag) return this.appMasterService.CreateBank(this.fbbank.value)
    else return this.appMasterService.UpdateBank(this.fbbank.value)
  }
  onSubmit() {
    debugger
    if (this.fbbank.valid) {
       console.log(this.fbbank.value);
       this. saveBank().subscribe(resp => {
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
  showData(){
    this.dataShown=true;  
    this.addfields.push(this.fbbank.value)
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value='';
  }
}
