import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { MaxLength } from './../../../_models/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { VehicleTypeViewDto } from 'src/app/_models/applicationmaster';
import { Table } from 'primeng/table';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MAX_LENGTH_10, MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY } from 'src/app/_shared/regex';
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
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      capacity: new FormControl(null, [Validators.required]),
      billingCapacity: new FormControl(null, [Validators.required]),
      bindingCane: new FormControl(null, [Validators.required]),
      badCane: new FormControl(null, [Validators.required]),
      isActive: [true]
    });
  }

  get FormControls() {
    return this.fbVehicleType.controls;
  }

  addVehicle() {
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

  onSubmit() {
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
