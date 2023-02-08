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

@Component({
  selector: 'app-village',
  templateUrl: './village.component.html',
  providers: [MessageService, ConfirmationService]
})
export class VillageComponent implements OnInit {
  display: boolean = false;
  villages: VillagesViewDto[] = [];
  village: VillageDto = new VillageDto();
  states: StateDto[] = [];
  loading: boolean = true;
  fbvillages!: FormGroup;
  filter: any;
  submitLabel!: string;
  addFlag: boolean = true;
  divisions: DivisionDto[] = [];
  circles: CircleDto[] = [];
  sections: SectionDto[] = [];
  mandals: MandalDto[] = [];
  district: DistrictDto[] = [];

  constructor(private formbuilder: FormBuilder,
    private geoMasterService: GeoMasterService,
    private commonService: CommonService,
    public jwtService: JWTService,
  ) {

  }
  InitVillage() {
    this.village = new VillageDto();
    this.fbvillages.reset();
    this.submitLabel = "Add Village";
    this.addFlag = true;
    this.display = true;
  }

  get FormControls() {
    return this.fbvillages.controls;
  }

  ngOnInit() {
    this.initVillages();

    this.commonService.GetStates().subscribe((resp) => {
      this.states = resp as unknown as StateDto[]
    })
   

    this.commonService.GetDivision().subscribe((resp) => {
      this.divisions = resp as unknown as DivisionDto[]
    })

    this.fbvillages = this.formbuilder.group({
        divisionId: ['', Validators.required],
        circleId: ['', Validators.required],
        sectionId: ['', Validators.required],
        targetTons: ['', Validators.required],
        stateId: ['', Validators.required],
        districtId: ['', Validators.required],
        mandalId: ['', Validators.required],
        address: ['', Validators.required],
        PinCode:['', Validators.required],
        villageCode: ['', Validators.required],
        villageName: ['', Validators.required],
        inchargeName: ['',],
        inchargePhoneNo: ['',],
        distance: ['', Validators.required],
        divertedDistance: ['', Validators.required],
        noOfEbservices: ['', Validators.required],
        tptRate: ['', Validators.required],
        // circleCode: ['', Validators.required],
        cultivableAcres: ['', Validators.required],
        totalGeographicArea: ['', Validators.required],
        irrigationAcres: ['', Validators.required],
        dryAcres: ['', Validators.required],
        potentialAcres: ['', Validators.required],
        notSuitableAcres: ['', Validators.required],
        listingOrder: ['', Validators.required],
        isActive: [ Validators.required],
    });

  }
  initVillages() {
    this.geoMasterService.GetVillage().subscribe((resp) => {
      this.villages = resp as unknown as VillagesViewDto[]
      this.loading = false;
    })
  }
  initCircles(division:any){
    this.commonService.GetCirclesForDivision(division).subscribe((resp) => {
      this.circles = resp as unknown as CircleDto[]
    })
  }
  initSections(circle:any){
    this.commonService.GetSectionsForCircle(circle).subscribe((resp) => {
      this.sections = resp as unknown as SectionDto[]
    })
  }
  initMandals(district:any){
    debugger
    this.commonService.GetMandalsForDistrict(district).subscribe((resp) => {
      this.mandals = resp as unknown as MandalDto[]
    })
  }
  initDistricts(states:any){
    debugger
    this.commonService.GetDistrictsForState(states).subscribe((resp) => {
      this.district = resp as unknown as DistrictDto[]
    })
  }

  editProduct(village: VillagesViewDto) {
    // this.fbvillages.setValue(this.village);
    this.initCircles(village.divisionId);
    this.fbvillages = this.formbuilder.group({
      code: [village.villageCode, Validators.required],
      name: [village.villageName, Validators.required],
      listingOrder: [village.listingOrder, [Validators.required, Validators.pattern('^[0-9]*$')]],
      address: [village.address, Validators.required],
      circleId: [village.circleId, Validators.required],
      divisionId: [village.divisionId],
      inchargePhoneNo: [village.inchargePhoneNo, [Validators.required, Validators.pattern('^[0-9]*$')]],
      inchargeName:[village.inchargeName],
      isActive: [village.isActive, Validators.required],
      villageId: [village.villageId],
    });
    this.submitLabel = "Update Village";
    this.addFlag = false;
    this.display = true;
  }

  private UpdateForm() {

  }
  onClose() {
    this.fbvillages.reset();
  }

  saveVillage(): Observable<HttpEvent<VillageDto>> {
    if (this.addFlag) return this.geoMasterService.CreateVillage(this.fbvillages.value)
    else return this.geoMasterService.UpdateVillage(this.fbvillages.value)
  }
  onSubmit() {
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
      // alert("please fill the fields")
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

  valSwitch: boolean = true;

}


