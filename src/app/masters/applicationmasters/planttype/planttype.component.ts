
import { HttpEvent } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table/table';
import { Observable } from 'rxjs';
import { plantTypeDto, planttypeViewDto } from 'src/app/_models/applicationmaster';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { JWTService } from 'src/app/_services/jwt.service';

@Component({
  selector: 'app-planttype',
  templateUrl: './planttype.component.html',
})
export class PlanttypeComponent implements OnInit {
  showDialog: boolean = false;
  plant:planttypeViewDto [] = [];
  planttype: plantTypeDto = new plantTypeDto();
  loading: boolean = false;
  fbplanttype!: FormGroup;
  filter: any;
  submitLabel!: string;
  addFlag: boolean = true;
  valSwitch: boolean = true;
  constructor(private formbuilder: FormBuilder,
    public jwtService: JWTService, private appmasterservice: AppMasterService,
  ) {} 

  initPlant() {
    this.fbplanttype.reset();
    this.submitLabel = "Add Plant Type";
    this.addFlag = true;
    this.showDialog = true;
  }
  get FormControls() {
    return this.fbplanttype.controls;
  }
  ngOnInit() {
    this.plantTypeForm();
    this.getPlant();
  }
  plantTypeForm(){
  this.fbplanttype = this.formbuilder.group({
    plantTypeId:[0],
    code: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
    name: new FormControl('', [Validators.required, Validators.pattern(('[a-zA-Z ]*'))]),
    estimatedTon: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
    loanEligible: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
    isActive:true
  });
}
onClose() {
  this.fbplanttype.reset();
}
// post method
 savePlant():Observable<HttpEvent<plantTypeDto>>{
  if (this.addFlag) 
  {
    this.fbplanttype.value.plantTypeId=0;
    return this.appmasterservice.CreatePlantType(this.fbplanttype.value);
  }
    else return this.appmasterservice.UpdatePlantType(this.fbplanttype.value)
  }
  onSubmit() {
    if (this.fbplanttype.valid) {
      console.log(this.fbplanttype.value)
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
      this.fbplanttype.markAllAsTouched();
    }
  }
// get method
getPlant(){
  this.appmasterservice.GetPlantType().subscribe((resp) => {
    this.plant = resp as unknown as  planttypeViewDto[];
    console.log(this.plant);
    this.loading = false;
  })
}
editPlantType(planttype:plantTypeDto) {
  this.planttype.plantTypeId = planttype.plantTypeId;
  this.planttype.code = planttype.code;
  this.planttype.name = planttype.name;
  this.planttype.estimatedTon = planttype.estimatedTon;
  this.planttype.loanEligible = planttype.loanEligible;
  this.planttype.isActive = planttype.isActive;
  this.fbplanttype.setValue(this.planttype);
  this.addFlag = false;
  this.submitLabel ="Update Plant Type";
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
    this.plant = [];
    this. planttype = new plantTypeDto();
  }
}
