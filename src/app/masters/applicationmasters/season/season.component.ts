import { MessageService } from 'primeng/api';
import { SeasonDto, LookupDetailDto, SeasonBillingRateViewDto } from 'src/app/_models/applicationmaster';
import { LookupService } from 'src/app/_services/lookup.service';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import {
  Component, ElementRef, OnInit, ViewChild,
} from '@angular/core';
import { Table } from 'primeng/table';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { SeasonViewDto } from 'src/app/_models/applicationmaster';
import { BillParameterViewDto, } from 'src/app/_models/billingmaster';
import { FORMAT_DATE, MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { RG_NUMERIC_ONLY, RG_SEASON_CODE, RG_SEASON_NAME, } from 'src/app/_shared/regex';
import { ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { AlertMessage } from 'src/app/_alerts/alertMessage';
import { JWTService } from 'src/app/_services/jwt.service';
import { MaxLength } from 'src/app/_models/common';
import { DateValidators } from 'src/app/_validators/dateRangeValidator';

@Component({
  selector: 'app-season',
  templateUrl: './season.component.html',
  styles: [],
})

export class SeasonComponent implements OnInit {
  seasons: SeasonViewDto[] = [];
  season: SeasonDto = new SeasonDto();
  globalFilterFields: string[] = ['code', 'name', 'plantFrom', 'plantTo', 'crushFrom', 'crushTo', 'burnCaneRate', 'caneRate', 'capacity', 'createdAt', 'isActive', 'createdBy',
    'updatedAt', 'updatedBy',]
  @ViewChild('filter') filter!: ElementRef;
  fbseasons!: FormGroup;
  submitLabel!: string;
  addFlag: boolean = true;
  showDialog: boolean = false;
  billParams: BillParameterViewDto[] = [];
  billCategories: LookupDetailDto[] = [];
  mediumDate: string = MEDIUM_DATE;
  cSeasonCode: string = ""
  existCurrentSeasonRecord: boolean = false;
  permissions: any;
  activeIndex: number = 0;
  maxLength: MaxLength = new MaxLength();
  invalidSeasonCode: boolean = false;

  constructor(
    private formbuilder: FormBuilder,
    private appMasterService: AppMasterService,
    private LookupService: LookupService,
    private alertMessage: AlertMessage,
    private messageService: MessageService,
    private jwtService: JWTService) { }

  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    var year = new Date().getFullYear();
    this.cSeasonCode = year.toString() + '-' + (year + 1).toString().substring(2)
    this.initSeasons();
    this.seasonForm();
    this.initBillCategories();
  }

  initSeasons() {
    this.appMasterService.Getseason().subscribe((resp) => {
      this.seasons = resp as unknown as SeasonViewDto[];
      this.seasons.forEach(
        season => {
          season.plantFrom = new Date(season.plantFrom)
          season.plantTo = new Date(season.plantTo)
          season.crushFrom = new Date(season.crushFrom)
          season.crushTo = new Date(season.crushTo)
        }
      );
      this.existCurrentSeasonRecord =
        this.seasons.filter((sesaon) => sesaon.code == this.cSeasonCode).length == 1
    });
  }

  initBillCategories() {
    this.LookupService.BillCategories().subscribe((resp) => {
      this.billCategories = resp as unknown as LookupDetailDto[];
      this.initBillParamsForCategory();
    });
  }

  initBillParamsForCategory() {
    this.billCategories.forEach((billCategory) => {
      this.appMasterService
        .BillParamsForCategory(billCategory.lookupDetailId!)
        .subscribe((resp) => {
          billCategory.billParams = resp as unknown as BillParameterViewDto[];
        });
    })
  }

  handleBillCategoryChange(sevent: any) {
    var index = sevent.index;
    this.initBillParamsForCategory();
  }

  seasonForm() {
    this.fbseasons = this.formbuilder.group({
      seasonId: [null],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_SEASON_CODE)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_SEASON_NAME)]),
      plantFrom: new FormControl(null, [Validators.required]),
      plantTo: new FormControl(null, [Validators.required]),
      crushFrom: [null, Validators.required],
      crushTo: [null, Validators.required],
      burnCaneRate: new FormControl(null, [Validators.required, Validators.pattern(RG_NUMERIC_ONLY),]),
      caneRate: new FormControl(null, [Validators.required, Validators.pattern(RG_NUMERIC_ONLY),]),
      capacity: new FormControl(null, [Validators.required, Validators.pattern(RG_NUMERIC_ONLY),]),
      currentSeason: [''],
      isActive: [true],
      farmerRates: this.formbuilder.array([]),
      harvesterRates: this.formbuilder.array([]),
      transporterRates: this.formbuilder.array([]),
      seedRates: this.formbuilder.array([]),
    }, {
      validators: Validators.compose([
        DateValidators.dateRangeValidator('plantFrom', 'plantTo', { 'plantFrom': true }),
        DateValidators.dateRangeValidator('crushFrom', 'crushTo', { 'crushFrom': true })
      ])
    });
  }

  createItem(billCategory: LookupDetailDto): FormGroup {
    return this.formbuilder.group({
      seasonBillingRateId: [],
      seasonId: [],
      billParameterId: ['', Validators.required],
      billCatetoryId: [billCategory.lookupDetailId, Validators.required],
      rate: new FormControl('', [Validators.required, Validators.pattern(RG_NUMERIC_ONLY),]),
      priority: new FormControl('', [Validators.required, Validators.pattern(RG_NUMERIC_ONLY),]),
      isActive: [true],
    });
  }

  createItemForEdit(billParam: SeasonBillingRateViewDto): FormGroup {
    return this.formbuilder.group({
      seasonBillingRateId: [billParam.billParameterId],
      seasonId: [billParam.seasonId],
      billParameterId: [billParam.billParameterId, Validators.required],
      billCatetoryId: [billParam.billCategoryId, Validators.required],
      rate: new FormControl(billParam.rate, [Validators.required, Validators.pattern(RG_NUMERIC_ONLY),]),
      priority: new FormControl(billParam.priority, [Validators.required, Validators.pattern(RG_NUMERIC_ONLY),]),
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

  ratesControls(formArrayName: string): FormArray {
    return this.fbseasons.get(formArrayName) as FormArray;
  }

  formArrayControls(formArrayName: string, i: number, formControlName: string) {
    return this.ratesControls(formArrayName).controls[i].get(formControlName);
  }

  get FormControls() {
    return this.fbseasons.controls;
  }

  editseason(season: SeasonViewDto) {
    this.activeIndex = 0;
    this.seasonForm();
    this.fbseasons.patchValue(season);
    this.fbseasons.patchValue({
      plantFrom: new Date(season.plantFrom?.toString() + ''),
      plantTo: new Date(season.plantTo?.toString() + ''),
      crushFrom: new Date(season.crushFrom?.toString() + ''),
      crushTo: new Date(season.crushTo?.toString() + ''),
    });
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
            (element) => element.billCategoryId == billCategory.lookupDetailId
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
    this.seasonForm();
    this.showDialog = true;

    // if(!this.existCurrentSeasonRecord){
    //   this.submitLabel = 'Add Season';
    //   this.addFlag = true;
    //   this.seasonForm();
    //   this.showDialog = true;
    //   this.fbseasons.controls['code'].patchValue(this.cSeasonCode);
    // }else {
    //   this.messageService.add({
    //     key: 'existCurrentSeasonRecord',
    //     severity: 'info',
    //     summary: 'Info Message',
    //     detail: 'Current Season is defined',
    //     life: 5000
    //   });
    // }

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
    if (this.fbseasons.valid && !this.invalidSeasonCode) {
      this.fbseasons.value.plantFrom = FORMAT_DATE(this.fbseasons.value.plantFrom);
      this.fbseasons.value.plantTo = FORMAT_DATE(this.fbseasons.value.plantTo);
      this.fbseasons.value.crushFrom = FORMAT_DATE(this.fbseasons.value.crushFrom);
      this.fbseasons.value.crushTo = FORMAT_DATE(this.fbseasons.value.crushTo);
      this.saveSeason().subscribe((resp) => {
        if (resp) {
          this.initSeasons();
          this.seasonForm();
          this.showDialog = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMAMSE001" : "SMAMSE002"]);
        }
      });
    }
    else {
      this.fbseasons.markAllAsTouched();
    }
  }

  onValidateSeasonCode() {
    if (this.fbseasons.controls['code'].valid) {
      var fromYear = parseInt(this.fbseasons.controls['code'].value.substring(2, 4));
      var toYear = parseInt(this.fbseasons.controls['code'].value.substring(5, 7));
      var supposedToYear = fromYear + 1;
      if (toYear != supposedToYear) {
        this.invalidSeasonCode = true;
      }
      else {
        this.invalidSeasonCode = false;
      }
    }
    else {
      this.fbseasons.controls['code'].markAllAsTouched();
    }
  }

  onClose() {
    this.fbseasons.reset();
  }

  ngOnDestroy() {
    this.seasons = [];
    this.billParams = [];
    this.billCategories = [];
  }
}
