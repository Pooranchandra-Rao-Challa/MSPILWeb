import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OverlayPanel } from 'primeng/overlaypanel';
import { Table } from 'primeng/table';
import { LookupDetailDto, SeasonDto, SeasonViewDto } from 'src/app/_models/applicationmaster';
import { ProppingDto, IProppingViewDto } from 'src/app/_models/monitoring';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { MonitoringService } from 'src/app/_services/monitoring.service';
import { CURRENT_SEASON } from 'src/environments/environment';
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { FORMAT_DATE } from 'src/app/_helpers/date.format.pipe';

export interface IHeader {
  field: string;
  header: string;
  label: string;
}

@Component({
  selector: 'propping',
  templateUrl: './propping.component.html',
  styles: [],
})
export class ProppingComponent implements OnInit {
  currentSeason: SeasonDto = {};
  seasons: SeasonViewDto[] = [];
  forapproval: boolean = false;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild('opPropping') opPropping!: OverlayPanel;
  fbPropping!: FormGroup;
  proppingStages: LookupDetailDto[] = [];
  proppings: IProppingViewDto[] = [];
  propping: ProppingDto = {};
  permissions: any;

  headers: IHeader[] = [
    { field: 'plotNumber', header: 'plotNumber', label: 'Plot No' },
    { field: 'farmerCode', header: 'farmerCode', label: 'Farmer Code' },
    { field: 'farmerName', header: 'farmerName', label: 'Farmer Name' },
    { field: 'divisionName', header: 'divisionName', label: 'Division Name' },
    { field: 'circleName', header: 'circleName', label: 'Circle Name' },
    { field: 'sectionName', header: 'sectionName', label: 'Section Name' },
    { field: 'villageName', header: 'villageName', label: 'Village Name' },
    { field: 'varietyName', header: 'varietyName', label: 'Variety Name' },
    { field: 'plantTypeName', header: 'plantTypeName', label: 'Plant Type' },
    { field: 'plantingDate', header: 'plantingDate', label: 'Planting Date' },
    { field: 'netArea', header: 'netArea', label: 'Net Area' },
    { field: 'proppingDate', header: 'proppingDate', label: 'Propping Date' },
  ];

  constructor(private appMasterService: AppMasterService,
    private jwtService: JWTService,
    private formbuilder: FormBuilder,
    private monitoringService: MonitoringService,
    private lookupService: LookupService,
    private alertMessage: AlertMessage,) {
  }

  ngOnInit(): void {
    this.permissions = this.jwtService.Permissions;
    this.initSeasons();
    this.initCurrentSeason(CURRENT_SEASON());
    this.initProppingStages();
    this.proppingForm();
  }

  initSeasons() {
    this.appMasterService.Getseason().subscribe((resp) => {
      this.seasons = resp as unknown as SeasonViewDto[];
    });
  }

  initCurrentSeason(seasonCode: string) {
    this.appMasterService.CurrentSeason(seasonCode).subscribe((resp) => {
      this.currentSeason = resp as SeasonDto;
    });
  }

  initProppings(seasonId: number, stageId: number) {
    let param1 = this.filter.nativeElement.value == "" ? null : this.filter.nativeElement.value;
    this.monitoringService.GetProppings(seasonId, stageId, param1).subscribe((resp) => {
      this.proppings = resp as unknown as IProppingViewDto[];
    });
  }

  initProppingStages() {
    this.lookupService.ProppingStages().subscribe((resp) => {
      this.proppingStages = resp as unknown as LookupDetailDto[];
      if (this.proppingStages) this.initProppings(this.currentSeason.seasonId!, this.proppingStages[0].lookupDetailId!);
    });
  }

  proppingForm() {
    this.fbPropping = this.formbuilder.group({
      plotProppingId: [null],
      plotId: [null],
      proppingStageId: [null],
      proppingDate: [null, (Validators.required)]
    });
  }

  get FormControls() {
    return this.fbPropping.controls;
  }

  onSelectionSeason(seasonId: number) {
    this.initProppings(seasonId, this.fbPropping.controls['proppingStageId'].value);
  }

  onProppingStage(proppingStageId: number) {
    this.initProppings(this.currentSeason.seasonId!, proppingStageId);
  }

  onSearch() {
    this.initProppings(this.currentSeason.seasonId!, this.fbPropping.controls['proppingStageId'].value);
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
    this.onSearch();
  }

  editPropping(event: Event, propping: IProppingViewDto) {
    this.fbPropping.patchValue(propping);
    this.fbPropping.controls['proppingDate'].setValue(propping.proppingDate && new Date(propping.proppingDate?.toString() + ""));
    this.opPropping.toggle(event);
  }

  onSubmit() {
    if (this.fbPropping.valid) {
      this.fbPropping.value.proppingDate = FORMAT_DATE(this.fbPropping.value.proppingDate && new Date(this.fbPropping.value.proppingDate));
      this.monitoringService.UpdatePropping(this.fbPropping.value).subscribe(resp => {
        if (resp) {
          this.initProppings(this.currentSeason.seasonId!, this.fbPropping.controls['proppingStageId'].value);
          this.alertMessage.displayAlertMessage(ALERT_CODES["SMOP002"]);
          this.fbPropping.reset();
        }
      })
    }
    else {
      this.fbPropping.markAllAsTouched();
    }
  }

}
