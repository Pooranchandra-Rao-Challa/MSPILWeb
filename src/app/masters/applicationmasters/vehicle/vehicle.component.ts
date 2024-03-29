import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { ITableHeader, MaxLength } from 'src/app/_models/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VehicleTypeViewDto } from 'src/app/_models/applicationmaster';
import { Table } from 'primeng/table';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_DECIMAL } from 'src/app/_shared/regex';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { VehicleTypeDto } from 'src/app/_models/applicationmaster';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { JWTService } from 'src/app/_services/jwt.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styles: [
  ]
})
export class VehicleComponent implements OnInit {
  vehicleTypes: VehicleTypeViewDto[] = [];
  vehicleType: VehicleTypeDto = new VehicleTypeDto();
  globalFilterFields: string[] = ['code', 'name', 'capacity', 'billingCapacity', 'bindingCane', 'badCane', 'isActive', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy'];
  @ViewChild('filter') filter!: ElementRef;
  fbVehicleType!: FormGroup;
  submitLabel!: string;
  addFlag: boolean = true;
  showDialog: boolean = false;
  mediumDate: string = MEDIUM_DATE;
  maxLength: MaxLength = new MaxLength();
  permissions:any;
 
  headers: ITableHeader[] = [
    { field: 'code', header: 'code', label: 'Code' },
    { field: 'name', header: 'name', label: 'Name' },
    { field: 'capacity', header: 'capacity', label: 'Capacity' },
    { field: 'billingCapacity', header: 'billingCapacity', label: 'Billing Capacity' },
    { field: 'bindingCane', header: 'bindingCane', label: 'Binding %' },
    { field: 'badCane', header: 'badCane', label: 'Bad Cane %' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ];

  constructor(private formbuilder: FormBuilder,
    private appMasterService: AppMasterService,
    private alertMessage: AlertMessage,
    private jwtService:JWTService) { }

  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    this.initVehicleTypes();
    this.vehicleTypeForm();
  }

  initVehicleTypes() {
    this.appMasterService.GetVehicleTypes().subscribe((resp) => {
      this.vehicleTypes = resp as unknown as VehicleTypeViewDto[];
    });
  }

  vehicleTypeForm() {
    this.fbVehicleType = this.formbuilder.group({
      vehicleTypeId: [null],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2)]),
      capacity:  [null, (Validators.required)],
      billingCapacity:  [null, (Validators.required)],
      bindingCane: [null, (Validators.required)],
      badCane: [null, [Validators.required, Validators.pattern(RG_DECIMAL)]],
      isActive: [null]
    });
  }

  get FormControls() {
    return this.fbVehicleType.controls;
  }

  addVehicle() {
    this.fbVehicleType.controls['isActive'].setValue(true);
    this.submitLabel = "Add Vehicle";
    this.addFlag = true;
    this.showDialog = true;
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  editVehicleType(vehicleType: VehicleTypeDto) {
    this.vehicleType.vehicleTypeId = vehicleType.vehicleTypeId;
    this.vehicleType.code = vehicleType.code;
    this.vehicleType.name = vehicleType.name;
    this.vehicleType.capacity = vehicleType.capacity;
    this.vehicleType.billingCapacity = vehicleType.billingCapacity;
    this.vehicleType.bindingCane = vehicleType.bindingCane;
    this.vehicleType.badCane = vehicleType.badCane;
    this.vehicleType.isActive = vehicleType.isActive;
    this.fbVehicleType.setValue(this.vehicleType);
    this.addFlag = false;
    this.submitLabel = "Update Vehicle";
    this.showDialog = true;
  }

  saveVehicleType(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.appMasterService.CreateVehicleType(this.fbVehicleType.value)
    else return this.appMasterService.UpdateVehicleType(this.fbVehicleType.value)
  }

  isUniqueVehicleTypeCode() {
    const existingVehicleTypeCodes = this.vehicleTypes.filter(vehicleType => 
      vehicleType.code === this.fbVehicleType.value.code && 
      vehicleType.vehicleTypeId !== this.fbVehicleType.value.vehicleTypeId
    )
    return existingVehicleTypeCodes.length > 0; 
  }
  
  isUniqueVehicleTypeName() {
    const existingVehicleTypeNames = this.vehicleTypes.filter(vehicleType =>
      vehicleType.name === this.fbVehicleType.value.name && 
      vehicleType.vehicleTypeId !== this.fbVehicleType.value.vehicleTypeId
    )
    return existingVehicleTypeNames.length > 0;
  }
  
  onSubmit() {
    if (this.fbVehicleType.valid) {
      if (this.addFlag) {
        if (this.isUniqueVehicleTypeCode()) {
          this.alertMessage.displayErrorMessage(
            `Vehicle Type Code :"${this.fbVehicleType.value.code}" Already Exists.`
          );
        } else if (this.isUniqueVehicleTypeName()) {
          this.alertMessage.displayErrorMessage(
            `Vehicle Type Name :"${this.fbVehicleType.value.name}" Already Exists.` 
          );
        } else {
          this.save();
        }
      } else {
        this.save(); 
      }
    } else {
      this.fbVehicleType.markAllAsTouched(); 
    }
  }
  
  save() {
    console.log(this.fbVehicleType.value);

    if (this.fbVehicleType.valid) {
      this.saveVehicleType().subscribe(resp => {
        if (resp) {
          this.initVehicleTypes();
          this.fbVehicleType.reset();
          this.showDialog = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMAMVE001" : "SMAMVE002"]);
        }
      })
    }
    else {
      this.fbVehicleType.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.vehicleTypes = [];
    this.vehicleType = new VehicleTypeDto();
  }


}
