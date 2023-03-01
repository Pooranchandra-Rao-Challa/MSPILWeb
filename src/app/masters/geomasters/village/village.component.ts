import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CircleDto, CirclesViewDto, DivisionDto, VillageDto, VillagesViewDto, StateDto, SectionDto, DistrictDto, MandalDto } from 'src/app/_models/geomodels';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { MAX_LENGTH_6, MIN_LENGTH_2, RG_ALPHA_NUMERIC, RG_ALPHA_ONLY, RG_PHONE_NO } from 'src/app/_shared/regex';

@Component({
  selector: 'app-village',
  templateUrl: './village.component.html',
  providers: [MessageService, ConfirmationService]
})
export class VillageComponent implements OnInit {
  display: boolean = false;
  villages: VillagesViewDto[] = [];
  village: VillageDto = {};
  selectedVillage: VillagesViewDto = {};
  states: StateDto[] = [];
  loading: boolean = true;
  fbvillages!: FormGroup;
  @ViewChild('filter') filter!: ElementRef;
  submitLabel!: string;
  addFlag: boolean = true;
  divisions: DivisionDto[] = [];
  circles: CircleDto[] = [];
  sections: SectionDto[] = [];
  mandals: MandalDto[] = [];
  districts: DistrictDto[] = [];
  valSwitch: boolean = false;
  mediumDate: string = MEDIUM_DATE;

  constructor(private formbuilder: FormBuilder,
    private geoMasterService: GeoMasterService,
    private commonService: CommonService,
    public jwtService: JWTService,
  ) { }

  InitVillage(village: VillagesViewDto) {
    this.fbvillages.reset();
    this.village = new VillageDto();
    this.selectedVillage = village;
    this.clearParents();
    if (village.villageId) {
      this.initCircles(village.divisionId);
      this.initSections(village.circleId);
      this.initDistricts(village.stateId);
      this.initMandals(village.districtId);
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
      this.village.noOfEbservices = village.noOfEbservices;
      this.village.notSuitableArea = village.notSuitableArea;
      this.village.pinCode = village.pinCode;
      this.village.potentialArea = village.potentialArea;
      this.village.targetArea = village.targetArea;
      this.village.totalArea = village.totalArea;
      this.village.tptrate = village.tptRate;
      this.village.targetArea = 0

      this.fbvillages.setValue(this.village);
      this.submitLabel = "Update Village";
      this.addFlag = false;
    } else {
      this.submitLabel = "Add Village";
      this.addFlag = true;
    }
    this.display = true;
  }

  clearParents() {
    //this.states = [];
    this.districts = [];
    this.mandals = [];
    // this.divisions = [];
    this.circles = [];
    this.sections = []
  }

  get FormControls() {
    return this.fbvillages.controls;
  }

  ngOnInit() {
    this.initVillages();
    this.sections = [] as SectionDto[];

    this.commonService.GetStates().subscribe((resp) => {
      this.states = resp as unknown as StateDto[]
    })

    this.commonService.GetDivision().subscribe((resp) => {
      this.divisions = resp as unknown as DivisionDto[]
    })

    this.fbvillages = this.formbuilder.group({
      villageId: [''],
      divisionId: ['', Validators.required],
      circleId: ['', Validators.required],
      sectionId: ['', Validators.required],
      targetArea: ['', Validators.required],
      mandalId: ['', Validators.required],
      districtId: ['', Validators.required],
      stateId: ['', Validators.required],
      address: ['', Validators.required],
      pinCode: ['', Validators.required],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_6)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY)]),
      inchargeName: ['', Validators.pattern(RG_ALPHA_ONLY)],
      inchargePhoneNo: ['', Validators.pattern(RG_PHONE_NO)],
      distance: ['', Validators.required],
      divertedDistance: ['', Validators.required],
      noOfEbservices: ['', Validators.required],
      tptrate: ['', Validators.required],
      cultivableArea: ['', Validators.required],
      totalArea: ['', Validators.required],
      irrigationArea: ['', Validators.required],
      dryArea: ['', Validators.required],
      potentialArea: ['', Validators.required],
      notSuitableArea: ['', Validators.required],
      listingOrder: ['', Validators.required],
      isActive: [''],
    });

  }

  initVillages() {
    this.geoMasterService.GetVillage().subscribe((resp) => {
      this.villages = resp as unknown as VillagesViewDto[]
      this.loading = false;
    })
  }

  initCircles(division: any) {
    this.commonService.GetCirclesForDivision(division).subscribe((resp) => {
      this.circles = resp as unknown as CircleDto[]
    })
  }

  initSections(circleId: any) {
    this.commonService.GetSectionsForCircle(circleId).subscribe((resp) => {
      this.sections = resp as unknown as SectionDto[]
    })
  }

  initMandals(district: any) {
    this.commonService.GetMandalsForDistrict(district).subscribe((resp) => {
      this.mandals = resp as unknown as MandalDto[]
    })
  }

  initDistricts(states: any) {
    this.commonService.GetDistrictsForState(states).subscribe((resp) => {
      this.districts = resp as unknown as DistrictDto[]
    })
  }

  onClose() {
    this.fbvillages.reset();
  }

  saveVillage(): Observable<HttpEvent<VillageDto>> {
    if (this.addFlag) return this.geoMasterService.CreateVillage(this.fbvillages.value)
    else return this.geoMasterService.UpdateVillage(this.fbvillages.value)
  }
  onSubmit() {
    this.fbvillages.value.pinCode = this.fbvillages.value.pinCode + "";
    this.fbvillages.value.inchargePhoneNo = this.fbvillages.value.inchargePhoneNo + "";
    if (this.fbvillages.valid) {
      this.saveVillage().subscribe(resp => {
        if (resp) {
          this.initVillages();
          this.onClose();
          this.display = false;
        }
      })
    }
    else {
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


