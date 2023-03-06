import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { SampleSlabDto, FarmersViewDto, LookupDetailDto, BankDto, BranchDto, BankViewDto } from 'src/app/_models/applicationmaster';
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
    valSwitch: boolean = true;
    submitLabel!: string;
    banks: BankViewDto[] = [];
    bank: BankDto = new BankDto();
    branches: BranchDto[] = [];
    IFSC?: string;
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

    

    constructor(private formbuilder: FormBuilder,
        private geoMasterService: GeoMasterService,
        private appmasterservice: AppMasterService,
        private commonService: CommonService,
        private lookupService: LookupService,
        public jwtService: JWTService,
        private messageService: MessageService,
    ) {

    }
    ngOnInit() {
        this.initFarmers();
        this. farmerForm();
         this.initcasteDetails();
        this.initGetVillages();
        this.initBanks();
    }
    farmerForm(){
        this.fbfarmers = this.formbuilder.group({
            farmerId: [0],
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
            selfId: [0],
            jfno: [''],
            branchId: [''],
            accountNo: [''],
            totalArea: [''],
            cultivatedArea: [''],
            glcode: [''],
            subGlcode: [''],
            otherCode: [''],
            imageUrl: ['c:/fakepath/file.jpg'],
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
    initcasteDetails(){
        this.lookupService.Castes().subscribe((resp)=>{
            this.casteDetails = resp as unknown as LookupDetailDto[]
        })
    }

    initGetVillages(){
        this.commonService.GetVillages().subscribe((resp) => {
            this.villages = resp as unknown as VillageDto[]
        })
    }
    initFarmers() {
        this.appmasterservice.GetFarmers().subscribe((resp) => {
            this.farmers = resp as unknown as FarmersViewDto[]
            this.loading = false;
        })
    }
    get FormControls() {
        return this.fbfarmers.controls;
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
    InitFarmer() {
        this.farmer = new SampleSlabDto();
        this.fbfarmers.reset();
        this.fbfarmers.patchValue({ sampleSlabId: 0 })
        this.submitLabel = "Add Farmer";
        this.addFlag = true;
        this.farmerForm()
        this.showDialog = true;
    }
    initBanks() {
        this.appmasterservice.GetBanks().subscribe((resp) => {
          this.banks = resp as unknown as BankViewDto[];
        });
      }
//     initBank() {
//     this.appMasterService.GetBanks().subscribe((resp) => {
//       this.banks = resp as unknown as BankViewDto[];
//       console.log(this.banks);
//       this.loading = false;
//     });
//   }
    getBranchByBankId(Id: number) {
    this.appmasterservice.GetBank(Id).subscribe((resp) => {
      if (resp) {
        this.bank = resp as unknown as BankDto;
        this.branches = this.bank.branches as unknown as BranchDto[];
      }
    });
  }
  getIFSCByBranch(Id: number) {
    let branch = this.branches.find((x) => x.branchId == Id);
    if (branch) this.IFSC = branch.ifsc;
    else this.IFSC = '';
  }






    editFarmer(farmers: FarmersViewDto) {
       this.farmerForm();
       this.initVillages(farmers.villageId)
        this.fbfarmers.patchValue(farmers);
        this.fbfarmers.patchValue({

        })
        this.addFlag = false;
        this.submitLabel = 'Update Farmers';
        this.showDialog = true;

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
    onUpload(event: any) {
        for (const file of event.files) {
            this.fbfarmers.patchValue({ imageUrl: file });
            console.log(file);
        }
        console.log(this.uploadedFiles);
        this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    }
    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }
   
    onClose() {
        this.fbfarmers.reset();
    }

    ngOnDestroy() {
        this.farmers = [];
      }

}


