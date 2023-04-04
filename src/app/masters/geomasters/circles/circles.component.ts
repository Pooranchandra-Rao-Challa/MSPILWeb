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
  CirclesViewDto,
  CircleDto,
  DivisionDto,
} from 'src/app/_models/geomodels';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import {
  MAX_LENGTH_20,
  MAX_LENGTH_50,
  MAX_LENGTH_6,
  MIN_LENGTH_2,
  RG_ALPHA_NUMERIC,
  RG_ALPHA_ONLY,
  RG_NUMERIC_ONLY,
  RG_PHONE_NO,
} from 'src/app/_shared/regex';
import { MaxLength } from 'src/app/_models/common';
import { AlertMessage, ALERT_CODES } from '../../../_alerts/alertMessage';

@Component({
  selector: 'app-circle',
  templateUrl: './circles.component.html',
})
export class CirclesComponent implements OnInit {

  dialog: boolean = false;
  circles: CirclesViewDto[] = [];
  circle: CircleDto = new CircleDto();
  fbcircles!: FormGroup;
  @ViewChild('filter') filter!: ElementRef;
  submitLabel!: string;
  addFlag: boolean = true;
  divisions: DivisionDto[] = [];
  valSwitch: boolean = true;
  mediumDate: string = MEDIUM_DATE;
  maxLength: MaxLength = new MaxLength();
  permissions: any;

  constructor(
    private formbuilder: FormBuilder,
    private geoMasterService: GeoMasterService,
    private commonService: CommonService,
    public jwtService: JWTService,
    private AlertMessage: AlertMessage
  ) { }
  InitCircle() {
    this.circle = new CircleDto();
    this.fbcircles.reset();
    this.submitLabel = 'Add Circle';
    this.addFlag = true;
    this.dialog = true;
  }
  get FormControls() {
    return this.fbcircles.controls;
  }
  ngOnInit() {
    this.permissions = this.jwtService.Permissions;
    this.initCircles();
    this.commonService.GetDivision().subscribe((resp) => {
      this.divisions = resp as unknown as DivisionDto[];
    });

    this.fbcircles = this.formbuilder.group({
      divisionId: ['', Validators.required],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      inchargeName: new FormControl(null, [Validators.required, Validators.pattern(RG_PHONE_NO)]),

      listingOrder: new FormControl('', [
        Validators.required,
        Validators.pattern(RG_NUMERIC_ONLY),
      ]),
      isActive: [Validators.required],

      inchargePhoneNo: new FormControl('', [Validators.pattern(RG_PHONE_NO),
      ]),
      address: ['', Validators.required],
      circleId: [''],
    });
  }
  initCircles() {
    this.geoMasterService.GetCircles().subscribe((resp) => {
      this.circles = resp as unknown as CirclesViewDto[];
    });
  }
  editProduct(circle: CirclesViewDto) {
    this.circle.code = circle.circleCode;
    this.circle.name = circle.circleName;
    this.circle.isActive = circle.isActive;
    this.circle.divisionId = circle.divisionId;
    this.circle.inchargeName = circle.inchargeName;
    this.circle.inchargePhoneNo = circle.inchargePhoneNo;
    this.circle.listingOrder = circle.listingOrder;
    this.circle.address = circle.address;
    this.circle.circleId = circle.circleId;
    this.fbcircles.setValue(this.circle);
    this.submitLabel = 'Update Circle';
    this.addFlag = false;
    this.dialog = true;
  }
  onClose() {
    this.fbcircles.reset();
  }
  saveCircle(): Observable<HttpEvent<CircleDto>> {
    if (this.addFlag)
      return this.geoMasterService.CreateCircle(this.fbcircles.value);
    else return this.geoMasterService.UpdateCircle(this.fbcircles.value);
  }
  onSubmit() {
    if (this.fbcircles.valid) {
      this.saveCircle().subscribe((resp) => {
        if (resp) {
          this.initCircles();
          this.onClose();
          this.dialog = false;
          this.AlertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMGMCI001" : "SMGMCI002"]);
        }
      });
    } else {
      this.fbcircles.markAllAsTouched();
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
    this.divisions = [];
    this.circles = [];
  }
}
