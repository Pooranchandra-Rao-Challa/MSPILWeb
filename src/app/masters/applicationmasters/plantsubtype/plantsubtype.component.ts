import { HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { PlantSubTypeDto, PlantSubTypeViewDto, plantTypeDto } from 'src/app/_models/applicationmaster';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { MAX_LENGTH_6, MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY } from 'src/app/_shared/regex';



@Component({
  selector: 'app-plantsubtype',
  templateUrl: './plantsubtype.component.html',
  styles: [
  ]
})
export class PlantsubtypeComponent implements OnInit {
  fbplantsubtype!: FormGroup;
  showDialog: boolean = false;
  plantSubTypes: PlantSubTypeViewDto[] = [];
  plantSubType: PlantSubTypeDto = new PlantSubTypeDto();
  planttype: plantTypeDto[] = [];
  submitLabel!: string;
  addFlag: boolean = true;
  loading: boolean = true;
  filter: any;
  mediumDate: string = MEDIUM_DATE;
  constructor(private formbuilder: FormBuilder,
    private appMasterService: AppMasterService,) { }

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
    this.plantSubTypeForm();
    this.PlantSubType();

    this.appMasterService.GetPlantTypeForPlantSubType().subscribe((resp) => {
      this.planttype = resp as unknown as plantTypeDto[]
      console.log(this.planttype);
    })
  }

  plantSubTypeForm() {
    this.fbplantsubtype = this.formbuilder.group({
      plantSubTypeId: [],
      plantTypeId:[ 0, [Validators.required]],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_6)]),
      name: new FormControl('', [Validators.required,Validators.pattern(RG_ALPHA_ONLY)]),
      isActive:[true]
    });
  }

  //  get method
  PlantSubType() {
    this.appMasterService.GetPlantSubType().subscribe((resp) => {
      this.plantSubTypes = resp as unknown as PlantSubTypeViewDto[];
      console.log(this.plantSubType);
      this.loading = false;
    })
  }
  onClose() {
    this.fbplantsubtype.reset();
  }
  // post method
  savePlantSubType(): Observable<HttpEvent<any>> {
    if (this.addFlag) 
      // this.fbplantsubtype.value.plantSubTypeId = 0;
      return this.appMasterService.CreatePlantSubType(this.fbplantsubtype.value)
      else return this.appMasterService.UpdatePlantSubType(this.fbplantsubtype.value)
  }
  onSubmit() {                                      
    if (this.fbplantsubtype.valid) {
      console.log(this.fbplantsubtype.value)

      this.savePlantSubType().subscribe(resp => {
        if (resp) {
          this.PlantSubType();
          this.onClose();
          this.showDialog = false;
        }
      })
    }
    else {
      this.fbplantsubtype.markAllAsTouched();
    }
  }

  initPlantsub() {
    this.fbplantsubtype.reset();
    this.submitLabel = "Add Plant Sub Type";
    this.addFlag = true;
    this.showDialog = true;
  }
  editPlantSubType( plantSubType: PlantSubTypeViewDto) {
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

}
