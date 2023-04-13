import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  CircleDto,
  CirclesViewDto,
  DivisionDto,
  SectionDto,
  SectionsViewDto,
  StateDto,
} from 'src/app/_models/geomodels';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import {
  MAX_LENGTH_20,
  MAX_LENGTH_6,
  MIN_LENGTH_2,
  RG_ADDRESS,
  RG_ALPHA_NUMERIC,
  RG_ALPHA_ONLY,
  RG_NUMERIC_ONLY,
  RG_PHONE_NO,
} from 'src/app/_shared/regex';
import { MaxLength } from 'src/app/_models/common';
import { ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { AlertMessage } from '../../../_alerts/alertMessage';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
})
export class SectionComponent implements OnInit {
  display: boolean = false;
  sections: SectionsViewDto[] = [];
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
  permissions:any;
  
  constructor(
    private formbuilder: FormBuilder,
    private geoMasterService: GeoMasterService,
    private commonService: CommonService,
    public jwtService: JWTService,
    public alertMessage:AlertMessage
  ) {}

  InitSection() {
    this.section = new SectionDto();
    this.fbsections.reset();
    this.submitLabel = 'Add Section';
    this.addFlag = true;
    this.display = true;
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
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      listingOrder: new FormControl('', [
        Validators.required,
        Validators.pattern(RG_NUMERIC_ONLY),
      ]),
      address: new FormControl(null, [Validators.required,Validators.pattern(RG_ADDRESS)]),
      circleId: new FormControl('', Validators.required),
      divisionId: new FormControl('', [
        Validators.required,]),
      inchargePhoneNo: new FormControl('', [
        Validators.pattern(RG_PHONE_NO),
      ]),
      inchargeName: new FormControl('', [Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      isActive: [this.valSwitch, Validators.required],
      sectionId: [''],
    });
  }
  initSections() {
    this.geoMasterService.GetSections().subscribe((resp) => {
      this.sections = resp as unknown as SectionsViewDto[];
    
    });
  }
  initCircles(divisionId: any) {
    this.commonService.GetCirclesForDivision(divisionId).subscribe((resp) => {
      this.circles = resp as unknown as CircleDto[];
    });
  }
  editProduct(section: SectionsViewDto) {
    this.initCircles(section.divisionId);
    this.fbsections = this.formbuilder.group({
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      listingOrder: [ section.listingOrder,[Validators.required, Validators.pattern(RG_NUMERIC_ONLY)], ],
      address: [section.address, Validators.required],
      circleId: [section.circleId, Validators.required],
      divisionId: [section.divisionId],
      inchargePhoneNo: [
        section.inchargePhoneNo,
        [Validators.required, Validators.pattern(RG_PHONE_NO)],
      ],
      inchargeName: [section.inchargeName],
      isActive: [section.isActive, Validators.required],
      sectionId: [section.sectionId],
    });
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
  onSubmit() {
    if (this.fbsections.valid) {
      this.saveSection().subscribe((resp) => {
        if (resp) {
          this.initSections();
          this.onClose();
          this.display = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMGMSEC001" : "SMGMSEC001"]);
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