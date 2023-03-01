
import { HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table/table';
import { Observable } from 'rxjs';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { plantTypeDto, plantTypeViewDto } from 'src/app/_models/applicationmaster';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { MAX_LENGTH_6, MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY, RG_NUMERIC_ONLY } from 'src/app/_shared/regex';

@Component({
  selector: 'app-planttype',
  templateUrl: './planttype.component.html',
})
export class PlanttypeComponent implements OnInit {
  showDialog: boolean = false;
  plantType: plantTypeViewDto[] = [];
  plantTypes: plantTypeDto = new plantTypeDto();
  loading: boolean = true;
  fbplantTypes!: FormGroup;
  filter: any;
  submitLabel!: string;
  addFlag: boolean = true;
  mediumDate: string = MEDIUM_DATE;
  constructor(private formbuilder: FormBuilder,
    public jwtService: JWTService, private appMasterService: AppMasterService,
  ) { }

  initPlant() {
    this.fbplantTypes.reset();
    this.submitLabel = "Add Plant Type";
    this.addFlag = true;
    this.showDialog = true;
  }
  get FormControls() {
    return this.fbplantTypes.controls;
  }
  ngOnInit() {
    this.plantTypeForm();
    this.getPlant();
  }
  plantTypeForm() {
    this.fbplantTypes = this.formbuilder.group({
      plantTypeId: [0],
      code:  new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_6)]),
      name:new FormControl('', [Validators.required,Validators.pattern(RG_ALPHA_ONLY)]),
      estimatedTon:['', (Validators.required)],
      loanEligible: ['', (Validators.required)],
      isActive: [true],
    });
  }
  onClose() {
    this.fbplantTypes.reset();
  }
  // post method
  savePlant(): Observable<HttpEvent<plantTypeDto>> {
    if (this.addFlag)
      return this.appMasterService.CreatePlantType(this.fbplantTypes.value);
      else return this.appMasterService.UpdatePlantType(this.fbplantTypes.value)
  }
  onSubmit() {
    if (this.fbplantTypes.valid) {
      console.log(this.fbplantTypes.value)
      this.savePlant().subscribe(resp => {
        if (resp) {
          this.getPlant();
          this.onClose();
          this.showDialog = false;
        }
      })
    }
    else {
      // alert("please fill the fields")
      this.fbplantTypes.markAllAsTouched();
    }
  }
  // get method
  getPlant() {
    this.appMasterService.GetPlantType().subscribe((resp) => {
      this.plantType = resp as unknown as plantTypeViewDto[];
      console.log(this.plantType);
      this.loading = false;
    });
  }

  editPlantType(plantTypes: plantTypeDto) {
    this.plantTypes.plantTypeId = plantTypes.plantTypeId;
    this.plantTypes.code = plantTypes.code;
    this.plantTypes.name = plantTypes.name;
    this.plantTypes.estimatedTon = plantTypes.estimatedTon;
    this.plantTypes.loanEligible = plantTypes.loanEligible;
    this.plantTypes.isActive = plantTypes.isActive;
    this.fbplantTypes.setValue(this.plantTypes)
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
    this.plantType = [];
    this.plantTypes = new plantTypeDto();
  }
}
