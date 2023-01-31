import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CirclesViewDto, DistrictDto, DistrictViewDto, DivisonsViewDto, StateDto } from 'src/app/_models/geomodels';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { CustomerService } from 'src/app/demo/service/customer.service';

@Component({
  selector: 'app-division',
  templateUrl: './divisions.component.html',
  providers: [MessageService, ConfirmationService]
})
export class DivisionsComponent implements OnInit {

  cities: any = [];
  selectedDrop: any;
  display: boolean = false;
  divisions: DivisonsViewDto[] = []; 
  //for View you need to change this 
  district: DistrictDto = new DistrictDto();

  states: StateDto[] = [];
  loading: boolean = true;
  fbdivisions!: FormGroup;
  filter: any;
  submitLabel!: string;
  addFlag:boolean = true;

  constructor(private formbuilder: FormBuilder,
    private customerService: CustomerService,
    private geoMasterService: GeoMasterService,
    private commonService: CommonService,
    public jwtService: JWTService,
    ) {

  }
  InitDistrict() {
    this.district = new DistrictDto();
    this.fbdivisions.reset();
    this.submitLabel = "Add District";
    this.addFlag = true;
    this.display = true;
  }

  get FormControls() {
    return this.fbdivisions.controls;
  }

  ngOnInit() {

    this.initDivisions();

    this.commonService.GetStates().subscribe((resp) => {
      this.states = resp as unknown as StateDto[]
    })
    this.customerService.getCustomersLarge().then(customers => {
      this.loading = false;
    });
    this.fbdivisions = this.formbuilder.group({
      code: ['', (Validators.required)],
      name: ['', (Validators.required)],
      stateId: ['', (Validators.required)],
      isActive: true
    });
    

  }
  initDivisions() {
    this.geoMasterService.GetDivision().subscribe((resp) => {
      this.divisions = resp as unknown as DivisonsViewDto[]
    })
  }
  editProduct(district: DistrictViewDto) {
    this.district.code = district.districtCode;
    this.district.isActive = true;
    this.district.name = district.districtName;
    this.district.stateId = parseInt(district.stateId);
    // this.fbdivisions = this.formbuilder.group({
    //   code: [this.district.code, (Validators.required)],
    //   name: [this.district.name, (Validators.required)],
    //   stateId: [[this.district.stateId], (Validators.required)],
    //   isActive: true
    // });
    console.log(district);
    this.fbdivisions.setValue(this.district);
    this.submitLabel = "Update District";
    this.addFlag = false;
    this.display = true;
}
  onClose(){
    this.fbdivisions.reset();
  }
  onSubmit() {
    if (this.fbdivisions.valid) {
      console.log(this.fbdivisions.value);
      this.geoMasterService.CreateDistrict(this.fbdivisions.value).subscribe((resp) => {
        //console.log(resp);
        this.initDivisions();
        this.onClose();
        this.display = false;
      });
      // success save.
    }
    else {
      // alert("please fill the fields")
      this.fbdivisions.markAllAsTouched();
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }


  valSwitch: boolean = true;

}

