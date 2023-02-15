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
import { SeasonViewDto, SeasonDto } from '../../../_models/applicationmaster';
import { AppMasterService } from '../../../_services/appmaster.service';
import { BillParameterDto, BillParameterViewDto } from 'src/app/_models/billingmaster';
import { BillMasterService } from '../../../_services/billmaster.service';


@Component({
  selector: 'app-season',
  templateUrl: './season.component.html',
  styles: [
  ]
})
export class SeasonComponent implements OnInit {


  display: boolean = false;
  seasons: SeasonViewDto[] = [];
  season: SeasonDto = new SeasonDto();
  village: VillageDto ={};
  loading: boolean = false;
  fbseasons!: FormGroup;
  filter: any;
  submitLabel!: string;
  addFlag: boolean = true;
  valSwitch: boolean = true;
  farmers: any[] = [];
  harvesters:any[] = [];
  seeds:any[] = [];
  tranceporters:any[] = [];
  showDialog!: boolean;
  billParam: BillParameterViewDto[] = [];




  constructor(private formbuilder: FormBuilder,
    private AppMasterService: AppMasterService,
    private commonService: CommonService,
    public jwtService: JWTService,
    public BillMasterService:BillMasterService,
  ) {

  }
  Initseason(season: SeasonViewDto) {
    this.fbseasons.reset();
    this.season = new SeasonDto();
   
    this.clearParents();
    if(season.seasonId){
      this.fbseasons.setValue(this.seasons);
      this.submitLabel = "Update Season";
      this.addFlag = false;
    }else{
      this.submitLabel = "Add Season";
      this.addFlag = true;
    }
    this.display = true;
  }

  clearParents(){
   
  }

  get FormControls() {
    return this.fbseasons.controls;
  }

  ngOnInit() {
    this.initSeason();

    this.BillMasterService.GetBillParameters().subscribe((resp) => {
      this.billParam = resp as unknown as BillParameterViewDto[];
 
    });
    

    this.fbseasons = this.formbuilder.group({

      seasonId: [''],
      name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      code:new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
      plantFrom: new FormControl('', Validators.required),
      plantTo: new FormControl('', Validators.required),
      crushFrom: new FormControl('', Validators.required),
      crushTo:  new FormControl('', Validators.required),
      burnCaneRate:new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      caneRate: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      currentSeason:new FormControl(''),
      capacity: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      isActive: new FormControl(''),
 
      former: this.formbuilder.array([this.createItem()]),
      harvester: this.formbuilder.array([this.createItem()]),
      tranceporter: this.formbuilder.array([this.createItem()]),
      seed: this.formbuilder.array([this.createItem()])
    });




  }

  createItem(): FormGroup {
    return this.formbuilder.group({
      billPeram: ['', Validators.required],
      rate: ['', Validators.required],
      priority: ['', Validators.required]
    });
  }

  get former(): FormArray {
    return this.fbseasons.get('former') as FormArray;
  }

  get harvester(): FormArray {
    return this.fbseasons.get('harvester') as FormArray;
  }

  get tranceporter(): FormArray {
    return this.fbseasons.get('tranceporter') as FormArray;
  }

  get seed(): FormArray {
    return this.fbseasons.get('seed') as FormArray;
  }


  addItem(formArrayName: string) {
    const formArray = this.fbseasons.get(formArrayName) as FormArray;
    formArray.push(this.createItem());
  }



 
  initSeason() {
    this.AppMasterService.Getseason().subscribe((resp) => {
      this.seasons = resp as unknown as SeasonViewDto[]
      console.log(this.seasons)
      this.loading = false;
    })
  }

  
  onClose() {
    this.fbseasons.reset();
  }

  saveSeason(): Observable<HttpEvent<SeasonDto>> {

    if (this.addFlag) return this.AppMasterService.CreateSeason(this.fbseasons.value)
    else return this.AppMasterService.UpdateSeason(this.fbseasons.value)
  }
  
  onSubmit() {

    console.log(this.fbseasons.value)
    // if (this.fbseasons.valid) {
    //  console.log(this.fbseasons.value);
    //   this.saveSeason().subscribe(resp => {
    //     if (resp) {
    //       this.initSeason();
    //       this.fbseasons.reset();
    //       this.showDialog = false;
    //     }
    //   })
    // }
    // else {
    //   this.fbseasons.markAllAsTouched();
    // }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }



 
}





