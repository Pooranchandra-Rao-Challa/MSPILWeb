import { BankDto, BranchDto, TptdetailViewDto, TptdetailDto, SeasonDto, LookupDetailDto } from './../../../_models/applicationmaster';
import { LookupService } from './../../../_services/lookup.service';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BankViewDto, TptDto, TptViewDto, VehicleTypeViewDto } from 'src/app/_models/applicationmaster';
import { Table } from 'primeng/table';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { SeasonViewDto } from '../../../_models/applicationmaster';
import { BillMasterService } from '../../../_services/billmaster.service';
import { BillParameterViewDto } from 'src/app/_models/billingmaster';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';

@Component({
  selector: 'app-season',
  templateUrl: './season.component.html',
  styles: [
  ]
})
export class SeasonComponent implements OnInit {

  seasons: SeasonViewDto[] = [];
  season: SeasonDto = new SeasonDto();
  loading: boolean = false;
  globalFilterFields: string[] = ['code', 'name', 'relationType', 'relationName', 'gender', 'address', 'pinCode', 'phoneNo', 
  'email', 'panNo', 'tax', 'tds', 'guarantor1', 'glCode', 'subGLCode', 'isActive', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy'];
  @ViewChild('filter') filter!: ElementRef;
  fbseasons!: FormGroup;
  submitLabel!: string;
  addFlag: boolean = true;
  showDialog: boolean = false;
  billParams: BillParameterViewDto[] = [];
  billCategories: LookupDetailDto[] = [];
  mediumDate: string = MEDIUM_DATE;


  constructor(private formbuilder: FormBuilder,
    private appMasterService: AppMasterService,
    private LookupService: LookupService,) { 
  }

  ngOnInit(): void {
    this. initSeasons();
    this.seasonForm();
    this.initBillCategories()
  }

  initSeasons() {
    this.appMasterService.Getseason().subscribe((resp) => {
      this.seasons = resp as unknown as SeasonViewDto[];
      this.loading = false;
    });
  }
  initBillCategories(){
   this.LookupService.BillCategories().subscribe((resp) => {
    this.billCategories = resp as unknown as LookupDetailDto[];
    this.initBillParamsForCategory(this.billCategories[0].lookUpDetailId +'');
    });
  }

  initBillParamsForCategory(categoryId:string){
    this.appMasterService.BillParamsForCategory(categoryId).subscribe((resp) => {
      this.billParams = resp as unknown as BillParameterViewDto[];
      console.log(this.billParams);
    }); 
  }

  handleBillCategoryChange(sevent:any){
    console.log(this.fbseasons.controls['farmerRates'].getRawValue());
    var index = sevent.index;
    console.log(sevent);
    // var billCategoryId = this.billCategories[index].lookUpDetailId
    this.initBillParamsForCategory(this.billCategories[index].lookUpDetailId +'') 
  }
  
  seasonForm() {
    this.fbseasons = this.formbuilder.group({
      seasonId: [],
      code: new FormControl('',),
      name: new FormControl('',),
      plantFrom: ['', (Validators.required)],
      plantTo: new FormControl('', ),
      crushFrom: ['', (Validators.required)],
      crushTo: [Date, (Validators.required)],
      burnCaneRate: ['', (Validators.required)],
      caneRate: ['', (Validators.required)],
      capacity: ['',],
      currentSeason: [''],
      isActive: [true],
      farmerRates: this.formbuilder.array([]),
      harvesterRates: this.formbuilder.array([]),
      transporterRates: this.formbuilder.array([]),
      seedRates: this.formbuilder.array([])
    });
  }
  createItem(billCategory: LookupDetailDto): FormGroup {
    return this.formbuilder.group({
      seasonBillingRateId:[0],
      billParamId: ['', Validators.required],
      billCatetoryId: [billCategory.lookUpDetailId, Validators.required],
      rate: ['', Validators.required],
      priority: ['', Validators.required],
      isActive: [true],
   });
  }

  RateControls(formgroupname: string) : FormArray{
    return this.fbseasons.get(formgroupname) as FormArray;
  }
  addItem(formArrayName: string, billCategory: LookupDetailDto) {
    const formArray = this.fbseasons.get(formArrayName) as FormArray;
    formArray.push(this.createItem(billCategory));
  }

  get FormControls() {
    return this.fbseasons.controls;
  }

  // get farmerRates(): FormArray {
  //   return this.fbseasons.get('farmerRates') as FormArray;
  // }

  // get harvesterRates(): FormArray {
  //   return this.fbseasons.get('harvestorRates') as FormArray;
  // }

  // get transporterRates(): FormArray {
  //   return this.fbseasons.get('transporterRates') as FormArray;
  // }

  // get seedRates(): FormArray {
  //   return this.fbseasons.get('seedRates') as FormArray;
  // }


  


  // editseason(season: SeasonViewDto) {
  //   this.season.seasonId = season.seasonId;
  //   this.season.code = season.code;
  //   this.season.name = season.name;
  //   this.season.plantFrom = season.plantFrom;
  //   this.season.plantTo = season.plantTo;
  //   this.season.crushFrom = season.crushFrom;
  //   this.season.crushTo = season.crushTo;
  //   this.season.burnCaneRate = season.burnCaneRate;
  //   this.season.caneRate = season.caneRate;
  //   this.season.caneRate = season.caneRate;
  //   this.season.capacity = season.capacity;
  //   this.season.currentSeason = season.currentSeason;
  //   this.season.isActive = season.isActive;
  //   this.season.farmerRates = this.farmerRates ? [] : this.farmerRates;
  //   this.season.transporter = this.transporter ? [] : this.transporter;
  //   this.season.harvestor = this.harvestor ? [] : this.harvestor;
  //   this.season.seed = this.seed ? [] : this.seed;
  //   this.fbseasons.controls['seasonId'].setValue(season.seasonId);
  //   this.addFlag = false;
  //   this.submitLabel = "Update Season";
  //   this.showDialog = true;
  // }


//   editseason(season: SeasonViewDto) {
//     this.season = season;
//     this.fbseasons.controls['seasonId'].setValue(season.seasonId);
//     this.fbseasons.controls['code'].setValue(season.code);
//     this.fbseasons.controls['name'].setValue(season.name);
//     this.fbseasons.controls['plantFrom'].setValue(season.plantFrom);
//     this.fbseasons.controls['plantTo'].setValue(season.plantTo);
//     this.fbseasons.controls['crushFrom'].setValue(season.crushFrom);
//     this.fbseasons.controls['crushTo'].setValue(season.crushTo);
//     this.fbseasons.controls['burnCaneRate'].setValue(season.burnCaneRate);
//     this.fbseasons.controls['caneRate'].setValue(season.caneRate);
//     this.fbseasons.controls['capacity'].setValue(season.capacity);
//     this.fbseasons.controls['currentSeason'].setValue(season.currentSeason);
//     this.fbseasons.controls['isActive'].setValue(season.isActive);
//     Bind farmer, transporter, harvestor and seed array
//     this.season.farmerRates = this.farmerRates ? [] : this.farmerRates;
//     this.season.transporter = this.transporter ? [] : this.transporter;
//     this.season.harvestor = this.harvestor ? [] : this.harvestor;
//     this.season.seed = this.seed ? [] : this.seed;
//     this.addFlag = false;
//     this.submitLabel = "Update Season";
//     this.showDialog = true;
 //  }

  addSeason() {
    this.submitLabel = "Add Season";
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
  saveSeason(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.appMasterService.CreateSeason(this.fbseasons.value)
    else return this.appMasterService.UpdateSeason(this.fbseasons.value)
  }
  onSubmit() {

    console.log(this.fbseasons.valid);
    return
    if (this.fbseasons.valid) {
      this.saveSeason().subscribe(resp => {
        if (resp) {
          this. initSeasons();
          this.fbseasons.reset();
          this.showDialog = false;
        }
      })
    }
    else {
      this.fbseasons.markAllAsTouched();
    }
  }
  onClose() {
    this.fbseasons.reset();
  }

  

  
}
