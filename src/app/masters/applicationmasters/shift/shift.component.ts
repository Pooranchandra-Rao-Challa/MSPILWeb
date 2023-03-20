import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { ShiftDto, ShiftsViewDto } from 'src/app/_models/applicationmaster';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { MAX_LENGTH_20, MAX_LENGTH_6, MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY } from 'src/app/_shared/regex';
import { MaxLength } from 'src/app/_models/common';
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';

@Component({
    selector: 'app-shift',
    templateUrl: './shift.component.html',
    providers: [MessageService, ConfirmationService]
})
export class ShiftsComponent implements OnInit {

    dialog: boolean = false;
    shifts: ShiftsViewDto[] = [];
    shift: ShiftDto = new ShiftDto();
    loading: boolean = true;
    fbshifts!: FormGroup;
    filter: any;
    submitLabel!: string;
    addFlag: boolean = true;
    maxLength: MaxLength = new MaxLength();

    constructor(private formbuilder: FormBuilder,
        private appmasterservice: AppMasterService,
        private commonService: CommonService,
        public jwtService: JWTService,
        private alertMessage:AlertMessage
    ) {

    }
    InitShift() {
        this.shift = new ShiftDto();
        this.fbshifts.reset();
        this.submitLabel = "Add Shift";
        this.addFlag = true;
        this.dialog = true;
    }

    get FormControls() {
        return this.fbshifts.controls;
    }

    ngOnInit() {
        this.initShifts();
        this.fbshifts = this.formbuilder.group({
            // shiftId: [null],
            name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
            code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_6)]),
            strFromTime: new FormControl('', [Validators.required]),
            strToTime: new FormControl('', [Validators.required]),
            isNextDay: [true],
            isActive:  [true],
        });
    }
    initShifts() {
        this.appmasterservice.GetShift().subscribe((resp) => {
            this.shifts = resp as unknown as ShiftsViewDto[]
            this.loading = false;
        })
    }
    editProduct(shifts: ShiftsViewDto) {
        this.shift.code = shifts.code;
        this.shift.name = shifts.name;
        this.shift.isActive = shifts.isActive;
        this.shift.isNextDay = shifts.isNextDay;
        this.shift.fromTime= shifts.fromTime
        this.shift.toTime = shifts.toTime;
        this.fbshifts.setValue(this.shift);
        this.submitLabel = "Update Shift";
        this.addFlag = false;
        this.dialog = true;
    }
    private UpdateForm() {
    }
    onClose() {
        this.fbshifts.reset();
    }

    saveShift(): Observable<HttpEvent<ShiftDto>> {
        // var test = this.fbshifts.value;
        // console.log(test);
        // test.FromTime = this.convertstrTimetoTimeobject(test.FromTime)
        // test.ToTime = this.convertstrTimetoTimeobject(test.ToTime)
        // console.log(test);
debugger

        if (this.addFlag) return this.appmasterservice.CreateShift(this.fbshifts.value)
        else return this.appmasterservice.UpdateShift(this.fbshifts.value)
    }

    // convertstrTimetoTimeobject(time:string){
    //     return{hours:Number(time.split(':')[0]), minutes: Number(time.split(':')[1]) }
    // }

    onSubmit() {
debugger

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
            // alert("please fill the fields")
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
    valSwitch: boolean = true;
    nextSwitch: boolean = true;
}
