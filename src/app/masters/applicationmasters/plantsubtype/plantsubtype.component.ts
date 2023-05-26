import { HttpEvent } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { PlantSubTypeDto, PlantSubTypeViewDto, plantTypeDto } from 'src/app/_models/applicationmaster';
import { ITableHeader, MaxLength } from 'src/app/_models/common';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { MAX_LENGTH_6, MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY } from 'src/app/_shared/regex';



@Component({
  selector: 'app-plantsubtype',
  templateUrl: './plantsubtype.component.html',
  styles: [
  ]
})
export class PlantsubtypeComponent implements OnInit {
  globalFilterFields: string[] = ['plantTypeId','code','name','isActive',
  'createdBy','updatedBy','createAt','updatedAt']
  @ViewChild('filter') filter!: ElementRef;
  fbplantsubtype!: FormGroup;
  showDialog: boolean = false;
  plantSubTypes: PlantSubTypeViewDto[] = [];
  plantSubType: PlantSubTypeDto = new PlantSubTypeDto();
  planttype: plantTypeDto[] = [];
  submitLabel!: string;
  addFlag: boolean = true;
  mediumDate: string = MEDIUM_DATE;
  maxLength: MaxLength = new MaxLength();
  permissions: any;

  headers: ITableHeader[] = [
    { field: 'plantTypeId', header: 'plantTypeId', label: 'Plant Type Id' },
    { field: 'code', header: 'code', label: 'Code' },
    { field: 'name', header: 'name', label: 'Name' },
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

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  get FormControls() {
    return this.fbplantsubtype.controls;
  }

  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    this.plantSubTypeForm();
    this.PlantSubType();

    this.appMasterService.GetPlantTypeForPlantSubType().subscribe((resp) => {
      this.planttype = resp as unknown as plantTypeDto[]
      console.log(this.planttype);
    })
  }

  plantSubTypeForm() {
    this.fbplantsubtype = this.formbuilder.group({
      plantSubTypeId: [null],
      plantTypeId: [null, [Validators.required]],
      code: new FormControl(null, [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_6)]),
      name: new FormControl(null, [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC)]),
      isActive: [null]
    });
  }

  //  get method
  PlantSubType() {
    this.appMasterService.GetPlantSubType().subscribe((resp) => {
      this.plantSubTypes = resp as unknown as PlantSubTypeViewDto[];
      console.log(this.plantSubType);
    })
  }
  onClose() {
    this.fbplantsubtype.reset();
  }
  // post method
  savePlantSubType(): Observable<HttpEvent<PlantSubTypeDto>> {
    if (this.addFlag)
      // this.fbplantsubtype.value.plantSubTypeId = 0;
      return this.appMasterService.CreatePlantSubType(this.fbplantsubtype.value)
    else return this.appMasterService.UpdatePlantSubType(this.fbplantsubtype.value)
  }
  isUniquePlantsubTypeCode() {
    const existingPlantsubtypeCode = this.plantSubTypes.filter(plantType => 
      plantType.code === this.fbplantsubtype.value.code && 
      plantType.plantTypeId !== this.fbplantsubtype.value.plantTypeId
    )
    return existingPlantsubtypeCode.length > 0; 
  }
  
  isUniquePlantsubTypeNames() {
    const existingPlantsubtypeNames = this.plantSubTypes.filter(plantType =>
      plantType.name === this.fbplantsubtype.value.name && 
      plantType.plantTypeId !== this.fbplantsubtype.value.plantTypeId
    )
    return existingPlantsubtypeNames.length > 0;
  }
  onSubmit() {
    if (this.fbplantsubtype.valid) {
      if (this.addFlag) {
        if (this.isUniquePlantsubTypeCode()) {
          this.alertMessage.displayErrorMessage(
            `Plant Sub Type Code :"${this.fbplantsubtype.value.code}" Already Exists.`
          );
        } else if (this.isUniquePlantsubTypeNames()) {
          this.alertMessage.displayErrorMessage(
            `Plant SubType Name :"${this.fbplantsubtype.value.name}" Already Exists.` 
          );
        } else {
          this.save();
        }
      } else {
        this.save(); 
      }
    } else {
      this.fbplantsubtype.markAllAsTouched(); 
    }
  }
  
  save() {
    if (this.fbplantsubtype.valid) {
      console.log(this.fbplantsubtype.value)

      this.savePlantSubType().subscribe(resp => {
        if (resp) {
          this.PlantSubType();
          this.onClose();
          this.showDialog = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMAMPST001" : "SMAMPST002"]);
        }
      })
    }
    else {
      this.fbplantsubtype.markAllAsTouched();
    }
  }

  initPlantsub() {
    this.fbplantsubtype.controls['isActive'].setValue(true);
    this.submitLabel = "Add Plant Sub Type";
    this.addFlag = true;
    this.showDialog = true;
  }
  editPlantSubType(plantSubType: PlantSubTypeViewDto) {
    this.plantSubType.plantSubTypeId = plantSubType.plantSubTypeId;
    this.plantSubType.plantTypeId = plantSubType.plantTypeId;
    this.plantSubType.code = plantSubType.code;
    this.plantSubType.name = plantSubType.name;
    this.plantSubType.isActive = plantSubType.isActive;
    this.fbplantsubtype.setValue(this.plantSubType);
    this.addFlag = false;
    this.submitLabel = "Update Plant Sub Type";
    this.showDialog = true;
  }
  
  ngOnDestroy() {
    this.plantSubTypes = [];
    this.plantSubType = new PlantSubTypeDto();
    this.planttype = [];
  }
}
