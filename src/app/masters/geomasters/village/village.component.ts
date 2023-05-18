import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  CircleDto,
  DivisionDto,
  VillageDto,
  VillagesViewDto,
  StateDto,
  SectionDto,
  DistrictDto,
  MandalDto,
} from 'src/app/_models/geomodels';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import {
  MAX_LENGTH_20,
  MIN_LENGTH_2,
  RG_ADDRESS,
  RG_ALPHA_NUMERIC,
  RG_ALPHA_ONLY,
  RG_PHONE_NO,
  RG_PINCODE,
} from 'src/app/_shared/regex';
import { MaxLength } from 'src/app/_models/common';
import { ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { AlertMessage } from 'src/app/_alerts/alertMessage';
@Component({
  selector: 'app-village',
  templateUrl: './village.component.html',
  providers: [],
})
export class VillageComponent implements OnInit {
  display: boolean = false;
  villages: VillagesViewDto[] = [];
  village: VillageDto = {};
  selectedVillage: VillagesViewDto = {};
  states: StateDto[] = [];
  fbvillages!: FormGroup;
  @ViewChild('filter') filter!: ElementRef;
  submitLabel!: string;
  addFlag: boolean = true;
  divisions: DivisionDto[] = [];
  circles: CircleDto[] = [];
  sections: SectionDto[] = [];
  mandals: MandalDto[] = [];
  districts: DistrictDto[] = [];
  mediumDate: string = MEDIUM_DATE;
  maxLength: MaxLength = new MaxLength();
  permissions: any;
  stateId:any;
  constructor(
    private formbuilder: FormBuilder,
    private geoMasterService: GeoMasterService,
    private commonService: CommonService,
    public jwtService: JWTService,
    private alertMessage: AlertMessage
  ) { }

  InitVillage(village: VillagesViewDto) {
    this.fbvillages.controls['isActive'].setValue(true);
    this.village = new VillageDto();
    this.selectedVillage = village;
    this.clearParents();
    if (village.villageId) {
      this.initCircles(village.divisionId);
      this.initSections(village.circleId);
      this.initMandals(village.districtId);
      this.initDivisions();
     this.initDistricts(village.stateId);

      this.village.villageId = village.villageId;
      this.village.code = village.villageCode;
      this.village.name = village.villageName;
      this.village.sectionId = village.sectionId;
      this.village.circleId = village.circleId;
      this.village.divisionId = village.divisionId;
      this.village.mandalId = village.mandalId;
      this.village.districtId = village.districtId;
      this.village.stateId = village.stateId;
      this.village.address = village.address;
      this.village.distance = village.distance;
      this.village.cultivableArea = village.cultivableArea;
      this.village.divertedDistance = village.divertedDistance;
      this.village.dryArea = village.dryArea;
      this.village.inchargeName = village.inchargeName;
      this.village.inchargePhoneNo = village.inchargePhoneNo;
      this.village.irrigationArea = village.irrigationArea;
      this.village.isActive = village.isActive;
      this.village.listingOrder = village.listingOrder;
      this.village.noOfEbservices = village.noOfEBServices;
      this.village.notSuitableArea = village.notSuitableArea;
      this.village.pinCode = village.pinCode;
      this.village.potentialArea = village.potentialArea;
      this.village.targetArea = village.targetArea;
      this.village.totalArea = village.totalArea;
      this.village.tptrate = village.tptRate;
      // this.village.targetArea = 0;
      this.fbvillages.setValue(this.village);
      this.fbvillages.patchValue({
        stateId: village.stateId?.toString()
      });
      this.submitLabel = 'Update Village';
      this.addFlag = false;
    } else {
      this.submitLabel = 'Add Village';
      this.addFlag = true;
    }
    this.display = true;
  }

  clearParents() {
    this.districts = [];
    this.mandals = [];
    this.circles = [];
    this.sections = [];
  }
  get FormControls() {
    return this.fbvillages.controls;
  }

  ngOnInit() {
    this.permissions = this.jwtService.Permissions;
    this.initVillages();
    this.initState();
    this.initDivisions();
    this.sections = [] as SectionDto[];
  
    this.fbvillages = this.formbuilder.group({
      villageId: [null],
      divisionId: [null, Validators.required],
      circleId: [null, Validators.required],
      sectionId: [null, Validators.required],
      targetArea: [null, Validators.required],
      mandalId: [null, Validators.required],
      districtId: [null, Validators.required],
      stateId: [null, Validators.required],
      address: new FormControl('', [Validators.pattern(RG_ADDRESS)]),
      pinCode: new FormControl('',  [Validators.pattern(RG_PINCODE)]),
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      inchargeName: new FormControl('', [Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      inchargePhoneNo: ['', Validators.pattern(RG_PHONE_NO)],
      distance: [null, Validators.required],
      divertedDistance: [null, Validators.required],
      noOfEbservices: [null, Validators.required],
      tptrate: [null, Validators.required],
      cultivableArea: [null, Validators.required],
      totalArea: [null, Validators.required],
      irrigationArea: [null, Validators.required],
      dryArea: [null, Validators.required],
      potentialArea: [null, Validators.required],
      notSuitableArea: [null, Validators.required],
      listingOrder: [null, Validators.required],
      isActive: [null],
    });
  }
 
  initState(){
    this.commonService.GetStates().subscribe((resp) => {
      this.states = resp as unknown as StateDto[];
    });

  }
  initDistricts(stateId: any) {
    this.mandals = [];
    this.divisions = [];
    this.circles = [];
    this.sections = [];
    this.commonService.GetDistrictsForState(stateId).subscribe((resp) => {
      this.districts = resp as unknown as DistrictDto[];
      console.log( this.districts);
      
    });
  }
  initVillages() {
    this.geoMasterService.GetVillage().subscribe((resp) => {
      this.villages = resp as unknown as VillagesViewDto[];
      console.log(this.villages);

    });
  }

  initCircles(division: any) {
    this.sections = [];
    this.commonService.GetCirclesForDivision(division).subscribe((resp) => {
      this.circles = resp as unknown as CircleDto[];
    });
  }

  initSections(circleId: any) {
    this.commonService.GetSectionsForCircle(circleId).subscribe((resp) => {
      this.sections = resp as unknown as SectionDto[];
    });
  }

  initMandals(district: any) {
    this.circles = [];
    this.sections = [];
    this.commonService.GetMandalsForDistrict(district).subscribe((resp) => {
      this.mandals = resp as unknown as MandalDto[];
    });
  }

  initDivisions(){
    this.circles = [];
    this.sections = [];
    this.commonService.GetDivision().subscribe((resp) => {
      this.divisions = resp as unknown as DivisionDto[];
      console.log(this.divisions)
    });
  }


  onClose() {
    this.fbvillages.reset();
  }

  saveVillage(): Observable<HttpEvent<VillageDto>> {
    if (this.addFlag)
      return this.geoMasterService.CreateVillage(this.fbvillages.value);
    else return this.geoMasterService.UpdateVillage(this.fbvillages.value);
  }

  onSubmit() {
    this.fbvillages.value.pinCode = this.fbvillages.value.pinCode + '';
    this.fbvillages.value.inchargePhoneNo =
      this.fbvillages.value.inchargePhoneNo + '';
    if (this.fbvillages.valid) {
      this.saveVillage().subscribe((resp) => {
        if (resp) {
          this.initVillages();
          this.onClose();
          this.display = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMMGMVI001" : "SMMGMVI002"]);
        }
      });
    } else {
      this.fbvillages.markAllAsTouched();
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  ngOnDestroy() {
    this.states = [];
    this.divisions = [];
    this.villages = [];
    this.circles = [];
    this.sections = [];
    this.mandals = [];
    this.districts = [];
  }
}

