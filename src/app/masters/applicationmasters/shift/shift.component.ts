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

    constructor(private formbuilder: FormBuilder,
        private appmasterservice: AppMasterService,
        private commonService: CommonService,
        public jwtService: JWTService,
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
            
            name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
            code: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
            fromTime: new FormControl('', [Validators.required]),
            toTime: new FormControl('', [Validators.required]),
            isNextDay: [ Validators.required],
            isActive: [ Validators.required],
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
      debugger
        if (this.addFlag) return this.appmasterservice.CreateShift(this.fbshifts.value)
        else return this.appmasterservice.UpdateShift(this.fbshifts.value)
    }
    onSubmit() {
      debugger
        if (this.fbshifts.valid) {
            this.saveShift().subscribe(resp => {
                if (resp) {
                    this.initShifts();
                    this.onClose();
                    this.dialog = false;
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


