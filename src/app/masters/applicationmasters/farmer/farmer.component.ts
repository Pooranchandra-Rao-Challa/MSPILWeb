import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { SampleSlabDto, FarmersViewDto, LookupDetailDto, BankDto, BranchDto, BankViewDto } from 'src/app/_models/applicationmaster';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { VillageDto, VillagesViewDto } from 'src/app/_models/geomodels';
import { LookupService } from 'src/app/_services/lookup.service';
import { FarmerDto } from 'src/app/_models/applicationmaster';
import { MAX_LENGTH_20, MIN_AADHAAR, MIN_ACCNO, MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY, RG_EMAIL, RG_NUMERIC_ONLY, RG_PANNO, RG_PHONE_NO, RG_ADDRESS } from 'src/app/_shared/regex';
import { MaxLength } from 'src/app/_models/common';
import { ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { AlertMessage } from 'src/app/_alerts/alertMessage';

@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
  providers: []
})
export class FarmerComponent implements OnInit {
  dialog: boolean = false;
  farmers: FarmersViewDto[] = [];
  farmer: FarmerDto = new FarmerDto();
  fbfarmer!: FormGroup;
  @ViewChild('filter') filter!: ElementRef;
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
  permissions: any;
  virtualfarmers: any
  totalRecords: number[] = [];
  slicedDatabase: any;

  constructor(private formbuilder: FormBuilder,
    private appmasterservice: AppMasterService,
    private commonService: CommonService,
    private lookupService: LookupService,
    public jwtService: JWTService,
    private messageService: MessageService,
    private alertMessage: AlertMessage,
  ) { }

  ngOnInit() {
    this.permissions = this.jwtService.Permissions;
    this.initFarmers();
    this.farmerForm();
    this.initcasteDetails();
    this.initGetVillages();
    this.initBanks();
  }

  farmerForm() {
    this.fbfarmer = this.formbuilder.group({
      farmerId: [null],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      aliasName: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      gender: [null, (Validators.required)],
      fatherName: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      casteId: [null, (Validators.required)],
      address: new FormControl('', [Validators.required, Validators.pattern(RG_ADDRESS)]),
      villageId: [null, (Validators.required)],
      phoneNo: new FormControl(null, [Validators.required, Validators.pattern(RG_PHONE_NO)]),
      email: ['', (Validators.pattern(RG_EMAIL))],
      panno: new FormControl(null, [Validators.pattern(RG_PANNO)]),
      aadhaarNo: new FormControl(null, [Validators.required, Validators.pattern(RG_NUMERIC_ONLY), Validators.minLength(MIN_AADHAAR)]),
      oldRyot: new FormControl(null, [Validators.pattern(RG_ALPHA_NUMERIC)]),
      selfId: [null],
      jfno: new FormControl('', [Validators.pattern(RG_NUMERIC_ONLY)]),
      bankId: [null, (Validators.required)],
      branchId: [null, (Validators.required)],
      accountNo: new FormControl(null, [Validators.required, Validators.pattern(RG_NUMERIC_ONLY), Validators.minLength(MIN_ACCNO)]),
      totalArea: [null],
      cultivatedArea: [null],
      glcode: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      subGlcode: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      otherCode: ['', Validators.pattern(RG_ALPHA_NUMERIC)],
      imageUrl: ['c:/fakepath/file.jpg'],
      isRegistered: [null],
      isActive: [null],
    });
  }

  initcasteDetails() {
    this.lookupService.Castes().subscribe((resp) => {
      this.casteDetails = resp as unknown as LookupDetailDto[];
    });
  }

  initGetVillages() {
    this.commonService.GetVillages().subscribe((resp) => {
      this.villages = resp as unknown as VillageDto[];
    });
  }

  initFarmers() {
    this.appmasterservice.GetFarmers().subscribe((resp) => {
      this.farmers = resp as unknown as FarmersViewDto[];
    });
  }

  get FormControls() {
    return this.fbfarmer.controls;
  }

  initVillages(villageId: any) {
    this.village = this.villages.filter((village: VillageDto) => {
      return village.villageId == villageId;
    });
    if (this.village) {
      this.divisionName.setValue(this.village[0].divisionName);
      this.circleName.setValue(this.village[0].circleName);
      this.sectionName.setValue(this.village[0].sectionName);
      this.districtName.setValue(this.village[0].districtName);
      this.mandalName.setValue(this.village[0].mandalName);
      this.pincode.setValue(this.village[0].pinCode);
    }
  }

  addFarmer() {
    this.farmer = new SampleSlabDto();
    this.fbfarmer.patchValue({
      isRegistered: true,
      isActive: true
    });
    this.submitLabel = "Add Farmer";
    this.addFlag = true;
    this.showDialog = true;
  }

  initBanks() {
    this.appmasterservice.GetBanks().subscribe((resp) => {
      this.banks = resp as unknown as BankViewDto[];
    });
  }

  getBranchByBankId(Id: number, edit: boolean = false) {
    this.IFSC = '';
    this.appmasterservice.GetBank(Id).subscribe((resp) => {
      if (resp) {
        this.bank = resp as unknown as BankDto;
        this.branches = this.bank.branches as unknown as BranchDto[];
      }
      if (edit) {
        this.getIFSCByBranch(this.fbfarmer.value.branchId);
      }
    });
  }

  getIFSCByBranch(Id: number) {
    let branch = this.branches.find((x) => x.branchId == Id);
    if (branch) this.IFSC = branch.ifsc;
    else this.IFSC = '';
  }

  editFarmer(farmer: FarmersViewDto) {
    this.getBranchByBankId(farmer.bankId!, true);
    this.initVillages(farmer.villageId);
    this.fbfarmer.controls['casteId'].setValue(farmer.casteId);
    this.fbfarmer.controls['name'].setValue(farmer.farmerName);
    this.fbfarmer.controls['panno'].setValue(farmer.panNo);
    this.fbfarmer.controls['jfno'].setValue(farmer.jfNo);
    this.fbfarmer.controls['glcode'].setValue(farmer.glCode);
    this.fbfarmer.controls['subGlcode'].setValue(farmer.subGLCode);
    this.fbfarmer.patchValue(farmer);
    this.addFlag = false;
    this.submitLabel = 'Update Farmer';
    this.showDialog = true;
  }

  saveFarmer(): Observable<HttpEvent<any>> {
    if (this.addFlag) return this.appmasterservice.CreateFarmer(this.fbfarmer.value)
    else return this.appmasterservice.UpdateFarmer(this.fbfarmer.value)
  }

  onSubmit() {
    if (this.fbfarmer.valid) {
      this.fbfarmer.setValue({ ...this.fbfarmer.value, casteId: parseInt(this.fbfarmer.value.casteId, 10) })
      this.saveFarmer().subscribe(resp => {
        if (resp) {
          this.initFarmers();
          this.onClose();
          this.showDialog = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMAMFA001" : "SMAMFA002"]);
        }
      });
    }
    else {
      this.fbfarmer.markAllAsTouched();
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  onUpload(event: any) {
    for (const file of event.files) {
      this.fbfarmer.patchValue({ imageUrl: file });
    }
    this.messageService.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  onClose() {
    this.fbfarmer.reset();
    this.IFSC = '';
    this.divisionName.setValue(null);
    this.circleName.setValue(null);
    this.sectionName.setValue(null);
    this.districtName.setValue(null);
    this.mandalName.setValue(null);
    this.pincode.setValue(null);
  }

  ngOnDestroy() {
    this.farmers = [];
  }

}


