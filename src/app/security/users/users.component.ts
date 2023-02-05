import { UserDto, RoleViewDto, RoleDto, UserSectionDto } from './../../_models/security';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { UserViewDto } from 'src/app/_models/security';
import { SecurityService } from 'src/app/_services/security.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @ViewChild('filter') filter!: ElementRef;
  users: any;
  selectedUser: UserViewDto ={};
  user: UserDto = {};
  roles: RoleDto[] =[];
  loading: boolean = true;
  dialog: boolean = false;
  globalFilters: string[] = ["UserId", "UserName", "FirstName", "LastName", "EmailId", "MobileNo", "Role", "IMEINo", "IPAddress", "IPRestriction", "IsAdminGate", "IsGross", "IsTare", "IsDumpYard", "IsActive", "CreatedDate", "UpdatedDate"];

  userForm!: FormGroup;

  constructor(private formbuilder: FormBuilder,
    private securityService: SecurityService) {
    this.loading = false;
  }

  ngOnInit(): void {
    this.userForm = this.formbuilder.group({
      userId: ['',],
      isAdmin: ['',],
      userName: ['', (Validators.required)],
      password: ['', (Validators.required)],
      firstName: ['', (Validators.required)],
      lastName: ['', (Validators.required)],
      email: ['', (Validators.required)],
      mobileNumber: ['', (Validators.required)],
      roleId: ['', (Validators.required)],
      ipaddress: [''],
      imeino: [''],
      iprestriction: [''],
      isAdminGate: [''],
      isGross: [''],
      isTare: [''],
      isDumpYard: [''],
      isActive: [''],
      userSections: [''],
      roles:['']
    });
    this.initUsers();
  }

  initUsers(){
    this.securityService.GetUsers().subscribe(resp =>{
      this.users = resp as unknown as UserViewDto[];
    })
  }

  allottedSections(){
    return this.user.userSections?.filter(fn => fn.isActive==true);
  }

  initUser(){
    this.securityService.GetRoles().subscribe(resp =>{
      this.roles = resp as unknown as RoleDto[];
    });
    if(this.selectedUser && this.selectedUser.userId){
      this.securityService.GetUserWithSections(this.selectedUser.userId).subscribe(resp =>{
        this.user = resp as unknown as UserDto;
        if(this.user.roles?.length == 1)
        this.user.roleId = this.user.roles[0].roleId;
        this.user.password ="";
        this.userForm.setValue(this.user);
        this.userForm.get("password")?.disable();
      })
    }else {
      this.user = {};
      this.userForm.get("password")?.enable();
      this.securityService.GetAllSections().subscribe(resp =>{
        this.user.userSections = resp as unknown as UserSectionDto[];
      })
    }
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

  showUser(user: UserViewDto) {
    this.dialog = true;
    this.selectedUser = user;
    this.initUser();
  }

  onSubmit() {
    if (this.userForm.valid) {
      this.userForm.value.userSections = this.user.userSections;
      console.log(this.userForm.value);
    }
    else {
      // alert("please fill the fields")
      this.userForm.markAllAsTouched();
    }
  }

}
