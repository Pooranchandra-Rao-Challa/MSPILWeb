import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  globalFilters: string[] = ["Code", "Name", "IsActive", "CreatedDate", "CreatedBy", "UpdatedDate", "UpdatedBy"];

  constructor() {
    this.roles = [
      { Code: '123456', Name: 'sai1', IsActive: true, CreatedDate: "25/01/2023", CreatedBy: 'Acc1', UpdatedDate: "25/01/2023", UpdatedBy: "hghj" },
      { Code: '123', Name: 'kiran1', IsActive: true, CreatedDate: "25/01/2023", CreatedBy: 'accont1', UpdatedDate: "25/01/2023", UpdatedBy: "saio" },
      { Code: '345', Name: 'kumar1', IsActive: true, CreatedDate: "25/01/2023", CreatedBy: 'fit1', UpdatedDate: "25/01/2023", UpdatedBy: "hgh" }
    ];
    this.loading = false;
  }

  ngOnInit(): void {
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  showDialog() {
    this.dialog = true;
  }
}
