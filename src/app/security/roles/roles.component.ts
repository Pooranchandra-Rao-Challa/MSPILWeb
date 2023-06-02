import { RG_ALPHA_ONLY } from './../../_shared/regex';
import { RoleDto, RoleViewDto, RolePermissionDto } from './../../_models/security';
import { SecurityService } from './../../_services/security.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { MAX_LENGTH_6, MIN_LENGTH_2, RG_ALPHA_NUMERIC } from 'src/app/_shared/regex';
import { ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { AlertMessage } from '../../_alerts/alertMessage';
import { JWTService } from 'src/app/_services/jwt.service';
import { MaxLength } from 'src/app/_models/common';


@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  @ViewChild('filter') filter!: ElementRef;
  roles: RoleViewDto[] = [];
  role: RoleDto = {}
  permissions: RolePermissionDto[] = [];
  screens: string[] = []
  dialog: boolean = false;
  roleForm!: FormGroup;
  submitLabel!: string;
  addFlag: boolean = true;
  globalFilters: string[] = ["Code", "Name", "IsActive", "createdAt", "CreatedBy", "UpdatedDate", "UpdatedBy"];
  mediumDate: string = MEDIUM_DATE;
  permission:any
  maxLength: MaxLength = new MaxLength();

  constructor(private formbuilder: FormBuilder, private securityService: SecurityService,
    private alertMessage:AlertMessage,
    private jwtService:JWTService) { }

  ngOnInit(): void {
    this.permission = this.jwtService.Permissions;
    this.roleForm = this.formbuilder.group({
      roleId: [''],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_6)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY)]),
      isActive:[true],
      permissions: []
    });
    this.intiRoles();
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
  intiRoles() {
    this.securityService.GetRoles().subscribe(resp => {
      this.roles = resp as unknown as RoleViewDto[];
    });
  }

  
  initPermissoins() {
    this.securityService.GetPermissions().subscribe(resp => {
      this.permissions = resp as unknown as RolePermissionDto[];
      this.role.permissions = this.permissions;
      this.roleForm.setValue(this.role);
      this.role.permissions?.forEach(p => p.assigned = false);
      this.screensInPermissions();
    });
  }
  initRole(role: RoleViewDto) {
    this.showDialog();
    this.screens = [];
    if (role.roleId != null) {
      this.addFlag = false;
      this.submitLabel = "Update Role";
      this.securityService.GetRoleWithPermissions(role.roleId).subscribe(resp => {
        this.role.roleId = role.roleId
        this.role.code = role.code
        this.role.name = role.name;
        this.role.isActive = role.isActive;
        this.role.permissions = (resp as unknown as RoleDto).permissions;
        this.roleForm.setValue(this.role);
        this.screensInPermissions()
      })
    } else {
      this.submitLabel = "Add Role";
      this.addFlag = false;
      this.role = {};
      this.role.roleId = "";
      this.role.code = "";
      this.role.isActive = false;
      this.role.name = "";
      this.initPermissoins();

    }
  }

  screensInPermissions() {
    this.screens = getDistinct(this.role?.permissions || [], "screenName") as string[];
    this.screens.sort((a, b) => (a || "").localeCompare(b || ""))
  }
  getPermissions(screen: string) {
    return this.role?.permissions?.filter(fn => fn.screenName == screen)
  }
  saveRole(): Observable<HttpEvent<RoleDto>> {
    if (!this.role.roleId) return this.securityService.CreateRole(this.roleForm.value)
    else return this.securityService.UpdateRole(this.roleForm.value)
  }

  onSubmit() {


    if (this.roleForm.valid) {
      console.log(this.roleForm.value);
      this.saveRole().subscribe(resp => {
        if (resp) {
          this.roleForm.reset();
          this.dialog = false;
          this.intiRoles();
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMR001" : "SMR002"]);
        }
      })
    }
    else {

      this.roleForm.markAllAsTouched();
    }
  }
}

function getDistinct<T, K extends keyof T>(data: T[], property: K): T[K][] {
  const allValues = data.reduce((values: T[K][], current) => {
    if (current[property]) {
      values.push(current[property]);
    }
    return values;
  }, []);

  return [...new Set(allValues)];
}
