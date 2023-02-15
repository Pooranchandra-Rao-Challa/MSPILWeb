import { HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs';
import { PlantSubTypeDto, PlantSubTypeViewDto, plantTypeDto,  } from 'src/app/_models/applicationmaster';
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
  plantSubType: PlantSubTypeViewDto[] = [];
  plantSub: PlantSubTypeDto = new PlantSubTypeDto();
  planttype: PlantSubTypeDto[] = [];
  submitLabel!: string;
  addFlag: boolean = true;
  loading: boolean = false;
  filter: any;

  constructor(private formbuilder: FormBuilder,
    private appmasterservice: AppMasterService,) { }

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
    this.initPlantName();
  }

  plantSubTypeForm() {
    this.fbplantsubtype = this.formbuilder.group({
      plantSubTypeId: [0],
      plantId: ['', Validators.required],
      code: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
      name: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
      isActive: [true,]
    });
  }

  initPlantName() {
  
    this.appmasterservice.GetPlantType().subscribe((resp) => {
      this.planttype = resp as unknown as PlantSubTypeDto[];

    });



  }

  //  get method
  PlantSubType() {
    this.appmasterservice.GetPlantSubType().subscribe((resp) => {
      this.plantSubType = resp as unknown as PlantSubTypeViewDto[];
      console.log(this.plantSubType);
      this.loading = false;
    })
  }
// post method
  savePlantSubType(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.appmasterservice.CreatePlantSubType(this.fbplantsubtype.value)
    else return this.appmasterservice.UpdatePlantSubType(this.fbplantsubtype.value)
  }
  onSubmit() {
    console.log(this.fbplantsubtype.value)
    // if (this.fbplantsubtype.valid) {
    //   console.log(this.fbplantsubtype.value)
    //   this.savePlantSubType().subscribe(resp => {
    //     if (resp) {
    //       this.PlantSubType();
    //       this.fbplantsubtype.reset();
    //       this.showDialog = false;
    //     }
    //   })
    // }
    // else {
    //   this.fbplantsubtype.markAllAsTouched();
    // }
  }

  initPlantsub() {
    this.fbplantsubtype.reset();
    this.submitLabel = "Add Plant Sub Type";
    this.addFlag = true;
    this.showDialog = true;
  }
  editPlantSubType(plantSub: PlantSubTypeViewDto) {
    this.plantSub.plantSubTypeId = plantSub.plantSubTypeId;
    this.plantSub.plantId = plantSub.plantId;
    this.plantSub.code = plantSub.code;
    this.plantSub.name =plantSub.name;
    this.plantSub.isActive = plantSub.isActive;
    this.fbplantsubtype.setValue(this.plantSub);
    this.addFlag = false;
    this.submitLabel = "Update Plant Sub Type";
    this.showDialog = true;
  }

}
