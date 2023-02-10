import { HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { BillParameterDto, BillParameterViewDto } from 'src/app/_models/billingmaster';
import { BillMasterService } from 'src/app/_services/billmaster.service';

@Component({
  selector: 'app-billparameters',
  templateUrl: './billparameters.component.html',
  styles: [
  ],
})
export class BillParametersComponent implements OnInit {
  billParameters: BillParameterViewDto[] = [];
  billParam: BillParameterDto = new BillParameterDto();
  loading: boolean = false;
  filter: any;
  showDialog: boolean = false;
  fbBillParameters!: FormGroup;
  addFlag: boolean = true;
  globalFilterFields: string[] = ['id', 'type', 'code', 'name', 'caluclationType', 'formula', 'priority', 'isActive', 'createdAt', 'createdByUser', 'updatedAt', 'updatedByUser'];
  submitLabel!: string;

  constructor(private formbuilder: FormBuilder,
    private billmasterService: BillMasterService) { }

  ngOnInit(): void {
    this.loadBillParams();
    this.billmasterForm();
  }

  loadBillParams() {
    this.billmasterService.GetBillParameters().subscribe((resp) => {
      console.log(resp);

      this.billParameters = resp as unknown as BillParameterViewDto[];
      console.log(this.billParameters);
    });
  }

  billmasterForm() {
    this.fbBillParameters = this.formbuilder.group({
      billParameterId: [0],
      categoryId: ['', (Validators.required)],
      type: ['', (Validators.required)],
      code: ['', (Validators.required)],
      name: ['', (Validators.required)],
      caluclationType: ['', Validators.required],
      priority: ['', Validators.required],
      formula: ['', Validators.required],
      isActive: [true, Validators.requiredTrue]
    });
  }

  get FormControls() {
    return this.fbBillParameters.controls;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  addBillParam() {
    this.submitLabel = "Add Bill";
    this.addFlag = true;
    this.showDialog = true;
  }

  editBillParam(billParam: BillParameterViewDto) {
    this.billParam.billParameterId = billParam.id;
    this.billParam.categoryId = billParam.billCategoryId;
    this.billParam.type = billParam.type
    this.billParam.code = billParam.code;
    this.billParam.name = billParam.name;
    this.billParam.caluclationType = billParam.caluclationType;
    this.billParam.priority = billParam.priority;
    this.billParam.formula = billParam.formula;
    this.billParam.isActive = billParam.isActive;
    this.fbBillParameters.setValue(this.billParam);
    this.addFlag = false;
    this.submitLabel = "Update Bill";
    this.showDialog = true;
  }

  saveBillParam(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.billmasterService.CreateBillParam(this.fbBillParameters.value)
    else return this.billmasterService.UpdateBillParam(this.fbBillParameters.value)
  }

  onSubmit() {
    if (this.fbBillParameters.valid) {
     console.log(this .fbBillParameters.value);
      this.saveBillParam().subscribe(resp => {
        if (resp) {
          this.loadBillParams();
          this.fbBillParameters.reset();
          this.showDialog = false;
        }
      })
    }
    else {
      this.fbBillParameters.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.billParameters = [];
    this.billParam = new BillParameterDto();
  }

}
