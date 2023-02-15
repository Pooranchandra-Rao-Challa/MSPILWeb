import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators,FormArrayName,FormArray } from '@angular/forms';
import { CircleDto, CirclesViewDto, DivisionDto, VillageDto, VillagesViewDto, StateDto, SectionDto, DistrictDto, MandalDto } from 'src/app/_models/geomodels';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { SeasonViewDto, SeasonDto, HglViewDto, HglDto, LookupViewDto, LookUpHeaderDto, LookupDetailDto, BankDto, BranchesDto, VehicleTypeDto } from '../../../_models/applicationmaster';
import { AppMasterService } from '../../../_services/appmaster.service';
import { LookupService } from '../../../_services/lookup.service';


@Component({
  selector: 'app-hgl',
  templateUrl: './hgl.component.html',
  styles: [
  ]
})
export class HglComponent implements OnInit {

  
  display: boolean = false;
  hgls: HglViewDto[] = [];
  hgl: HglDto = new HglDto();
  relationType: LookupDetailDto[] = [];
  bank:BankDto[]=[];
  branch:BankDto[]=[];
  vehicle:VehicleTypeDto[]=[];
  loading: boolean = false;
  fbhgl!: FormGroup;
  filter: any;
  submitLabel!: string;
  addFlag: boolean = true;
  valSwitch: boolean = true;
  subHglss:any[] = [];
  showDialog!: boolean;
  showFieldset = false;
  genderOptions!: any[];



  constructor(private formbuilder: FormBuilder,
    private AppMasterService: AppMasterService,
    private commonService: CommonService,
    public jwtService: JWTService,
    public LookupService:LookupService
  ) {

  }
  Initseason(hgls: HglViewDto) {
    this.fbhgl.reset();
    this.hgl = new HglDto();
   
    this.clearParents();
    if(hgls.hglId){
      this.fbhgl.setValue(this.hgls);
      this.submitLabel = "Update HGL";
      this.addFlag = false;
    }else{
      this.submitLabel = "Add HGL";
      this.addFlag = true;
    }
    this.display = true;
  }

  clearParents(){
   
  }

  get FormControls() {
    return this.fbhgl.controls;
  }

  ngOnInit() {
    this.initHgl();

    this.LookupService.RelationTypes().subscribe((resp) => {
      this.relationType = resp as unknown as LookupDetailDto[];
      console.log(this.relationType);

    });

    this.AppMasterService.GetBank().subscribe((resp) => {
      this.bank = resp as unknown as BankDto[];
      console.log(this.bank);

    });

    this.AppMasterService.GetBank().subscribe((resp) => {
      this.branch = resp as unknown as BankDto[];
      console.log(this.branch);

    });

    this.AppMasterService.GetVehicleTypes().subscribe((resp) => {
      this.vehicle = resp as unknown as VehicleTypeDto[];
      console.log(this.vehicle);

    });





    this.fbhgl = this.formbuilder.group({

      hglId: [''],
      name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      code:new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
      gender: new FormControl('', Validators.required),
      relationTypeId: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
      relationType: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      relationName:  new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      address:new FormControl('', Validators.required),
      pinCode: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      phoneNo:new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      email: new FormControl('', [Validators.required, Validators.pattern(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)]),
      panNo: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
      aadhaarNo: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      tax: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      tds:new FormControl('',),
      guarantor1:new FormControl(''),
      guarantor2:new FormControl(''),
      guarantor3:new FormControl(''),
      branchId: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      branchName:new FormControl(''),
      bankName: new FormControl('',),
      ifsc: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
      accountNo:new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      glCode:new FormControl('', Validators.required),
      subGLCode:new FormControl('', Validators.required),
      otherCode:new FormControl('', Validators.required),
      isActive: new FormControl('', Validators.required),
  
      subHgls: this.formbuilder.array([this.createItem()]),
  
    });

     this.genderOptions = [
      { label: 'Male', value: 'M' },
      { label: 'Female', value: 'F' }
    ];

  }
  
  get gender() {
    return this.fbhgl.get('gender');
  }
  


  createItem(): FormGroup {
    return this.formbuilder.group({
      code: ['', Validators.required],
      name: ['', Validators.required],
      vehicleTypeId: ['', Validators.required],
      noOfPersons: ['', Validators.required],
      isActive:['', Validators.required]
    });
  }

  get subHgls(): FormArray {
    return this.fbhgl.get('subHgls') as FormArray;
  }

  addItem(formArrayName: string) {
    const formArray = this.fbhgl.get(formArrayName) as FormArray;
    if (formArray.length <1) {
      formArray.push(this.createItem());
    } 
    
    this.showFieldset = true;
  }

  initHgl() {
    this.AppMasterService.GetHgls().subscribe((resp) => {
      this.hgls = resp as unknown as HglViewDto[]
      console.log(this.hgls)
      this.loading = false;
    })
  }
  onClose() {
    this.fbhgl.reset();
  }

  saveHgl(): Observable<HttpEvent<HglDto>> {  
    if (this.addFlag) return this.AppMasterService.CreateHgl(this.fbhgl.value)
    else return this.AppMasterService.UpdateHgl(this.fbhgl.value)
  }
  
  onSubmit() {
    console.log(this.fbhgl.value);
    if (this.fbhgl.valid) {
     console.log(this.fbhgl.value);
      this.saveHgl().subscribe(resp => {
        if (resp) {
          this.initHgl();
          this.fbhgl.reset();
          this.showDialog = false;
        }
      })
    }
    else {
      this.fbhgl.markAllAsTouched();
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

}
