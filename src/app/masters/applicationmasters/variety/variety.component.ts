import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { MAX_LENGTH_10, MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY } from 'src/app/_shared/regex';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { VarietyViewDto, VarietyDto } from 'src/app/_models/applicationmaster';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { LookupService } from 'src/app/_services/lookup.service';

@Component({
  selector: 'app-variety',
  templateUrl: './variety.component.html',
  styles: [
  ]
})
export class VarietyComponent implements OnInit {
  varietyTypes: any;
  varieties: VarietyViewDto[] = [];
  variety: VarietyDto = new VarietyDto();
  loading: boolean = true;
  globalFilterFields: string[] = ['varietyType', 'code', 'name', 'plantAge', 'ratoonAge', 'sugarContent', 'plantSuitability', 'isActive', 'createdAt', 'createdBy',
    'updatedAt', 'updatedBy'];
  @ViewChild('filter') filter!: ElementRef;
  submitLabel!: string;
  addFlag: boolean = true;
  showDialog: boolean = false;
  fbVariety!: FormGroup;
  mediumDate: string = MEDIUM_DATE;

  constructor(private formbuilder: FormBuilder,
    private lookupService: LookupService,
    private appMasterService: AppMasterService) { }

  ngOnInit(): void {
    this.initVarieties();
    this.initLookupDetails();
    this.varietyForm();
  }

  initLookupDetails() {
    this.lookupService.VarietyTypes().subscribe((resp) => {
      this.varietyTypes = resp;
    });
  }

  initVarieties() {
    this.appMasterService.GetVarieties().subscribe((resp) => {
      this.varieties = resp as unknown as VarietyViewDto[];
      this.loading = false;
    });
  }

  varietyForm() {
    this.fbVariety = this.formbuilder.group({
      varietyId: [null],
      varietyTypeId: ['', (Validators.required)],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_10)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY)]),
      plantAge: ['', (Validators.required)],
      ratoonAge: ['', (Validators.required)],
      sugarContent: ['', (Validators.required)],
      plantSuitability: ['', (Validators.required)],
      isActive: [true]
    });
  }

  get FormControls() {
    return this.fbVariety.controls;
  }

  addVariety() {
    this.submitLabel = "Add Variety";
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

  editVariety(variety: VarietyViewDto) {
    this.variety.varietyId = variety.varietyId;
    this.variety.code = variety.code;
    this.variety.name = variety.name;
    this.variety.varietyTypeId = variety.varietyTypeId;
    this.variety.plantAge = variety.plantAge;
    this.variety.ratoonAge = variety.ratoonAge;
    this.variety.sugarContent = variety.sugarContent;
    this.variety.plantSuitability = variety.plantSuitability;
    this.variety.isActive = variety.isActive;
    this.fbVariety.setValue(this.variety);
    this.addFlag = false;
    this.submitLabel = "Update Variety";
    this.showDialog = true;
  }

  saveVariety(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.appMasterService.CreateVariety(this.fbVariety.value)
    else return this.appMasterService.UpdateVariety(this.fbVariety.value)
  }

  onSubmit() {
    if (this.fbVariety.valid) {
      this.saveVariety().subscribe(resp => {
        if (resp) {
          this.initVarieties();
          this.fbVariety.reset();
          this.showDialog = false;
        }
      })
    }
    else {
      this.fbVariety.markAllAsTouched();
    }
  }

  ngOnDestroy() {
    this.varietyTypes = [];
    this.varieties = [];
    this.variety = new VarietyDto();
  }

}
