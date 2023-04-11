import { HttpEvent, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService, } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { SampleSlabDto, FarmersViewDto, LookupDetailDto, BankDto, BranchDto, BankViewDto } from 'src/app/_models/applicationmaster';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { VillageDto, VillagesViewDto } from 'src/app/_models/geomodels';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { FarmerDto } from '../../../_models/applicationmaster';
import { MAX_LENGTH_20, MIN_AADHAAR, MIN_ACCNO, MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY, RG_EMAIL, RG_NUMERIC_ONLY, RG_PANNO, RG_PHONE_NO } from 'src/app/_shared/regex';
import { MaxLength } from 'src/app/_models/common';
import { ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { AlertMessage } from '../../../_alerts/alertMessage';
import { LazyLoadEvent } from 'primeng/api';



@Component({
    selector: 'app-farmer',
    templateUrl: './farmer.component.html',
    providers: [MessageService, ConfirmationService]
})
export class FarmerComponent implements OnInit {
    dialog: boolean = false;
    farmers: FarmersViewDto[] = [];
    farmer: FarmerDto = new FarmerDto();
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
    maxLength: MaxLength = new MaxLength();
    permissions:any;
    virtualfarmers:any
    totalRecords: number[]=[];
    slicedDatabase:any


    

    constructor(private formbuilder: FormBuilder,
        private appmasterservice: AppMasterService,
        private commonService: CommonService,
        private lookupService: LookupService,
        public jwtService: JWTService,
        private messageService: MessageService,
        private alertMessage:AlertMessage,
       
    ) {

    }
    ngOnInit() {
        this.permissions = this.jwtService.Permissions;
        this.initFarmers();
        this. farmerForm();
         this.initcasteDetails();
        this.initGetVillages();
        this.initBanks(); 
    }
    farmerForm(){
        this.fbfarmers = this.formbuilder.group({
            farmerId: [null],
            code:new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
            name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
            aliasName: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
            gender:  ['', (Validators.required)],
            fatherName: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
            casteId: ['', (Validators.required)],
            address:['', (Validators.required)],
            villageId:  ['', (Validators.required)],
            phoneNo:  ['', Validators.pattern(RG_PHONE_NO)],
            email:['', (Validators.pattern(RG_EMAIL))],
            panno: new FormControl('', [ Validators.pattern(RG_PANNO)]),
            aadhaarNo: new FormControl('', [Validators.required, Validators.pattern(RG_NUMERIC_ONLY), Validators.minLength(MIN_AADHAAR)]),
            oldRyot:  new FormControl('', [Validators.required, Validators.pattern(RG_NUMERIC_ONLY)]),
            selfId: [null],
            divisionName:[''],
            jfno: new FormControl('', [Validators.required, Validators.pattern(RG_NUMERIC_ONLY)]),
            branchId: ['', (Validators.required)],
            accountNo: new FormControl('', [Validators.required, Validators.pattern(RG_NUMERIC_ONLY), Validators.minLength(MIN_ACCNO)]),
            totalArea: ['', (Validators.required)],
            cultivatedArea: ['', (Validators.required)],
            glcode: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
            subGlcode:  ['', Validators.pattern(RG_ALPHA_NUMERIC)],
            otherCode: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
            imageUrl: ['c:/fakepath/file.jpg'],
            isRegistered: [true],
            isActive: [true],
            
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
            console.log(this.villages)
        })
    }
    initFarmers() {
        this.appmasterservice.GetFarmers().subscribe((resp) => {
            this.farmers = resp as unknown as FarmersViewDto[]
        })
    }
    // loadCarsLazy(event: LazyLoadEvent) {
    //     //simulate remote connection with a timeout
    //     setTimeout(() => {
    //       //load data of required page
    //       let loadedfarmers = this.farmers.slice(event.first, event.first! + event.rows!);
    
    //       //populate page of virtual cars
    //       Array.prototype.splice.apply(this.virtualfarmers, [
    //         ...[event.first!, event.rows], ...loadedfarmers
    //       ]);
    
    //       //trigger change detection
    //       this.virtualfarmers = [...this.virtualfarmers];
    //     }, Math.random() * 1000 + 250);
    //   }

    get FormControls() {
        return this.fbfarmers.controls;
    }
    initVillages(villageId: any) {
        console.log(villageId);
        this.village = this.villages.filter((village: VillageDto) => {
            return village.villageId == villageId;

        })
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
        this.addFlag = false;
        this.submitLabel = 'Update Farmers';
        this.showDialog = true;
    } 
    saveFarmer(): Observable<HttpEvent<any>> {
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
                    this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMAMFA001" : "SMAMFA002"]);
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


