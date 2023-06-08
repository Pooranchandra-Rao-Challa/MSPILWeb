
import { HttpEvent } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table/table';
import { Observable } from 'rxjs';
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { plantTypeDto, plantTypeViewDto } from 'src/app/_models/applicationmaster';
import { ITableHeader, MaxLength } from 'src/app/_models/common';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { MAX_LENGTH_6, MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY, RG_DECIMAL, } from 'src/app/_shared/regex';

@Component({
  selector: 'app-planttype',
  templateUrl: './planttype.component.html',
})
export class PlanttypeComponent implements OnInit {
  globalFilterFields: string[] =['code','name','estimatedTon','loanEligible','isActive',
       'createdBy','updatedBy','createAt','updatedAt']
  showDialog: boolean = false;
  plantTypes: plantTypeViewDto[] = [];
  plantType: plantTypeDto = new plantTypeDto();
  fbplantType!: FormGroup;
  @ViewChild('filter') filter!: ElementRef;
  submitLabel!: string;
  addFlag: boolean = true;
  mediumDate: string = MEDIUM_DATE;
  maxLength: MaxLength = new MaxLength();
  permissions: any;
  

  headers: ITableHeader[] = [
    { field: 'code', header: 'code', label: 'Code' },
    { field: 'name', header: 'name', label: 'Name' },
    { field: 'estimatedTon', header: 'estimatedTon', label: 'Estimated Ton' },
    { field: 'loanEligible', header: 'loanEligible', label: 'Loan Eligible' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ];

  constructor(private formbuilder: FormBuilder,
    public jwtService: JWTService,
    private appMasterService: AppMasterService,
    private alertMessage: AlertMessage) { }

  initPlant() {
    this.fbplantType.controls['isActive'].setValue(true);
    this.submitLabel = "Add Plant Type";
    this.addFlag = true;
    this.showDialog = true;
  }
  get FormControls() {
    return this.fbplantType.controls;
  }
  ngOnInit() {
    this.permissions = this.jwtService.Permissions;
    this.plantTypeForm();
    this.getPlant();
  }
  plantTypeForm() {
    this.fbplantType = this.formbuilder.group({
      plantTypeId: [null],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_6)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY),Validators.minLength(MIN_LENGTH_2)]),
      estimatedTon: [null, (Validators.required)],
      loanEligible:[null, [Validators.required, Validators.pattern(RG_DECIMAL)]],
      isActive: [null],
    });
  }
  onClose() {
    this.fbplantType.reset();
  }
  // post method
  savePlant(): Observable<HttpEvent<plantTypeDto>> {
    if (this.addFlag)
      return this.appMasterService.CreatePlantType(this.fbplantType.getRawValue());
    else return this.appMasterService.UpdatePlantType(this.fbplantType.getRawValue())
  }
  isUniquePlantTypeCode() {
    const existingPlantTypeCodes = this.plantTypes.filter(plantType => 
      plantType.code === this.fbplantType.value.code && 
      plantType.plantTypeId !== this.fbplantType.value.plantTypeId
    )
    return existingPlantTypeCodes.length > 0; 
  }
  
  isUniquePlantTypeName() {
    const existingPlantTypeNames = this.plantTypes.filter(plantType =>
      plantType.name === this.fbplantType.value.name && 
      plantType.plantTypeId !== this.fbplantType.value.plantTypeId
    )
    return existingPlantTypeNames.length > 0;
  }
  
  onSubmit() {
    if (this.fbplantType.valid) {
      if (this.addFlag) {
        if (this.isUniquePlantTypeCode()) {
          this.alertMessage.displayErrorMessage(
            `Plant Type Code :"${this.fbplantType.value.code}" Already Exists.`
          );
        } else if (this.isUniquePlantTypeName()) {
          this.alertMessage.displayErrorMessage(
            `Plant Type Name :"${this.fbplantType.value.name}" Already Exists.` 
          );
        } else {
          this.save();
        }
      } else {
        this.save(); 
      }
    } else {
      this.fbplantType.markAllAsTouched(); 
    }
  }
  
  save() {
    if (this.fbplantType.valid) {
      console.log(this.fbplantType.value)
      this.savePlant().subscribe(resp => {
        if (resp) {
          this.getPlant();
          this.onClose();
          this.showDialog = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMAMPT001" : "SMAMPT002"]);
        }
      })
    }
    else {
      // alert("please fill the fields")
      this.fbplantType.markAllAsTouched();
    }
  }
  // get method
  getPlant() {
    this.appMasterService.GetPlantType().subscribe((resp) => {
      this.plantTypes = resp as unknown as plantTypeViewDto[];
      console.log(this.plantType);
    });
  }

  editPlantType(plantTypes:plantTypeViewDto ) {
    this.plantType.plantTypeId = plantTypes.plantTypeId;
    this.plantType.code = plantTypes.code;
    this.plantType.name = plantTypes.name;
    this.plantType.estimatedTon = plantTypes.estimatedTon;
    this.plantType.loanEligible = plantTypes.loanEligible;
    this.plantType.isActive = plantTypes.isActive;
    this.fbplantType.setValue(this.plantType)
    this.addFlag = false;
    this.submitLabel = "Update Plant Type";
    this.showDialog = true;
  }
  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }
  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  ngOnDestroy() {
    this.plantTypes = [];
    this.plantType = new plantTypeDto();
  }
}
