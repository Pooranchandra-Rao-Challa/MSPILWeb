import {  SeasonDto, LookupDetailDto, SeasonBillingRateViewDto } from './../../../_models/applicationmaster';
import { LookupService } from './../../../_services/lookup.service';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { SeasonViewDto } from '../../../_models/applicationmaster';
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
      // this.billParams = resp as unknown as BillParameterViewDto[];
      // console.log(this.billParams);
      this.billCategories.map( s => {
        if(s.lookUpDetailId?.toString() == categoryId.toString()){
          s.billParams = [];
          s.billParams = resp as unknown as BillParameterViewDto[];
        }
      } )
    }); 
  }

  handleBillCategoryChange(sevent:any){
    console.log(this.fbseasons.controls['farmerRates'].getRawValue());
    var index = sevent.index;
    // var billCategoryId = this.billCategories[index].lookUpDetailId
   this.initBillParamsForCategory(this.billCategories[index].lookUpDetailId +'') ;
  }
  
  seasonForm() {
    this.fbseasons = this.formbuilder.group({
      seasonId: [null],
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
      seasonBillingRateId:[null],
      seasonId: [null],
      billParameterId: ['', Validators.required],
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

  get farmerRatesControls(): FormArray {
    return this.fbseasons.get('farmerRates') as FormArray;
  }

  get harvesterRatesControls(): FormArray {
    return this.fbseasons.get('harvesterRates') as FormArray;
  }

  get transporterRatesControls(): FormArray {
    return this.fbseasons.get('transporterRates') as FormArray;
  }

  get seedRatesControls(): FormArray {
    return this.fbseasons.get('seedRates') as FormArray;
  }


  editseason(season: SeasonViewDto) {
    this.fbseasons.patchValue(season);
    this.getSeasonBillingRatesBySeasonId(season.seasonId);
    this.addFlag = false;
    this.submitLabel = "Update Season";
    this.showDialog = true;
  }
  
  getSeasonBillingRatesBySeasonId(seasonId: number | undefined) {
    this.appMasterService.GetSeasonBillingRates(seasonId).subscribe((resp) => {      
      let rates = resp as unknown as SeasonBillingRateViewDto[];
      console.log(rates);
      
      // let farmerRates = rates.filter(element => element.billCatetoryId == this.billCategories[0].lookUpDetailId);
      // let transporterRates = rates.filter(element => element.billCatetoryId == this.billCategories[1].lookUpDetailId);
      // let harvesterRates = rates.filter(element => element.billCatetoryId == this.billCategories[2].lookUpDetailId);
      // let seedRates = rates.filter(element => element.billCatetoryId == this.billCategories[3].lookUpDetailId);

      // for (const key in farmerRates) {
      //   this.addItem('farmerRates', this.billCategories[0]);
      //   this.farmerRatesControls.controls[key].patchValue(farmerRates[key]);
      // }
      // for (const key in transporterRates) {
      //   this.addItem('transporterRates', this.billCategories[1]);
      //   this.transporterRatesControls.controls[key].patchValue(farmerRates[key]);
      // }
      // for (const key in harvesterRates) {
      //   this.addItem('harvesterRates', this.billCategories[2]);
      //   this.harvesterRatesControls.controls[key].patchValue(farmerRates[key]);
      // }
      // for (const key in seedRates) {
      //   this.addItem('seedRates', this.billCategories[3]);
      //   this.seedRatesControls.controls[key].patchValue(farmerRates[key]);
      // }
    });
  }

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
    debugger;
    console.log(this.fbseasons.valid);
    if (this.fbseasons.valid) {
      this.saveSeason().subscribe(resp => {
        if (resp) {
          this. initSeasons();
          this.fbseasons.reset();
          this.showDialog = false;
        } })
    }
    else {
      this.fbseasons.markAllAsTouched();
    }
  }
  onClose() {
    this.fbseasons.reset();
  }
  
}
