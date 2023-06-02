import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { UserViewDto } from 'src/app/_models/security';
import { SecurityService } from 'src/app/_services/security.service';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { UserDto, RoleDto, UserSectionDto } from 'src/app/_models/security';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { RG_ALPHA_ONLY, RG_EMAIL, RG_PHONE_NO, RG_NUMERIC_ONLY, MIN_LENGTH_2, MAX_LENGTH_50, MAX_LENGTH_15, IP_ADDRESS_NO } from 'src/app/_shared/regex';
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { JWTService } from 'src/app/_services/jwt.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @ViewChild('filter') filter!: ElementRef;
  users: UserViewDto[] =[];
  selectedUser: UserViewDto = {};
  user: UserDto = {};
  roles: RoleDto[] = [];
  dialog: boolean = false;
  submitLabel!: string;
  globalFilters: string[] = ["userId", "userName", "firstName", "lastName", "email", "mobileNumber", "roleId", "imeino", "ipaddress", "iprestriction",
  "isAdminGate", "isGross", "isTare", "isDumpYard", "isActive",  "createdAt",  "updatedAt",];
  userForm!: FormGroup;
  mediumDate: string = MEDIUM_DATE;
  addFlag: boolean = true;
  permissions:any
  
  constructor(private formbuilder: FormBuilder,
    private securityService: SecurityService,
    private alertMessage: AlertMessage,
    private jwtService:JWTService) {
  }
  
  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    this.userForm = this.formbuilder.group({
      userId: ['',],
      isAdmin: [false],
      userName:  new FormControl('', [Validators.required, Validators.minLength(MIN_LENGTH_2),Validators.maxLength(MAX_LENGTH_50)]),
      password: ['', (Validators.required)],
      firstName: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY),Validators.minLength(MIN_LENGTH_2),Validators.maxLength(MAX_LENGTH_50)]),
      lastName: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY),Validators.minLength(MIN_LENGTH_2),Validators.maxLength(MAX_LENGTH_50)]),
      email: new FormControl('', [Validators.required,Validators.pattern(RG_EMAIL)]),
      mobileNumber: new FormControl('', [Validators.required, Validators.pattern(RG_PHONE_NO)]),
      roleId: ['', (Validators.required)],
      ipaddress: [''],
      imeino: new FormControl('', [Validators.pattern(RG_NUMERIC_ONLY),Validators.minLength(MAX_LENGTH_15)]),
      iprestriction: [false],
      isAdminGate: [false],
      isGross: [false],
      isTare: [false],
      isDumpYard: [false],
      isActive: [false],
      userSections: [''],
      roles: ['']
    });
    this.initUsers();
  }


  initUsers() {
    this.securityService.GetUsers().subscribe(resp => {
      this.users = resp as unknown as UserViewDto[];
      this.users.sort((a,b)=> (a.userName||"").localeCompare(b.userName||""))
      console.log(this.users);

    })
  }

  allottedSections() {
    return this.user.userSections?.filter(fn => fn.isActive == true);
  }

  initUser() {
    this.securityService.GetRoles().subscribe(resp => {
      this.roles = resp as unknown as RoleDto[];
    });
    if (this.selectedUser && this.selectedUser.userId) {
      this.submitLabel = "Update User";
      this.securityService.GetUserWithSections(this.selectedUser.userId).subscribe(resp => {
        this.user = resp as unknown as UserDto;   
        if (this.user.roles?.length == 1)
          this.user.roleId = this.user.roles[0].roleId;
        this.user.password = "";
        this.userForm.setValue(this.user);
      //  this.userForm.get("password")?.disable();
      })     
    } else {
      this.submitLabel = "Add User";
      this.user = {};
      this.user.IsGross = false;
      this.user.isActive = false;
      this.user.isAdminGate = false;
      this.user.iprestriction = false;
      this.user.isDumpYard = false;
      this.user.isTare = false;
      this.user.isAdmin = false;
      this.userForm.get("password")?.enable();
      this.securityService.GetAllSections().subscribe(resp => {
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
  saveUser(): Observable<HttpEvent<UserDto>> {
    this.userForm.value.userSections = this.user.userSections;
    if (!this.user.userId) return this.securityService.CreateUser(this.userForm.value)
    else return this.securityService.UpdateUser(this.userForm.value)
  }
  onSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);

      this.saveUser().subscribe((resp) => {
        if (resp) {
          this.dialog = false;
          this.userForm.reset();
          this.filter.nativeElement.value = '';
          this.initUsers();
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SUSR001" : "SUSR002"]);
        } else {

        }
      });
    }
    else {
      this.userForm.markAllAsTouched();
    }
  }

}
