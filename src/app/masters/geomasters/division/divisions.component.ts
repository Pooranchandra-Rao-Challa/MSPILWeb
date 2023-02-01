import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CirclesViewDto, DistrictDto, DistrictViewDto, DivisionDto, DivisonsViewDto, StateDto } from 'src/app/_models/geomodels';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { Observable } from 'rxjs';
import { HttpEvent } from '@angular/common/http';

@Component({
    selector: 'app-division',
    templateUrl: './divisions.component.html',
    providers: [MessageService, ConfirmationService]
})
export class DivisionsComponent implements OnInit {

    display: boolean = false;
    divisions: DivisonsViewDto[] = [];
    //for View you need to change this 
    division: DivisionDto = new DivisionDto();
    states: StateDto[] = [];
    loading: boolean = true;
    fbdivisions!: FormGroup;
    filter: any;
    submitLabel!: string;
    addFlag: boolean = true;

    constructor(private formbuilder: FormBuilder,
        private geoMasterService: GeoMasterService,
        private commonService: CommonService,
        public jwtService: JWTService,
    ) {

    }
    InitDivision() {
        this.division = new DivisionDto();
        this.fbdivisions.reset();
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
        })
        this.fbdivisions = this.formbuilder.group({
            divisionId: [null],
            code: ['', (Validators.required)],
            inchargeName: ['',],
            listingOrder: ['', (Validators.required)],
            name: ['', (Validators.required)],
            inchargePhoneNo: ['',],
            address: ['', (Validators.required)],
            isActive: true
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
        // this.district.districtId = district.districtId
        // this.district.stateId = district.stateId;
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
            // alert("please fill the fields")
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


    valSwitch: boolean = true;

}


