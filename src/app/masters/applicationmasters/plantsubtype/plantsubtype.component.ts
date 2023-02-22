import { HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { PlantSubTypeDto, PlantSubTypeViewDto, plantTypeDto } from 'src/app/_models/applicationmaster';
import { AppMasterService } from 'src/app/_services/appmaster.service';



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
  loading: boolean = false;
  filter: any;

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
      plantId: [0],
      code: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
      name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
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
    this.plantSubType.plantId = plantSubType.plantId;
    this.plantSubType.code = plantSubType.code;
    this.plantSubType.name = plantSubType.name;
    this.plantSubType.isActive = plantSubType.isActive;
    this.fbplantsubtype.setValue(this.plantSubType);
    this.addFlag = false;
    this.submitLabel = "Update Plant Sub Type";
    this.showDialog = true;
  }

}
