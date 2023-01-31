import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  @ViewChild('filter') filter!: ElementRef;
  roles: any;
  loading: boolean = true;
  dialog: boolean = false;
  roleForm!: FormGroup;
  globalFilters: string[] = ["Code", "Name", "IsActive", "CreatedDate", "CreatedBy", "UpdatedDate", "UpdatedBy"];

  constructor(private formbuilder: FormBuilder) {
    this.roles = [
      { Code: '123456', Name: 'sai1', IsActive: true, CreatedDate: "25/01/2023", CreatedBy: 'Acc1', UpdatedDate: "25/01/2023", UpdatedBy: "hghj" },
      { Code: '123', Name: 'kiran1', IsActive: true, CreatedDate: "25/01/2023", CreatedBy: 'accont1', UpdatedDate: "25/01/2023", UpdatedBy: "saio" },
      { Code: '345', Name: 'kumar1', IsActive: true, CreatedDate: "25/01/2023", CreatedBy: 'fit1', UpdatedDate: "25/01/2023", UpdatedBy: "hgh" }
    ];
    this.loading = false;
  }

  ngOnInit(): void {
    this.roleForm = this.formbuilder.group({
      code: ['', (Validators.required)],
      name: ['', (Validators.required)],
      active: [true, (Validators.requiredTrue)]
    });
  }

  get roleFormControls() {
    return this.roleForm.controls;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  showDialog() {
    this.roleForm.reset();
    this.dialog = true;
  }

  onSubmit() {
    if (this.roleForm.valid) {
      console.log(this.roleForm.value);
    }
    else {
      // alert("please fill the fields")
      this.roleForm.markAllAsTouched();
    }
  }
}
