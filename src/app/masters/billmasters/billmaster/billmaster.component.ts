import { BillMasterService } from 'src/app/_services/billmaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { BillViewDto } from 'src/app/_models/billingmaster';
@Component({
  selector: 'app-billmaster',
  templateUrl: './billmaster.component.html',
  styles: [
  ]
})
export class BillMasterComponent implements OnInit {
  bills: BillViewDto[] = [];
  billCategories: { categoryId: number | undefined; categoryName: string | undefined; }[] = [];
  globalFilterFields: string[] = ["billCategoryName", "billNo", "seasonName", "fromDate", "toDate", "runDate", "isFinal", "isActive", "createdAt", "createdBy",
    "updatedAt", "updatedBy"];
  loading: boolean = true;
  @ViewChild('filter') filter!: ElementRef;
  showDialog: boolean = false;
  fbBillMaster!: FormGroup;
  seasons: any;
  addFlag: any;

  constructor(private formbuilder: FormBuilder,
    private commonService: CommonService,
    private billmasterService: BillMasterService) { }

  ngOnInit(): void {
    this.loadBills();
    this.loadDefaults();
    this.billmasterForm();
  }

  loadDefaults() {
    this.commonService.GetSeasons().subscribe((resp) => {
      this.seasons = resp;
    });
  }

  loadBills() {
    this.billmasterService.GetBills().subscribe((resp) => {
      this.bills = resp as unknown as BillViewDto[];
      this.loading = false;
      if (this.bills.length) {
        this.billCategories = this.bills.map((obj) => ({
          categoryId: obj.billCategoryId,
          categoryName: obj.billCategoryName
        }));
      }
    });
  }

  billmasterForm() {
    this.fbBillMaster = this.formbuilder.group({
      billNo: [''],
      categoryId: [''],
      seasonsId: ['', (Validators.required)],
      fromDate: ['', (Validators.required)],
      toDate: ['', (Validators.required)],
      isFinal: [true, Validators.requiredTrue],
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

  saveBill(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.billmasterService.CreateBill(this.fbBillMaster.value)
    else return this.billmasterService.UpdateBill(this.fbBillMaster.value)
  }

  onSubmit() {
    if (this.fbBillMaster.valid) {
      this.fbBillMaster.value.billNo = 1;
      this.fbBillMaster.value.categoryId = 1;
      this.billmasterService.CreateBill(this.fbBillMaster.value).subscribe(resp => {
        if (resp) {
          this.loadBills();
          this.fbBillMaster.reset();
          this.showDialog = false;
        }
      })
    }
    else {
      this.fbBillMaster.markAllAsTouched();
    }
  }

}
