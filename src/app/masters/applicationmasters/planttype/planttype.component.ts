
import { HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table/table';
import { Observable } from 'rxjs';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { plantTypeDto, plantTypeViewDto } from 'src/app/_models/applicationmaster';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { MAX_LENGTH_6, MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY, } from 'src/app/_shared/regex';

@Component({
  selector: 'app-planttype',
  templateUrl: './planttype.component.html',
})
export class PlanttypeComponent implements OnInit {
  showDialog: boolean = false;
  plantTypes: plantTypeViewDto[] = [];
  plantType: plantTypeDto = new plantTypeDto();
  loading: boolean = true;
  fbplantType!: FormGroup;
  filter: any;
  submitLabel!: string;
  addFlag: boolean = true;
  mediumDate: string = MEDIUM_DATE;
  constructor(private formbuilder: FormBuilder,
    public jwtService: JWTService, private appMasterService: AppMasterService,
  ) { }

  initPlant() {
    this.fbplantType.reset();
    this.submitLabel = "Add Plant Type";
    this.addFlag = true;
    this.showDialog = true;
  }
  get FormControls() {
    return this.fbplantType.controls;
  }
  ngOnInit() {
    this.plantTypeForm();
    this.getPlant();
  }
  plantTypeForm() {
    this.fbplantType = this.formbuilder.group({
      plantTypeId: [null],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_6)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY)]),
      estimatedTon: ['', (Validators.required)],
      loanEligible: ['', (Validators.required)],
      isActive: [true],
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
  onSubmit() {
    if (this.fbplantType.valid) {
      console.log(this.fbplantType.value)
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
      this.fbplantType.markAllAsTouched();
    }
  }
  // get method
  getPlant() {
    this.appMasterService.GetPlantType().subscribe((resp) => {
      this.plantTypes = resp as unknown as plantTypeViewDto[];
      console.log(this.plantType);
      this.loading = false;
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
