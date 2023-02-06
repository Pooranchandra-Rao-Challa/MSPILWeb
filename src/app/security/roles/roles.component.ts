import { RoleDto, RoleViewDto, RolePermissionDto } from './../../_models/security';
import { SecurityService } from './../../_services/security.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  @ViewChild('filter') filter!: ElementRef;
  roles: any;
  role: RoleDto = {}
  permissions: RolePermissionDto[] = [];
  screens: string[] =[]
  loading: boolean = true;
  dialog: boolean = false;
  roleForm!: FormGroup;
  globalFilters: string[] = ["Code", "Name", "IsActive", "CreatedDate", "CreatedBy", "UpdatedDate", "UpdatedBy"];

  constructor(private formbuilder: FormBuilder, private securityService: SecurityService) {
    // this.roles = [
    //   { Code: '123456', Name: 'sai1', IsActive: true, CreatedDate: "25/01/2023", CreatedBy: 'Acc1', UpdatedDate: "25/01/2023", UpdatedBy: "hghj" },
    //   { Code: '123', Name: 'kiran1', IsActive: true, CreatedDate: "25/01/2023", CreatedBy: 'accont1', UpdatedDate: "25/01/2023", UpdatedBy: "saio" },
    //   { Code: '345', Name: 'kumar1', IsActive: true, CreatedDate: "25/01/2023", CreatedBy: 'fit1', UpdatedDate: "25/01/2023", UpdatedBy: "hgh" }
    // ];
    this.loading = false;
  }

  ngOnInit(): void {
    this.roleForm = this.formbuilder.group({
      roleId: [''],
      code: ['', (Validators.required)],
      name: ['', (Validators.required)],
      isActive: [true, (Validators.requiredTrue)],
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
      this.roles = resp as unknown as RoleViewDto
      console.log(this.roles);
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
    this.screens.sort((a,b)=> (a||"").localeCompare(b||""))
  }
  getPermissions(screen: string){
    return this.role?.permissions?.filter(fn => fn.screenName == screen)
  }
  saveRole(): Observable<HttpEvent<RoleDto>> {
    if (!this.role.roleId) return this.securityService.CreateRole(this.roleForm.value)
    else return this.securityService.UpdateRole(this.roleForm.value)
  }

  onSubmit() {


    if (this.roleForm.valid) {
      console.log(this.roleForm.value);
      this.saveRole().subscribe(resp =>{
        if(resp){
          this.roleForm.reset();
          this.dialog = false;
          this.intiRoles();
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
