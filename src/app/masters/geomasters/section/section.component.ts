import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { CircleDto, CirclesViewDto, DivisionDto, SectionDto, SectionsViewDto, StateDto } from 'src/app/_models/geomodels';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  providers: [MessageService, ConfirmationService]
})
export class SectionComponent implements OnInit {
  display: boolean = false;
  sections: SectionsViewDto[] = [];
  section: SectionDto = new SectionDto();
  states: StateDto[] = [];
  loading: boolean = true;
  fbsections!: FormGroup;
  filter: any;
  submitLabel!: string;
  addFlag: boolean = true;
  divisions: DivisionDto[] = [];
  circles: CircleDto[] = [];

  constructor(private formbuilder: FormBuilder,
    private geoMasterService: GeoMasterService,
    private commonService: CommonService,
    public jwtService: JWTService,
  ) {

  }
  InitSection() {
    this.section = new SectionDto();
    this.fbsections.reset();
    this.submitLabel = "Add Section";
    this.addFlag = true;
    this.display = true;
  }

  get FormControls() {
    return this.fbsections.controls;
  }

  ngOnInit() {
    this.initSections();

    this.commonService.GetStates().subscribe((resp) => {
      this.states = resp as unknown as StateDto[]
    })

    this.commonService.GetDivision().subscribe((resp) => {
      this.divisions = resp as unknown as DivisionDto[]
    })

    this.fbsections = this.formbuilder.group({
      code: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      listingOrder: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      address:new FormControl ('', Validators.required),
      circleId: new FormControl ('', Validators.required),
      divisionId: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      inchargePhoneNo: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      inchargeName: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*')]),
      isActive: [this.valSwitch, Validators.required],
      sectionId: [''],
    });

  }
  initSections() {
    this.geoMasterService.GetSections().subscribe((resp) => {
      this.sections = resp as unknown as SectionsViewDto[]
      this.loading = false;
    })
  }

  initCircles(division:any){
    this.commonService.GetCirclesForDivision(division).subscribe((resp) => {
      this.circles = resp as unknown as CircleDto[]
    })
  }

  editProduct(section: SectionsViewDto) {
    // this.fbsections.setValue(this.section);
    this.initCircles(section.divisionId);
    this.fbsections = this.formbuilder.group({
      code: [section.sectionCode, Validators.required],
      name: [section.sectionName, Validators.required],
      listingOrder: [section.listingOrder, [Validators.required, Validators.pattern('^[0-9]*$')]],
      address: [section.address, Validators.required],
      circleId: [section.circleId, Validators.required],
      divisionId: [section.divisionId],
      inchargePhoneNo: [section.inchargePhoneNo, [Validators.required, Validators.pattern('^[0-9]*$')]],
      inchargeName:[section.inchargeName],
      isActive: [section.isActive, Validators.required],
      sectionId: [section.sectionId],
    });
    this.submitLabel = "Update Section";
    this.addFlag = false;
    this.display = true;
  }

  private UpdateForm() {

  }
  onClose() {
    this.fbsections.reset();
  }

  saveSection(): Observable<HttpEvent<SectionDto>> {
    if (this.addFlag) return this.geoMasterService.CreateSection(this.fbsections.value)
    else return this.geoMasterService.UpdateSection(this.fbsections.value)
  }
  onSubmit() {
    if (this.fbsections.valid) {
      this.saveSection().subscribe(resp => {
        if (resp) {
          this.initSections();
          this.onClose();
          this.display = false;
        }
      })
    }
    else {
      // alert("please fill the fields")
      this.fbsections.markAllAsTouched();
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


