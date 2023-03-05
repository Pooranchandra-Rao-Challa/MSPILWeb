import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { SampleSlabDto, FarmersViewDto, LookupDetailDto } from 'src/app/_models/applicationmaster';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { VillageDto, VillagesViewDto } from 'src/app/_models/geomodels';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { LookupService } from 'src/app/_services/lookup.service';

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
    villages: VillagesViewDto[] = [];
    village!: VillagesViewDto[];
    casteDetails: LookupDetailDto[] = [];
    divisionName: FormControl = new FormControl();
    circleName: FormControl = new FormControl();
    sectionName: FormControl = new FormControl();
    districtName: FormControl = new FormControl();
    mandalName: FormControl = new FormControl();
    pincode: FormControl = new FormControl();
    address: FormControl = new FormControl();

    onUpload(event: any) {
        for (const file of event.files) {
            this.uploadedFiles.push(file);
        }
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    }

    constructor(private formbuilder: FormBuilder,
        private geoMasterService: GeoMasterService,
        private appmasterservice: AppMasterService,
        private commonService: CommonService,
        private lookupService: LookupService,
        public jwtService: JWTService,
        private messageService: MessageService,
    ) {

    }
    InitFarmer() {
        this.farmer = new SampleSlabDto();
        this.fbfarmers.reset();
        this.fbfarmers.patchValue({ sampleSlabId: 0 })
        this.submitLabel = "Add Farmer";
        this.addFlag = true;
        this.showDialog = true;
    }

    get FormControls() {
        return this.fbfarmers.controls;
    }

    ngOnInit() {
        this.commonService.GetVillages().subscribe((resp) => {
            this.villages = resp as unknown as VillageDto[]
        })
        this.lookupService.Castes().subscribe((resp)=>{
            this.casteDetails = resp as unknown as LookupDetailDto[]
        })
        this.initFarmers();
        this.fbfarmers = this.formbuilder.group({

            farmerId: [''],
            code: [''],
            farmerName: [''],
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
    initVillages(villageId: any) {
        console.log(villageId);
        this.village = this.villages.filter((village: VillageDto) => {
            return village.villageId == villageId;

        })
        console.log(this.village);
        if (this.village.length) {
            this.divisionName.setValue(this.village[0].divisionName);
            this.circleName.setValue(this.village[0].circleName);
            this.sectionName.setValue(this.village[0].sectionName);
            this.districtName.setValue(this.village[0].districtName);
            this.mandalName.setValue(this.village[0].mandalName);
            this.pincode.setValue(this.village[0].pinCode);
            this.address.setValue(this.village[0].address);
        }
    }
    initBank() {
        this.appMasterService.GetBanks().subscribe((resp) => {
          this.banks = resp as unknown as BankViewDto[];
          console.log(this.banks);
          this.loading = false;
        });
      }
    editFarmer(farmers: FarmersViewDto) {
        this.fbfarmers.patchValue(farmers);
        this.addFlag = false;
        this.submitLabel = 'Update Farmers';
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
            this.fbfarmers.setValue({...this.fbfarmers.value, casteId: parseInt(this.fbfarmers.value.casteId, 10)})
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


