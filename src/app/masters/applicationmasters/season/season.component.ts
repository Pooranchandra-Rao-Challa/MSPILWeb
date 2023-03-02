import {SeasonDto,LookupDetailDto,SeasonBillingRateViewDto,} from './../../../_models/applicationmaster';
import { LookupService } from './../../../_services/lookup.service';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import {Component, ElementRef,Input, OnInit,TemplateRef,ViewChild,} from '@angular/core';
import { Table } from 'primeng/table';
import {FormGroup, FormBuilder,FormControl,Validators,FormArray,} from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { SeasonViewDto } from '../../../_models/applicationmaster';
import { BillParameterViewDto } from 'src/app/_models/billingmaster';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import {MAX_LENGTH_20,MIN_LENGTH_2,RG_ALPHA_NUMERIC,RG_ALPHA_ONLY,RG_NUMERIC_ONLY,} from 'src/app/_shared/regex';

interface Temp {
  seasonBillingRateId: number;
  seasonId: number;
  billParameterId: number;
  billCatetoryId: number;
  rate: number;
  priority?: number;
  isActive?: boolean;
}

@Component({
  selector: 'app-season',
  templateUrl: './season.component.html',
  styles: [],
})
export class SeasonComponent implements OnInit {
  seasons: SeasonViewDto[] = [];
  season: SeasonDto = new SeasonDto();
  loading: boolean = false;
  globalFilterFields: string[] = ['code','name','relationType','relationName','gender','address','pinCode','phoneNo',
    'email','panNo','tax','tds','guarantor1','glCode','subGLCode','isActive','createdAt','createdBy', 'updatedAt','updatedBy', ];
  @ViewChild('filter') filter!: ElementRef;
  fbseasons!: FormGroup;
  submitLabel!: string;
  addFlag: boolean = true;
  showDialog: boolean = false;
  billParams: BillParameterViewDto[] = [];
  billCategories: LookupDetailDto[] = [];
  mediumDate: string = MEDIUM_DATE;

  constructor(
    private formbuilder: FormBuilder,
    private appMasterService: AppMasterService,
    private LookupService: LookupService
  ) {}

  ngOnInit(): void {
    this.initSeasons();
    this.seasonForm();
    this.initBillCategories();
  }

  initSeasons() {
    this.appMasterService.Getseason().subscribe((resp) => {
      this.seasons = resp as unknown as SeasonViewDto[];
      this.loading = false;
    });
  }
  initBillCategories() {
    this.LookupService.BillCategories().subscribe((resp) => {
      this.billCategories = resp as unknown as LookupDetailDto[];
      this.initBillParamsForCategory(
        this.billCategories[0].lookUpDetailId + ''
      );
    });
  }

  initBillParamsForCategory(categoryId: string) {
    this.appMasterService
      .BillParamsForCategory(categoryId)
      .subscribe((resp) => {
        // this.billParams = resp as unknown as BillParameterViewDto[];
        // console.log(this.billParams);
        this.billCategories.map((s) => {
          if (s.lookUpDetailId?.toString() == categoryId.toString()) {
            s.billParams = [];
            s.billParams = resp as unknown as BillParameterViewDto[];
          }
        });
      });
  }

  handleBillCategoryChange(sevent: any) {
    console.log(this.fbseasons.controls['farmerRates'].getRawValue());
    var index = sevent.index;
    // var billCategoryId = this.billCategories[index].lookUpDetailId
    this.initBillParamsForCategory(
      this.billCategories[index].lookUpDetailId + ''
    );
  }

  seasonForm() {
    this.fbseasons = this.formbuilder.group({
      seasonId: [null],
      code: new FormControl('', [
        Validators.required,
        Validators.pattern(RG_ALPHA_NUMERIC),
        Validators.minLength(MIN_LENGTH_2),
        Validators.maxLength(MAX_LENGTH_20),
      ]),
      name: new FormControl('', [
        Validators.required,
        Validators.pattern(RG_ALPHA_ONLY),
      ]),
      plantFrom: ['', Validators.required],
      plantTo: ['', Validators.required],
      crushFrom: ['', Validators.required],
      crushTo: [Date, Validators.required],
      burnCaneRate: new FormControl('', [
        Validators.required,
        Validators.pattern(RG_NUMERIC_ONLY),
      ]),
      caneRate: new FormControl('', [
        Validators.required,
        Validators.pattern(RG_NUMERIC_ONLY),
      ]),
      capacity: new FormControl('', [
        Validators.required,
        Validators.pattern(RG_NUMERIC_ONLY),
      ]),
      currentSeason: [''],
      isActive: [true],
      farmerRates: this.formbuilder.array([]),
      harvesterRates: this.formbuilder.array([]),
      transporterRates: this.formbuilder.array([]),
      seedRates: this.formbuilder.array([]),
    });
  }
  createItem(billCategory: LookupDetailDto): FormGroup {
    return this.formbuilder.group({
      seasonBillingRateId: [],
      seasonId: [],
      billParameterId: ['', Validators.required],
      billCatetoryId: [billCategory.lookUpDetailId, Validators.required],
      rate: new FormControl('', [
        Validators.required,
        Validators.pattern(RG_NUMERIC_ONLY),
      ]),
      priority: new FormControl('', [
        Validators.required,
        Validators.pattern(RG_NUMERIC_ONLY),
      ]),
      isActive: [true],
    });
  }

  createItemForEdit(billParam: SeasonBillingRateViewDto): FormGroup {
    return this.formbuilder.group({
      seasonBillingRateId: [billParam.billParameterId],
      seasonId: [billParam.seasonId],
      billParameterId: [billParam.billParameterId, Validators.required],
      billCatetoryId: [billParam.billCategoryId, Validators.required],
      rate: new FormControl(billParam.rate, [
        Validators.required,
        Validators.pattern(RG_NUMERIC_ONLY),
      ]),
      priority: new FormControl(billParam.priority, [
        Validators.required,
        Validators.pattern(RG_NUMERIC_ONLY),
      ]),
      isActive: [billParam.isActive],
    });
  }

  RateControls(formgroupname: string): FormArray {
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
    this.submitLabel = 'Update Season';
    this.showDialog = true;
  }

  getSeasonBillingRatesBySeasonId(seasonId: number | undefined) {
    this.appMasterService.GetSeasonBillingRates(seasonId).subscribe((resp) => {
      let rates = resp as unknown as SeasonBillingRateViewDto[];
  
      this.billCategories.forEach((billCategory) => {
        var categoryFormArray = this.fbseasons.get(
          billCategory.name?.toLowerCase() + 'Rates'
        ) as FormArray;

        rates
          .filter(
            (element) => element.billCategoryId == billCategory.lookUpDetailId
          )
          .forEach((rateSeasonParam) =>
            categoryFormArray.push(this.createItemForEdit(rateSeasonParam))
          );

      });
    });
    
  }

  addSeason() {
    this.submitLabel = 'Add Season';
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
    if (this.addFlag)
      return this.appMasterService.CreateSeason(this.fbseasons.value);
    else return this.appMasterService.UpdateSeason(this.fbseasons.value);
  }
  onSubmit() {
    debugger;
    console.log(this.fbseasons.valid);
    if (this.fbseasons.valid) {
      this.saveSeason().subscribe((resp) => {
        if (resp) {
          this.initSeasons();
          this.fbseasons.reset();
          this.showDialog = false;
        }
      });
    } else {
      this.fbseasons.markAllAsTouched();
    }
  }
  onClose() {
    this.fbseasons.reset();
 
  }

  ngOnDestroy() {
    this.seasons = [];
    this. billParams= [];
    this.billCategories=[];

  }

}
