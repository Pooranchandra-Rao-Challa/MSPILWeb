import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CirclesViewDto, StateDto, StatesViewDto, } from 'src/app/_models/geomodels';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';

@Component({
    selector: 'app-state',
    templateUrl: './state.component.html',
    providers: [MessageService, ConfirmationService]
})
export class StateComponent implements OnInit {

    display: boolean = false;
    states: StatesViewDto[] = [];
    state: StateDto = new StateDto();
    loading: boolean = true;
    fbstates!: FormGroup;
    filter: any;
    submitLabel!: string;
    addFlag: boolean = true;

    constructor(private formbuilder: FormBuilder,
        private geoMasterService: GeoMasterService,
        private commonService: CommonService,
        public jwtService: JWTService,
    ) {

    }
    InitState() {
        this.state = new StateDto();
        this.fbstates.reset();
        this.submitLabel = "Add State";
        this.addFlag = true;
        this.display = true;
    }

    get FormControls() {
        return this.fbstates.controls;
    }

    ngOnInit() {

        this.initStates();

        this.fbstates = this.formbuilder.group({
            code:new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
            name:new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
            isActive:new FormControl (true, Validators.required),
            stateId: new FormControl(''),
        });


    }
    initStates() {
        this.geoMasterService.GetState().subscribe((resp) => {
            this.states = resp as unknown as StatesViewDto[]
            this.loading = false;
        })
    }

    editProduct(state: StatesViewDto) {
        this.state.code = state.code;
        this.state.name = state.name
        this.state.isActive = state.isActive;
        this.state.stateId = state.stateId;
        //this.state.stateId = state.stateId;
        this.fbstates.setValue(this.state);
        this.submitLabel = "Update State";
        this.addFlag = false;
        this.display = true;
    }

    private UpdateForm() {

    }
    onClose() {
        this.fbstates.reset();
    }

    saveState(): Observable<HttpEvent<StateDto>> {
        if (this.addFlag) return this.geoMasterService.CreateState(this.fbstates.value)
        else return this.geoMasterService.UpdateState(this.fbstates.value)
    }
    onSubmit() {
        if (this.fbstates.valid) {
            this.saveState().subscribe(resp => {
                if (resp) {
                    this.initStates();
                    this.onClose();
                    this.display = false;
                }
            })
        }
        else {
            // alert("please fill the fields")
            this.fbstates.markAllAsTouched();
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

}


