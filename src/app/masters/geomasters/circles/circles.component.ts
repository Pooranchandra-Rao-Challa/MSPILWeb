import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CirclesViewDto, CircleDto, StateDto, DivisionDto } from 'src/app/_models/geomodels';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';

@Component({
    selector: 'app-circle',
    templateUrl: './circles.component.html',
    providers: [MessageService, ConfirmationService]
})
export class CirclesComponent implements OnInit {

    display: boolean = false;
    circles: CirclesViewDto[] = [];
    circle: CircleDto = new CircleDto();
    states: StateDto[] = [];
    loading: boolean = true;
    fbcircles!: FormGroup;
    filter: any;
    submitLabel!: string;
    addFlag: boolean = true;
    divisions: DivisionDto[] = [];

    constructor(private formbuilder: FormBuilder,
        private geoMasterService: GeoMasterService,
        private commonService: CommonService,
        public jwtService: JWTService,
    ) {

    }
    InitCircle() {
        this.circle = new CircleDto();
        this.fbcircles.reset();
        this.submitLabel = "Add Circle";
        this.addFlag = true;
        this.display = true;
    }

    get FormControls() {
        return this.fbcircles.controls;
    }

    ngOnInit() {

        this.initCircles();

        this.commonService.GetDivision().subscribe((resp) => {
            this.divisions = resp as unknown as DivisionDto[]
        })
        this.fbcircles = this.formbuilder.group({
            divisionId: ['', Validators.required],
            name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
            inchargeName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
            listingOrder: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
            isActive: [ Validators.required],
            code: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
            inchargePhoneNo: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
            address: ['', Validators.required],
            circleId: [''],
        });


    }
    initCircles() {
        this.geoMasterService.GetCircles().subscribe((resp) => {
            this.circles = resp as unknown as CirclesViewDto[]
            this.loading = false;
        })
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

        // this.circle.circleId = circle.circleId
        // this.circle.stateId = circle.stateId;
        this.fbcircles.setValue(this.circle);
        this.submitLabel = "Update Circle";
        this.addFlag = false;
        this.display = true;
    }

    private UpdateForm() {

    }
    onClose() {
        this.fbcircles.reset();
    }

    saveCircle(): Observable<HttpEvent<CircleDto>> {
        if (this.addFlag) return this.geoMasterService.CreateCircle(this.fbcircles.value)
        else return this.geoMasterService.UpdateCircle(this.fbcircles.value)
    }
    onSubmit() {
        if (this.fbcircles.valid) {
            this.saveCircle().subscribe(resp => {
                if (resp) {
                    this.initCircles();
                    this.onClose();
                    this.display = false;
                }
            })
        }
        else {
            // alert("please fill the fields")
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


    valSwitch: boolean = true;

}


