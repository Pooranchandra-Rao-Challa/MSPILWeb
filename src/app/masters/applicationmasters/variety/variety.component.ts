import { VarietyViewDto, VarietyDto } from './../../../_models/applicationmaster';
import { AppMasterService } from './../../../_services/appmaster.service';
import { LookupService } from './../../../_services/lookup.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';

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

  constructor(private formbuilder: FormBuilder,
    private lookupService: LookupService,
    private appmasterService: AppMasterService) { }

  ngOnInit(): void {
    this.initVarieties();
    this.initLookupDetails();
    this.varietyForm();
  }

  initLookupDetails() {
    this.lookupService.VarietyTypes().subscribe((resp) => {
      this.varietyTypes = resp;
      console.log(this.varietyTypes);

    });
  }

  initVarieties() {
    this.appmasterService.GetVarieties().subscribe((resp) => {
      this.varieties = resp as unknown as VarietyViewDto[];
      this.loading = false;
    });
  }

  varietyForm() {
    this.fbVariety = this.formbuilder.group({
      varietyId: [0],
      varietyTypeId: ['', (Validators.required)],
      code: ['', (Validators.required)],
      name: ['', (Validators.required)],
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

  saveBillParam(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.appmasterService.CreateVariety(this.fbVariety.value)
    else return this.appmasterService.UpdateVariety(this.fbVariety.value)
  }

  onSubmit() {
    console.log(this.fbVariety.value);
    if (this.fbVariety.valid) {
      this.saveBillParam().subscribe(resp => {
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
}
