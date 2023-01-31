import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { UsersViewDto } from 'src/app/_models/security';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @ViewChild('filter') filter!: ElementRef;
  users: any;
  usersList: UsersViewDto[] = [];
  loading: boolean = true;
  dialog: boolean = false;
  globalFilters: string[] = ["UserId", "UserName", "FirstName", "LastName", "EmailId", "MobileNo", "Role", "IMEINo", "IPAddress", "IPRestriction", "IsAdminGate", "IsGross", "IsTare", "IsDumpYard", "IsActive", "CreatedDate", "UpdatedDate"];
  userSections: { section: string; }[];
  userForm!: FormGroup;

  constructor(private formbuilder: FormBuilder) {
    this.users = [
      { UserId: '123456', UserName: 'sai1', FirstName: 'fsas', LastName: 'bdfbd', EmailId: 'Acc1', MobileNo: '46454574', Role: 1, IMEINo: 1, IPAddress: 'hyd', IPRestriction: true, IsAdminGate: false, IsGross: false, IsTare: false, IsDumpYard: false, IsActive: false, CreatedDate: "26/01/2023", UpdatedDate: "26/01/2023" },
      { UserId: '123', UserName: 'kiran1', FirstName: 'vs', LastName: 'dfbbfbf', EmailId: 'accont1', MobileNo: '654656', Role: 2, IMEINo: 2, IPAddress: 'hyd', IPRestriction: false, IsAdminGate: true, IsGross: false, IsTare: false, IsDumpYard: false, IsActive: false, CreatedDate: "26/01/2023", UpdatedDate: "26/01/2023" },
      { UserId: '345', UserName: 'kumar1', FirstName: 'svs', LastName: 'dvbbsd', EmailId: 'fit1', MobileNo: '575757', Role: 3, IMEINo: 3, IPAddress: 'hyd', IPRestriction: true, IsAdminGate: false, IsGross: true, IsTare: false, IsDumpYard: false, IsActive: false, CreatedDate: "26/01/2023", UpdatedDate: "26/01/2023" }
    ];
    this.loading = false;

    this.userSections = [
      { section: ' MUTAPURAM1 ' },
      { section: ' GOLLAMUDI ' },
      { section: ' KISHTAPURAM ' },
      { section: ' BODULABANDA ' },
      { section: ' NAKIREKALLU ' },
      { section: ' Ammapeta ' },
      { section: ' PAINAMPALLY ' },
      { section: ' MUTAPURAM1 ' },
      { section: ' GOLLAMUDI ' },
      { section: ' KISHTAPURAM ' },
      { section: ' BODULABANDA ' },
      { section: ' NAKIREKALLU ' },
      { section: ' Ammapeta ' },
      { section: ' PAINAMPALLY ' },
      { section: ' MUTAPURAM1 ' },
      { section: ' GOLLAMUDI ' },
      { section: ' KISHTAPURAM ' },
      { section: ' BODULABANDA ' },
      { section: ' NAKIREKALLU ' },
      { section: ' Ammapeta ' },
      { section: ' PAINAMPALLY ' },
      { section: ' MUTAPURAM1 ' },
      { section: ' GOLLAMUDI ' },
      { section: ' KISHTAPURAM ' },
      { section: ' BODULABANDA ' },
      { section: ' NAKIREKALLU ' },
      { section: ' Ammapeta ' },
      { section: ' PAINAMPALLY ' },
    ]
  }

  ngOnInit(): void {
    this.userForm = this.formbuilder.group({
      userName: ['', (Validators.required)],
      password: ['', (Validators.required)],
      firstName: ['', (Validators.required)],
      lastName: ['', (Validators.required)],
      emailId: ['', (Validators.required)],
      mobileNo: ['', (Validators.required)],
      role: ['', (Validators.required)],
      ipAddress: [''],
      imeiNo: [''],
      ipRestriction: [''],
      isAdminGate: [''],
      isGross: [''],
      isTare: [''],
      isDumpYard: [''],
      isActive: ['']
    });
  }

  get userFormControls() {
    return this.userForm.controls;
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

  onSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
    }
    else {
      // alert("please fill the fields")
      this.userForm.markAllAsTouched();
    }
  }

}
