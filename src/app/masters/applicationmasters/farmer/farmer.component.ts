import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { SampleSlabDto, FarmersViewDto } from 'src/app/_models/applicationmaster';
import { AppMasterService } from 'src/app/_services/appmaster.service';

@Component({
    selector: 'app-farmer',
    templateUrl: './farmer.component.html',
    providers: [MessageService, ConfirmationService]
})
export class FarmerComponent implements OnInit {
    dialog: boolean = false;
    farmers: FarmersViewDto[] = [];
    farmer: SampleSlabDto = new SampleSlabDto();
    loading: boolean = true;
    fbfarmers!: FormGroup;
    filter: any;
    submitLabel!: string;
    addFlag: boolean = true;
    showDialog: boolean = false;
    uploadedFiles: any[] = [];

   

    onUpload(event: any) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    }

   

    constructor(private formbuilder: FormBuilder,
        private appmasterservice: AppMasterService,
        private commonService: CommonService,
        public jwtService: JWTService,
        private messageService: MessageService,
    ) {

    }
    InitFarmer() {
        this.farmer = new SampleSlabDto();
        this.fbfarmers.reset();
        this.fbfarmers.patchValue({sampleSlabId: 0})
        this.submitLabel = "Add Farmer";
        this.addFlag = true;
        this.showDialog = true;
    }

    get FormControls() {
        return this.fbfarmers.controls;
    }

    ngOnInit() {

        this.initFarmers();
        this.fbfarmers = this.formbuilder.group({
         
          farmerId: [''],
          code: [''],
          name: [''],
          aliasName: [''],
          gender: [''],
          fatherName: [''],
          casteId: [''],
          address: [''],
          villageId: [''],
          phoneNo: [''],
          email: [''],
          panno: [''],
          aadhaarNo: [''],
          oldRyot: [''],
          selfId: [''],
          jfno: [''],
          branchId: [''],
          accountNo: [''],
          totalArea: [''],
          cultivatedArea: [''],
          glcode: [''],
          subGlcode: [''],
          otherCode: [''],
          imageUrl: [''],
          isRegistered: [''],
          isActive: [''],
            // sampleSlabId:  [0],
            // villageId: [''],
            // sectionId: ['', Validators.required],
            // targetArea: ['', Validators.required],
            // mandalId: ['', Validators.required],
            // address: ['', Validators.required],
            // pinCode: ['', Validators.required],
            // code: ['', Validators.required],
            // name: ['', Validators.required],
            // inchargeName: ['',],
            // inchargePhoneNo: ['',],
            // distance: ['', Validators.required],
            // divertedDistance: ['', Validators.required],
            // noOfEbservices: ['', Validators.required],
            // tptrate: ['', Validators.required],
            // cultivableArea: ['', Validators.required],
            // totalArea: ['', Validators.required],
            // irrigationArea: ['', Validators.required],
            // dryArea: ['', Validators.required],
            // potentialArea: ['', Validators.required],
            // notSuitableArea: ['', Validators.required],
            // listingOrder: ['', Validators.required],
            // isActive: [Validators.required],
          
        });
    }
    initFarmers() {
        this.appmasterservice.GetFarmers().subscribe((resp) => {
            this.farmers = resp as unknown as FarmersViewDto[]
            this.loading = false;
        })
    }

    editFarmer(farmers: FarmersViewDto) {
        this.fbfarmers.patchValue(farmers);
        this.addFlag = false;
        this.submitLabel = 'Update Season';
        this.showDialog = true;

    }

    onClose() {
        this.fbfarmers.reset();
    }

    saveFarmer(): Observable<HttpEvent<SampleSlabDto>> {
        if (this.addFlag) return this.appmasterservice.CreateFarmer(this.fbfarmers.value)
        else return this.appmasterservice.UpdateFarmer(this.fbfarmers.value)
    }
    onSubmit() {
      console.log(this.fbfarmers.valid);
        if (this.fbfarmers.valid) {
            this.saveFarmer().subscribe(resp => {
                if (resp) {
                    this.initFarmers();
                    this.onClose();
                    this.showDialog = false;
                }
            })
        }
        else {
            // alert("please fill the fields")
            this.fbfarmers.markAllAsTouched();
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


