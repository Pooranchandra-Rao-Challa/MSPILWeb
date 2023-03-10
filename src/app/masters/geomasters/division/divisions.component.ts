import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DivisionDto, DivisonsViewDto, StateDto } from 'src/app/_models/geomodels';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { MAX_LENGTH_6, MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY, RG_NUMERIC_ONLY, RG_PHONE_NO } from 'src/app/_shared/regex';

@Component({
  selector: 'app-division',
  templateUrl: './divisions.component.html',
  providers: [MessageService, ConfirmationService]
})
export class DivisionsComponent implements OnInit {
  valSwitch: boolean = false;
  display: boolean = false;
  divisions: DivisonsViewDto[] = [];
  division: DivisionDto = new DivisionDto();
  states: StateDto[] = [];
  loading: boolean = true;
  fbdivisions!: FormGroup;
  @ViewChild('filter') filter!: ElementRef;
  submitLabel!: string;
  addFlag: boolean = true;
  mediumDate: string = MEDIUM_DATE;

  constructor(private formbuilder: FormBuilder,
    private geoMasterService: GeoMasterService,
    private commonService: CommonService,
    public jwtService: JWTService,
  ) { }

  InitDivision() {
    this.division = new DivisionDto();
    this.submitLabel = "Add Division";
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
    });
    this.fbdivisions = this.formbuilder.group({
      divisionId: [null],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_6)]),
      inchargeName: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY)]),
      listingOrder: new FormControl('', [Validators.required, Validators.pattern(RG_NUMERIC_ONLY)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY)]),
      inchargePhoneNo: new FormControl('',[Validators.required,Validators.pattern(RG_PHONE_NO)]),
      address: new FormControl(null, [Validators.required, Validators.pattern("[a-zA-Z0-9.,/#&-]+")]),
      isActive: new FormControl(true, Validators.required),
    });


  }
  initDivisions() {
    this.geoMasterService.GetDivision().subscribe((resp) => {
      this.divisions = resp as unknown as DivisonsViewDto[]
      this.loading = false;
    })
  }

  editProduct(division: DivisonsViewDto) {
    this.division.divisionId = division.divisionId;
    this.division.code = division.divisionCode;
    this.division.name = division.divisionName;
    this.division.inchargeName = division.inchargeName;
    this.division.inchargePhoneNo = division.inchargePhoneNo;
    this.division.address = division.address;
    this.division.listingOrder = division.listingOrder;
    this.division.isActive = division.isActive;
    this.fbdivisions.setValue(this.division);
    this.submitLabel = "Update Divison";
    this.addFlag = false;
    this.display = true;
  }

  onClose() {
    this.fbdivisions.reset();
  }

  saveDivision(): Observable<HttpEvent<DivisionDto>> {
    if (this.addFlag) return this.geoMasterService.CreateDivision(this.fbdivisions.value)
    else return this.geoMasterService.UpdateDivision(this.fbdivisions.value)
  }

  onSubmit() {
    if (this.fbdivisions.valid) {
      this.saveDivision().subscribe(resp => {
        if (resp) {
          this.initDivisions();
          this.onClose();
          this.display = false;
        }
      })
    }
    else {
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

  ngOnDestroy() {
    this.states = [];
    this.divisions = [];
  }

}


