import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { FormBuilder,FormControl,FormGroup, Validators,}  from '@angular/forms';
import {CircleDto, DivisionDto,SectionDto,ISectionsViewDto,StateDto,} from 'src/app/_models/geomodels';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import {MAX_LENGTH_20,MIN_LENGTH_2,RG_ADDRESS,RG_ALPHA_NUMERIC,RG_ALPHA_ONLY, RG_PHONE_NO,} from 'src/app/_shared/regex';
import { ITableHeader, MaxLength } from 'src/app/_models/common';
import { ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { AlertMessage } from 'src/app/_alerts/alertMessage';
@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
})
export class SectionComponent implements OnInit {
  display: boolean = false;
  sections: ISectionsViewDto[] = [];
  section: SectionDto = new SectionDto();
  states: StateDto[] = [];
  fbsections!: FormGroup;
  @ViewChild('filter') filter!: ElementRef;
  submitLabel!: string;
  addFlag: boolean = true;
  divisions: DivisionDto[] = [];
  circles: CircleDto[] = [];
  valSwitch: boolean = true;
  mediumDate: string = MEDIUM_DATE;
  maxLength: MaxLength = new MaxLength();
  permissions: any;

  headers: ITableHeader[] = [
    { field: 'divisionName', header: 'divisionName', label: 'Division' },
    { field: 'circleName', header: 'circleName', label: 'Circle' },
    { field: 'sectionCode', header: 'sectionCode', label: 'Code' },
    { field: 'sectionName', header: 'sectionName', label: 'Section' },
    { field: 'inchargeName', header: 'inchargeName', label: 'Incharge Name' },
    { field: 'inchargePhoneNo', header: 'inchargePhoneNo', label: 'Mandal' },
    { field: 'listingOrder', header: 'listingOrder', label: 'Order'},
    { field: 'address', header: 'address', label: 'Address'},
    { field: 'targetArea', header: 'targetArea', label: 'Target Area' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ];

  constructor(
    private formbuilder: FormBuilder,
    private geoMasterService: GeoMasterService,
    private commonService: CommonService,
    public jwtService: JWTService,
    public alertMessage: AlertMessage
  ) { }
  addSection() {
    this.fbsections.controls['isActive'].setValue(true);
    this.submitLabel = 'Add Section';
    this.clearCircles();
    this.addFlag = true;
    this.display = true;
  }
  clearCircles(){
    this.circles =[];
  }
  get FormControls() {
    return this.fbsections.controls;
  }
  ngOnInit() {
    this.permissions = this.jwtService.Permissions;
    this.initSections();
    this.commonService.GetStates().subscribe((resp) => {
      this.states = resp as unknown as StateDto[];
    });
    this.commonService.GetDivision().subscribe((resp) => {
      this.divisions = resp as unknown as DivisionDto[];
    });
    this.fbsections = this.formbuilder.group({
      sectionId: [null],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      listingOrder: new FormControl(null, [Validators.required]),
      address: new FormControl(null, [Validators.required, Validators.pattern(RG_ADDRESS)]),
      circleId: new FormControl(null, Validators.required),
      divisionId: new FormControl(null, [Validators.required,]),
      inchargePhoneNo: new FormControl(null, [Validators.pattern(RG_PHONE_NO),]),
      inchargeName: new FormControl('', [Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      targetArea:[null],
      isActive: [null, Validators.required],
    });
  }
  initSections() {
    this.geoMasterService.GetSections().subscribe((resp) => {
      this.sections = resp as unknown as ISectionsViewDto[];
    });
  }
  initCircles(divisionId: any) {
    this.commonService.GetCirclesForDivision(divisionId).subscribe((resp) => {
      this.circles = resp as unknown as CircleDto[];
    });
  }
  editProduct(section: ISectionsViewDto) {
    this.initCircles(section.divisionId);
    this.fbsections.controls['code'].setValue(section.sectionCode);
    this.fbsections.controls['name'].setValue(section.sectionName);
    this.fbsections.patchValue(section);
    this.submitLabel = 'Update Section';
    this.addFlag = false;
    this.display = true;
  }
  onClose() {
    this.fbsections.reset();
  }
  saveSection(): Observable<HttpEvent<SectionDto>> {
    if (this.addFlag)
      return this.geoMasterService.CreateSection(this.fbsections.value);
      else return this.geoMasterService.UpdateSection(this.fbsections.value);
  }
  isUniqueSectionCode() {
    const existingSectionCodes = this.sections.filter(section =>
      section.sectionCode === this.fbsections.value.code &&
      section.sectionId !== this.fbsections.value.sectionId
    )
    return existingSectionCodes.length > 0;
  }
  isUniqueSectionName() {
    const existingSectionNames = this.sections.filter(section =>
      section.sectionName === this.fbsections.value.name &&
      section.sectionId !== this.fbsections.value.sectionId
    )
    return existingSectionNames.length > 0;
  }
  onSubmit() {
    if (this.fbsections.valid) {
      if (this.addFlag) {
        if (this.isUniqueSectionCode()) {
          this.alertMessage.displayErrorMessage(
            `Section Code :"${this.fbsections.value.code}" Already Exists.`
          );
        } else if (this.isUniqueSectionName()) {
          this.alertMessage.displayErrorMessage(
            `Section Name :"${this.fbsections.value.name}" Already Exists.`
          );
        } else {
          this.save();
        }
      } else {
        this.save();
      }
    } else {
      this.fbsections.markAllAsTouched();
    }
  }
  save() {
    if (this.fbsections.valid) {
      this.saveSection().subscribe((resp) => {
        if (resp) {
          this.initSections();
          this.display = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMGMSEC001" : "SMGMSEC002"]);
        }
      });
    } else {
      this.fbsections.markAllAsTouched();
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
    this.sections = [];
    this.divisions = [];
    this.circles = [];
  }
}
