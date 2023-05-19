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
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { ITableHeader } from 'src/app/_models/common';

@Component({
  selector: 'app-state',
  templateUrl: './state.component.html',
})
export class StateComponent implements OnInit {
  globalFilterFields: string[] = ['stateCode', 'stateName', 'isActive', 'createdAt', 'createdBy', 'updatedAt', 'updatedBy'];
  display: boolean = false;
  states: StatesViewDto[] = [];
  state: StateDto = new StateDto();
  fbstates!: FormGroup;
  @ViewChild('filter') filter!: ElementRef;
  submitLabel!: string;
  addFlag: boolean = true;
  valSwitch: boolean = true;
  mediumDate: string = MEDIUM_DATE;
  permissions: any;

  headers: ITableHeader[] = [
    { field: 'stateCode', header: 'stateCode', label: 'Code' },
    { field: 'stateName', header: 'stateName', label: 'Name' },
    { field: 'isActive', header: 'isActive', label: 'Is Active' },
    { field: 'createdAt', header: 'createdAt', label: 'Created Date' },
    { field: 'createdBy', header: 'createdBy', label: 'Created By' },
    { field: 'updatedAt', header: 'updatedAt', label: 'Updated Date' },
    { field: 'updatedBy', header: 'updatedBy', label: 'Updated By' },
  ];
  constructor(private formbuilder: FormBuilder,
    private geoMasterService: GeoMasterService,
    public jwtService: JWTService,
    private alertMessage: AlertMessage) { }

  InitState() {
    this.state = new StateDto();
    this.fbstates.controls['isActive'].setValue(true);
    this.submitLabel = "Add State";
    this.addFlag = true;
    this.display = true;
  }

  get FormControls() {
    return this.fbstates.controls;
  }

  ngOnInit() {
    this.permissions = this.jwtService.Permissions;
    this.initStates();
    this.fbstates = this.formbuilder.group({
      code: new FormControl(null, [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_6)]),
      name: new FormControl(null, [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      isActive: [null],
      stateId: new FormControl(null),
    });
  }

  initStates() {
    this.geoMasterService.GetState().subscribe((resp) => {
      this.states = resp as unknown as StatesViewDto[]
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
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMGMST001" : "SMGMST002"]);
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


