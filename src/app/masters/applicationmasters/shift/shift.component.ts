import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { JWTService } from 'src/app/_services/jwt.service';
import { ShiftDto, ShiftsViewDto } from 'src/app/_models/applicationmaster';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { MAX_LENGTH_20, MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY } from 'src/app/_shared/regex';
import { MaxLength } from 'src/app/_models/common';
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';

@Component({
  selector: 'app-shift',
  templateUrl: './shift.component.html',
})
export class ShiftsComponent implements OnInit {
  dialog: boolean = false;
  shifts: ShiftsViewDto[] = [];
  shift: ShiftDto = new ShiftDto();
  loading: boolean = true;
  fbshifts!: FormGroup;
  @ViewChild('filter') filter!: ElementRef;
  submitLabel!: string;
  addFlag: boolean = true;
  maxLength: MaxLength = new MaxLength();
  valSwitch: boolean = true;
  nextSwitch: boolean = true;
  permissions: any;

  constructor(private formbuilder: FormBuilder,
    private appmasterservice: AppMasterService,
    public jwtService: JWTService,
    private alertMessage: AlertMessage
  ) { }

  addShift() {
    this.fbshifts.controls['isNextDay'].setValue(false);
    this.fbshifts.controls['isActive'].setValue(true);
    this.submitLabel = "Add Shift";
    this.addFlag = true;
    this.dialog = true;
  }

  get FormControls() {
    return this.fbshifts.controls;
  }

  ngOnInit() {
    this.permissions = this.jwtService.Permissions;
    this.initShifts();
    this.fbshifts = this.formbuilder.group({
      shiftId: [null],
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      strFromTime: new FormControl('', [Validators.required]),
      strToTime: new FormControl('', [Validators.required]),
      isNextDay: [null],
      isActive: [null],
    });
  }

  initShifts() {
    this.appmasterservice.GetShift().subscribe((resp) => {
      this.shifts = resp as unknown as ShiftsViewDto[]
      this.loading = false;
    })
  }

  editProduct(shifts: ShiftsViewDto) {
    this.shift.shiftId = shifts.shiftId;
    this.shift.code = shifts.code;
    this.shift.name = shifts.name;
    this.shift.isActive = shifts.isActive;
    this.shift.isNextDay = shifts.isNextDay;
    this.shift.strFromTime = shifts.fromTime?.substring(0, 5);
    this.shift.strToTime = shifts.toTime?.substring(0, 5);
    this.fbshifts.setValue(this.shift);
    this.submitLabel = "Update Shift";
    this.addFlag = false;
    this.dialog = true;
  }

  saveShift(): Observable<HttpEvent<ShiftDto>> {
    if (this.addFlag) return this.appmasterservice.CreateShift(this.fbshifts.value)
    else return this.appmasterservice.UpdateShift(this.fbshifts.value)
  }

  isUniqueShiftCode() {
    const existingShiftCodes = this.shifts.filter(shift =>
      shift.code === this.fbshifts.value.code &&
      shift.shiftId !== this.fbshifts.value.shiftId
    )
    return existingShiftCodes.length > 0;
  }
  onSubmit() {
    if (this.fbshifts.valid) {
      if (this.addFlag) {
        if (this.isUniqueShiftCode()) {
          this.alertMessage.displayErrorMessage(
            `Shift Code :"${this.fbshifts.value.code}" Already Exists.`
          );
        } else {
          this.save();
        }
      } else {
        this.save();
      }
    } else {
      this.fbshifts.markAllAsTouched();
    }
  }
  
  save() {
    if (this.fbshifts.valid) {
      this.saveShift().subscribe(resp => {
        if (resp) {
          this.initShifts();
          this.onClose();
          this.dialog = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMAMSH001" : "SMAMSH002"]);
        }
      })
    }
    else {
      this.fbshifts.markAllAsTouched();
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  onClose() {
    this.fbshifts.reset();
  }

}
