import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CircleDto, CirclesViewDto, DivisionDto, VillageDto, VillagesViewDto, StateDto, SectionDto, DistrictDto, MandalDto } from 'src/app/_models/geomodels';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';

@Component({
  selector: 'app-farmer',
  templateUrl: './farmer.component.html',
  styles: [
  ]
})
export class FarmerComponent implements OnInit {
onBasicUploadAuto($event: any) {
throw new Error('Method not implemented.');
}

  display: boolean = false;
  villages: VillagesViewDto[] = [];
  village: VillageDto ={};
  selectedVillage: VillagesViewDto={};
  states: StateDto[] = [];
  loading: boolean = false;
  fbvillages!: FormGroup;
  filter: any;
  submitLabel!: string;
  addFlag: boolean = true;
  divisions: DivisionDto[] = [];
  circles: CircleDto[] = [];
  sections: SectionDto[] = [];
  mandals: MandalDto[] = [];
  districts: DistrictDto[] = [];
  valSwitch: boolean = true;
  uploadedFiles: any[] = [];
  city: string | undefined;
  selectedCategory: any = null;

  constructor(private formbuilder: FormBuilder,
    private geoMasterService: GeoMasterService,
    private commonService: CommonService,
    public jwtService: JWTService,) {}


  InitVillage(village: VillagesViewDto) {
    this.fbvillages.reset();
    this.village = new VillageDto();
    this.selectedVillage = village;
    this.clearParents();
    if(village.villageId){
   
      this.fbvillages.setValue(this.village);
      this.submitLabel = "Update Village";
      this.addFlag = false;
     
    }else{
      this.submitLabel = "Add Village";
      this.addFlag = true;
    }
    this.display = true;
  }
  

  clearParents(){
    //this.states = [];
    this.districts = [];
    this.mandals = [];
   // this.divisions = [];
    this.circles = [];
    this.sections =[]
  }

  get FormControls() {
    return this.fbvillages.controls;
  }

  categories: any[] = [{name: 'Accounting', key: 'A'}, {name: 'Marketing', key: 'M'},
                       {name: 'Production', key: 'P'}, {name: 'Research', key: 'R'}];

  ngOnInit() {

    this.selectedCategory = this.categories[1];

    this.sections = [] as SectionDto[];

    this.commonService.GetStates().subscribe((resp) => {
      this.states = resp as unknown as StateDto[]
    })


    this.commonService.GetDivision().subscribe((resp) => {
      this.divisions = resp as unknown as DivisionDto[]
    })

    this.fbvillages = this.formbuilder.group({
      villageId: [''],
      sectionId: ['', Validators.required],
      targetArea: ['', Validators.required],
      mandalId: ['', Validators.required],
      address: ['', Validators.required],
      pinCode: ['', Validators.required],
      code: ['', Validators.required],
      name: ['', Validators.required],
      inchargeName: ['',],
      inchargePhoneNo: ['',],
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
      isActive: [Validators.required],
    });

  }
 
  onClose() {
    this.fbvillages.reset();
  }

  // saveVillage(): Observable<HttpEvent<VillageDto>> {
  //   if (this.addFlag) return this.geoMasterService.CreateVillage(this.fbvillages.value)
  //   else return this.geoMasterService.UpdateVillage(this.fbvillages.value)
  // }
  
  onSubmit() {
    // if (this.fbvillages.valid) {
    //   this.saveVillage().subscribe(resp => {
    //     if (resp) {
    
    //       this.onClose();
    //       this.display = false;
    //     }
    //   })
    // }
    // else {
    //   // alert("please fill the fields")
    //   this.fbvillages.markAllAsTouched();
    // }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }
    onUpload(event: { files: any; }) {
        for(let file of event.files) {
            this.uploadedFiles.push(file);
        }

       
    }


    

    

}
