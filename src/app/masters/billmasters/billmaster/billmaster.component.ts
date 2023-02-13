import { LookupService } from './../../../_services/lookup.service';
import { BillMasterService } from 'src/app/_services/billmaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { BillViewDto } from 'src/app/_models/billingmaster';
import { LookupDetailDto } from 'src/app/_models/applicationmaster';
@Component({
  selector: 'app-billmaster',
  templateUrl: './billmaster.component.html',
  styles: [
  ]
})
export class BillMasterComponent implements OnInit {
  bills: BillViewDto[] = [];
  globalFilterFields: string[] = ["billCategoryName", "billNo", "seasonName", "fromDate", "toDate", "runDate", "isFinal", "isActive", "createdAt", "createdBy",
    "updatedAt", "updatedBy"];
  loading: boolean = true;
  @ViewChild('filter') filter!: ElementRef;
  showDialog: boolean = false;
  submitLabel!: string;
  fbBillMaster!: FormGroup;
  seasons: any;
  addFlag: boolean = true;
  billCategories: any;

  constructor(private formbuilder: FormBuilder,
    private commonService: CommonService,
    private billmasterService: BillMasterService,
    private lookupService: LookupService) { }

  ngOnInit(): void {
    this.initBills();
    this.initLookupDetails();
    this.billmasterForm();
  }

  initLookupDetails() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp;
    });

    this.lookupService.BillCategories().subscribe((resp) => {
      this.billCategories = resp;
    });
  }

  initBills() {
    this.billmasterService.GetBills().subscribe((resp) => {
      this.bills = resp as unknown as BillViewDto[];
      this.loading = false;
    });
  }

  billmasterForm() {
    this.fbBillMaster = this.formbuilder.group({
      billNo: [''],
      categoryId: [0],
      seasonsId: ['', (Validators.required)],
      fromDate: ['', (Validators.required)],
      toDate: ['', (Validators.required)],
      isFinal: [true],
      isActive: [true]
    });
  }

  get FormControls() {
    return this.fbBillMaster.controls;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  addBill() {
    this.submitLabel = "Add Bill";
    this.addFlag = true;
    this.showDialog = true;
  }

  // saveBill(): Observable<HttpEvent<any>> {
  //   if (this.addFlag) return this.billmasterService.CreateBill(this.fbBillMaster.value)
  //   else return this.billmasterService.UpdateBill(this.fbBillMaster.value)
  // }

  onSubmit() {
    if (this.fbBillMaster.valid) {
      this.billmasterService.CreateBill(this.fbBillMaster.value).subscribe(resp => {
        if (resp) {
          this.initBills();
          this.fbBillMaster.reset();
          this.showDialog = false;
        }
      })
    }
    else {
      this.fbBillMaster.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.bills = [];
    this.seasons = [];
  }

}
