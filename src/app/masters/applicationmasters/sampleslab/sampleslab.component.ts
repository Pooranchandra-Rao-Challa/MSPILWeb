import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { SampleSlabDto, SampleslabsViewDto } from 'src/app/_models/applicationmaster';
import { AppMasterService } from 'src/app/_services/appmaster.service';

@Component({
    selector: 'app-sampleslab',
    templateUrl: './sampleslab.component.html',
    providers: [MessageService, ConfirmationService]
})
export class SampleslabsComponent implements OnInit {
    dialog: boolean = false;
    sampleslabs: SampleslabsViewDto[] = [];
    sampleslab: SampleSlabDto = new SampleSlabDto();
    loading: boolean = true;
    fbsampleslabs!: FormGroup;
    filter: any;
    submitLabel!: string;
    addFlag: boolean = true;

    constructor(private formbuilder: FormBuilder,
        private appmasterservice: AppMasterService,
        private commonService: CommonService,
        public jwtService: JWTService,
    ) {

    }
    InitSampleslab() {
        this.sampleslab = new SampleSlabDto();
        this.fbsampleslabs.reset();
        this.fbsampleslabs.patchValue({sampleSlabId: 0})
        this.submitLabel = "Add Sample Slab";
        this.addFlag = true;
        this.dialog = true;
    }

    get FormControls() {
        return this.fbsampleslabs.controls;
    }

    ngOnInit() {

        this.initSampleslabs();
        this.fbsampleslabs = this.formbuilder.group({
            sampleSlabId:  [0],
            toArea: new FormControl('', [Validators.required,Validators.pattern(/^[-+]?[0-9]+\.[0-9]+$/)]),
            fromArea: new FormControl('', [Validators.required, Validators.pattern(/^[-+]?[0-9]+\.[0-9]+$/)]),
            noOfSample: new FormControl('', [Validators.required,  Validators.pattern(/^[0-9]+$/)]),
            isActive: [ Validators.required],
          
        });
    }
    initSampleslabs() {
        this.appmasterservice.GetSampleSlabs().subscribe((resp) => {
            this.sampleslabs = resp as unknown as SampleslabsViewDto[]
            this.loading = false;
        })
    }

    editProduct(sampleslabs: SampleslabsViewDto) {
     
      debugger
        this.sampleslab.toArea = sampleslabs.toArea;
        this.sampleslab.fromArea = sampleslabs.fromArea;
        this.sampleslab.noOfSample = sampleslabs.noOfSample;
        this.sampleslab.isActive = sampleslabs.isActive;
        this.sampleslab.sampleSlabId = sampleslabs.sampleSlabId;
        this.fbsampleslabs.setValue(this.sampleslab);
        this.submitLabel = "Update Sample Slab";
        this.addFlag = false;
        this.dialog = true;
    }

    private UpdateForm() {

    }
    onClose() {
        this.fbsampleslabs.reset();
    }

    saveSampleslab(): Observable<HttpEvent<SampleSlabDto>> {
        if (this.addFlag) return this.appmasterservice.CreateSampleSlab(this.fbsampleslabs.value)
        else return this.appmasterservice.UpdateSampleSlab(this.fbsampleslabs.value)
    }
    onSubmit() {
      console.log(this.fbsampleslabs.valid);
        if (this.fbsampleslabs.valid) {
            this.saveSampleslab().subscribe(resp => {
                if (resp) {
                    this.initSampleslabs();
                    this.onClose();
                    this.dialog = false;
                }
            })
        }
        else {
            // alert("please fill the fields")
            this.fbsampleslabs.markAllAsTouched();
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


