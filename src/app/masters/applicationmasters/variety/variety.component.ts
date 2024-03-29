import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { MIN_LENGTH_2, RG_ALPHA_NUMERIC, MAX_LENGTH_6 } from 'src/app/_shared/regex';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { VarietyViewDto, VarietyDto } from 'src/app/_models/applicationmaster';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { ITableHeader, MaxLength } from 'src/app/_models/common';
import { JWTService } from 'src/app/_services/jwt.service';

@Component({
  selector: 'app-variety',
  templateUrl: './variety.component.html',
  styles: [
  ]
})
export class VarietyComponent implements OnInit {
  varietyTypes: any;
  varieties: VarietyViewDto[] = [];
  variety: VarietyDto = new VarietyDto();
  globalFilterFields: string[] = ['varietyName', 'code', 'name', 'plantAge', 'ratoonAge', 'sugarContent', 'plantSuitability', 'isActive', 'createdAt', 'createdBy',
    'updatedAt', 'updatedBy'];
  @ViewChild('filter') filter!: ElementRef;
  submitLabel!: string;
  addFlag: boolean = true;
  showDialog: boolean = false;
  fbVariety!: FormGroup;
  mediumDate: string = MEDIUM_DATE;
  maxLength: MaxLength = new MaxLength();
  permissions:any;
  headers: ITableHeader[] = [
    { field: 'varietyName', header: 'varietyName', label: 'Variety Type' },
    { field: 'code', header: 'code', label: 'Code' },
    { field: 'name', header: 'name', label: 'Name' },
    { field: 'plantAge', header: 'plantAge', label: 'Plant Age' },
    { field: 'ratoonAge', header: 'ratoonAge', label: 'Ratoon Age' },
    { field: 'sugarContent', header: 'sugarContent', label: 'Sugar Content' },
    { field: 'plantSuitability', header: 'plantSuitability', label: 'Plant Suitability' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ];

  constructor(private formbuilder: FormBuilder,
    private lookupService: LookupService,
    private appMasterService: AppMasterService,
    private alertMessage: AlertMessage,
    private jwtService:JWTService) { }

  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    this.initVarieties();
    this.initLookupDetails();
    this.varietyForm();
  }

  initLookupDetails() {
    this.lookupService.VarietyTypes().subscribe((resp) => {
      this.varietyTypes = resp;
    });
  }

  initVarieties() {
    this.appMasterService.GetVarieties().subscribe((resp) => {
      this.varieties = resp as unknown as VarietyViewDto[];
    });
  }

  varietyForm() {
    this.fbVariety = this.formbuilder.group({
      varietyId: [null],
      varietyTypeId: [null, (Validators.required)],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_6)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2)]),
      plantAge: [null, (Validators.required)],
      ratoonAge: [null, (Validators.required)],
      sugarContent: ['', (Validators.required)],
      plantSuitability: ['', (Validators.required)],
      isActive: [null]
    });
  }

  get FormControls() {
    return this.fbVariety.controls;
  }

  addVariety() {
    this.fbVariety.controls['isActive'].setValue(true);
    this.submitLabel = "Add Variety";
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

  editVariety(variety: VarietyViewDto) {
    this.variety.varietyId = variety.varietyId;
    this.variety.code = variety.code;
    this.variety.name = variety.name;
    this.variety.varietyTypeId = variety.varietyTypeId;
    this.variety.plantAge = variety.plantAge;
    this.variety.ratoonAge = variety.ratoonAge;
    this.variety.sugarContent = variety.sugarContent;
    this.variety.plantSuitability = variety.plantSuitability;
    this.variety.isActive = variety.isActive;
    this.fbVariety.setValue(this.variety);
    this.addFlag = false;
    this.submitLabel = "Update Variety";
    this.showDialog = true;
  }

  saveVariety(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.appMasterService.CreateVariety(this.fbVariety.value)
    else return this.appMasterService.UpdateVariety(this.fbVariety.value)
  }

  isUniqueVarietyCode() {
    const existingVarietyCodes = this.varieties.filter(varietiy => 
      varietiy.code === this.fbVariety.value.code && 
      varietiy.varietyId !== this.fbVariety.value.varietyId
    )
    return existingVarietyCodes.length > 0; 
  }
  
  isUniqueVarietyName() {
    const existingVarietyNames = this.varieties.filter(varietiy =>
      varietiy.name === this.fbVariety.value.name && 
      varietiy.varietyId !== this.fbVariety.value.varietyId
    )
    return existingVarietyNames.length > 0;
  }
  onSubmit() {
    if (this.fbVariety.valid) {
      if (this.addFlag) {
        if (this.isUniqueVarietyCode()) {
          this.alertMessage.displayErrorMessage(
            `Variety Code :"${this.fbVariety.value.code}" Already Exists.`
          );
        } else if (this.isUniqueVarietyName()) {
          this.alertMessage.displayErrorMessage(
            `Variety Name :"${this.fbVariety.value.name}" Already Exists.` 
          );
        } else {
          this.save();
        }
      } else {
        this.save(); 
      }
    } else {
      this.fbVariety.markAllAsTouched(); 
    }
  }
  
  save() {
    console.log(this.fbVariety.value);

    if (this.fbVariety.valid) {
      this.saveVariety().subscribe(resp => {
        if (resp) {
          this.initVarieties();
          this.fbVariety.reset();
          this.showDialog = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMAMVA001" : "SMAMVA002"]);
        }
      })
    }
    else {
      this.fbVariety.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.varietyTypes = [];
    this.varieties = [];
    this.variety = new VarietyDto();
  }

}
