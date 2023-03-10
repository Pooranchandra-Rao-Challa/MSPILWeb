import { MIN_LENGTH_2, MAX_LENGTH_10, MAX_LENGTH_6, RG_ALPHA_ONLY } from './../../../_shared/regex';
import { RG_ALPHA_NUMERIC } from 'src/app/_shared/regex';
import { HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StateDto, StatesViewDto, } from 'src/app/_models/geomodels';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
  providers: [MessageService, ConfirmationService]
})
export class StateComponent implements OnInit {
  display: boolean = false;
  states: StatesViewDto[] = [];
  state: StateDto = new StateDto();
  loading: boolean = true;
  fbstates!: FormGroup;
  @ViewChild('filter') filter!: ElementRef;
  submitLabel!: string;
  addFlag: boolean = true;
  valSwitch: boolean = true;
  mediumDate: string = MEDIUM_DATE;

  constructor(private formbuilder: FormBuilder,
    private geoMasterService: GeoMasterService,
    public jwtService: JWTService,
  ) { }

  InitState() {
    this.state = new StateDto();
    this.submitLabel = "Add State";
    this.addFlag = true;
    this.display = true;
  }

  get FormControls() {
    return this.fbstates.controls;
  }

  ngOnInit() {
    this.initStates();
    this.fbstates = this.formbuilder.group({
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_6)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY)]),
      isActive: true,
      stateId: new FormControl(null),
    });
  }

  initStates() {
    this.geoMasterService.GetState().subscribe((resp) => {
      this.states = resp as unknown as StatesViewDto[]
      this.loading = false;
    })
  }

  editProduct(state: StatesViewDto) {
    this.state.code = state.stateCode;
    this.state.name = state.stateName
    this.state.isActive = state.isActive;
    this.state.stateId = state.stateId;
    this.fbstates.setValue(this.state);
    this.submitLabel = "Update State";
    this.addFlag = false;
    this.display = true;
  }

  onClose() {
    this.fbstates.reset();
  }

  saveState(): Observable<HttpEvent<StateDto>> {
    if (this.addFlag) return this.geoMasterService.CreateState(this.fbstates.value)
    else return this.geoMasterService.UpdateState(this.fbstates.value)
  }

  onSubmit() {
    if (this.fbstates.valid) {
      this.saveState().subscribe(resp => {
        if (resp) {
          this.initStates();
          this.onClose();
          this.display = false;
        }
      })
    }
    else {
      this.fbstates.markAllAsTouched();
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
  }

}


