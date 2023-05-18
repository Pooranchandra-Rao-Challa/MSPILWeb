import { HttpEvent } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table';
import { Observable } from 'rxjs/internal/Observable';
import { LookupDetailDto, SeasonDto, SeasonViewDto, } from 'src/app/_models/applicationmaster';
import {
  IFarmerInPlotOfferDto, MaintenanceItems, MaintWeedicideDto, MaintDiseaseDto, MaintFertilizerDto, MaintPestDto, IPlotAssessmentViewDto, PlotInfoDto, PlotsDto,
  PlotAssessmentDto
} from 'src/app/_models/monitoring';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { LookupService } from 'src/app/_services/lookup.service';
import { MonitoringService } from 'src/app/_services/monitoring.service';
import { CURRENT_SEASON } from 'src/environments/environment';
import { FORMAT_DATE, MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';
import { JWTService } from 'src/app/_services/jwt.service';
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as FileSaver from 'file-saver';
import { ITableHeader } from 'src/app/_models/common';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-plotassesment',
  templateUrl: './plotassesment.component.html',
  styles: [
  ]
})

export class PlotassesmentComponent implements OnInit {
  plotinfo: any;
  showDialog: boolean = false;
  submitLabel!: string;
  @ViewChild('filter') filter!: ElementRef;
  @ViewChild('dtPlotAssessments') dtPlotAssessments!: Table;
  loading: boolean = true;
  addFlag: boolean = true;
  fbPlotAssessment!: FormGroup
  seasons: SeasonViewDto[] = [];
  currentSeason: SeasonDto = {};
  cropstypes: LookupDetailDto[] = [];
  weedstatus: LookupDetailDto[] = [];
  plotAssessment: PlotAssessmentDto = new PlotAssessmentDto();
  plotAssessments: IFarmerInPlotOfferDto[] = [];
  plotReports: PlotInfoDto[] = [];
  currentSeasonCode?: string;
  plotInfo: PlotsDto = {};
  mediumDate: string = MEDIUM_DATE;
  maintanenceItems?: MaintenanceItems = {}
  activeIndex?= 0;
  activeIndex1?= 0;
  activeIndex2?= 0;
  permissions: any;
  exportColumns: any;
  currentSeasonId?: number;
  plantFrom!: Date;
  plantTo!: Date;

  constructor(private formbuilder: FormBuilder,
    private appMasterService: AppMasterService,
    private lookupService: LookupService,
    private monitoringService: MonitoringService,
    private jwtService: JWTService,
    private alertMessage: AlertMessage,) { }

  farmerHeader: ITableHeader[] = [
    { field: 'seasonCode', header: 'seasonCode', label: 'Season' },
    { field: 'farmerCode', header: 'farmerCode', label: 'Farmer Code' },
    { field: 'farmerName', header: 'farmerName', label: 'Farmer Name' },
    { field: 'farmerVillageName', header: 'farmerVillageName', label: 'Farmer Village' }
  ];

  plotHeader: ITableHeader[] = [
    { field: 'plotNumber', header:'plotNumber', label: 'Plot Number' },
    { field: 'plantingDate', header:'plantingDate', label: 'Planting Date' },
    { field: 'cropTypeName', header:'cropTypeName', label: 'Crop Type' },
    { field: 'plantTypeName', header:'plantTypeName', label: 'Plant Type' },
    { field: 'surveyNo', header:'surveyNo', label: 'Survey No' },
    { field: 'varietyName', header: 'varietyName', label: 'Variety' },
    { field: 'fieldName',header:'fieldName', label: 'Field Name' },
    { field: 'plotTypeName', header:'plotTypeName', label: 'Plot Type' },
    { field: 'assessedArea', header:'assessedArea', label: 'Assessment Area' },
    { field: 'measuredDate', header:'measuredDate', label: 'Assessment Date' },
    { field: 'offerNo', header: 'offerNo', label: 'OfferNo' },
    { field: 'weedStatusName', header: 'weedStatusName  ', label: 'Weed Status' },
    { field: 'interCropName', header: 'interCropName', label: 'Inter Croping' },

  ];



  addPlotAssessment(plotAssessmentId: number = -1) {
    this.fbPlotAssessment.controls['seasonId'].setValue(this.currentSeasonId);
    this.initPlotNumbers(this.currentSeasonId!, -1);
    this.submitLabel = "Add Assessment";
    this.addFlag = true;
    this.showDialog = true;
    this.getMaintenanceItemsForAssessment();
  }

  getMaintenanceItemsForAssessment(plotAssessmentId: number = -1) {
    this.monitoringService.GetMaintenanceItemsForAssessment(plotAssessmentId).subscribe((resp) => {
      this.maintanenceItems = resp as unknown as MaintenanceItems;
      this.initMaintanenceItems();
    });
  }

  initMaintanenceItems() {
    let weedicideArray = this.fbPlotAssessment.get("weedicides") as FormArray;

    this.maintanenceItems?.weedicides?.forEach(weedicide => {
      weedicideArray.push(this.createWeed(weedicide));
    })
    let fertilizerArray = this.fbPlotAssessment.get("fertilizers") as FormArray;

    this.maintanenceItems?.fertilizers?.forEach(fertilizer => {
      fertilizerArray.push(this.createFertlizer(fertilizer))
    })
    let pestArray = this.fbPlotAssessment.get("pests") as FormArray;

    this.maintanenceItems?.pests?.forEach(pest => {
      pestArray.push(this.createpests(pest))
    })
    let diseaseArray = this.fbPlotAssessment.get("diseases") as FormArray;

    this.maintanenceItems?.diseases?.forEach(disease => {
      diseaseArray.push(this.createDisease(disease))
    })
  }

  ClearForm() {
    var temp = Object.assign({}, this.currentSeason);
    this.fbPlotAssessment.reset();
    this.plotInfo = {};
    (this.fbPlotAssessment.get("weedicides") as FormArray).clear();
    (this.fbPlotAssessment.get("fertilizers") as FormArray).clear();
    (this.fbPlotAssessment.get("pests") as FormArray).clear();
    (this.fbPlotAssessment.get("diseases") as FormArray).clear();
    this.activeIndex = this.activeIndex1 = this.activeIndex2 = 0;
    this.currentSeason = Object.assign({}, temp);
    this.fbPlotAssessment.get('seasonId')?.patchValue(this.currentSeason.seasonId);
  }

  ngOnInit(): void {

    this.exportColumns = this.farmerHeader.map((col) => ({
      title: col.header,
      dataKey: col.field,
    }));
    this.permissions = this.jwtService.Permissions;
    this.currentSeasonCode = CURRENT_SEASON()
    this.plotAssessmentForm();
    this.initCurrentSeasons();
    this.initSeasons();
    this.initCropType();
    this.initweedstatus();

  }


  loadPlotassessmentLazy(event: IPlotAssessmentViewDto) {


    setTimeout(() => {

        let loadedCars = this.plotAssessments.slice(1000);

        // Array.prototype.splice.apply(this.plotAssessments, [
        //   ...[1000],
        //   ...loadedCars
        // ]);
        this.plotAssessments = [...this.plotAssessments];
    }, Math.random() * 1000 + 250);
}

  initSeasons() {
    this.appMasterService.Getseason().subscribe((resp) => {
      this.seasons = resp as unknown as SeasonViewDto[];
    });
  }


  initCurrentSeasons() {
    this.appMasterService.CurrentSeason(this.currentSeasonCode!).subscribe((resp) => {
      this.currentSeason = resp as unknown as SeasonDto;
      this.currentSeasonId = this.currentSeason.seasonId;
      this.initPlotNumbers(this.currentSeason.seasonId!, -1);
      this.initPlotAssessments(this.currentSeason.seasonId!);
    });
  }

  getPlotinfo(plotId: number) {
    this.monitoringService.GetPlotsinfo(plotId).subscribe((resp) => {
      this.plotInfo = resp as unknown as PlotsDto;
    });
  }

  initPlotNumbers(season: number, plotId: number) {
    this.plotInfo = {};
    this.fbPlotAssessment.controls['measuredDate'].setValue(null);
    this.monitoringService.GetPlotsInSeason(season, 'Assessment', plotId).subscribe((resp) => {
      this.plotReports = resp as unknown as PlotInfoDto[];
      this.seasons?.forEach((value) => {
        if (value.seasonId == season) {
          this.plantFrom = value.plantFrom && new Date(value.plantFrom?.toString() + "");
          this.plantTo = value.plantTo && new Date(value.plantTo?.toString() + "");
        }
      });
    });
  }

  initPlotAssessments(seasonId: number) {
    let param1 = this.filter.nativeElement.value == "" ? null : this.filter.nativeElement.value;
    this.monitoringService.GetPlotAssessments(seasonId, param1).subscribe((resp) => {
      this.plotAssessments = resp as unknown as IFarmerInPlotOfferDto[];
    });
  }

  onRowExpand(source: any) {
    var data = source.data as IFarmerInPlotOfferDto;
    this.monitoringService.GetFarmerPlotsInAssessment(data.seasonId, data.farmerId).subscribe(resp => {
      data.ObjMeasuredPlots = resp as unknown as IPlotAssessmentViewDto[];
    });
  }

  onSearch() {
    this.dtPlotAssessments.expandedRowKeys = {};
    this.initPlotAssessments(this.currentSeason.seasonId!);
  }

  plotAssessmentForm() {
    this.fbPlotAssessment = this.formbuilder.group({
      plotAssessmentId: [null],
      seasonId: [{ value: this.currentSeason.seasonId }, (Validators.required)],
      plotId: [null, (Validators.required)],
      measuredArea: [null, Validators.required],
      measuredDate: [null, Validators.required],
      isaDemoPlot: [null],
      weedStatusId: [null],
      interCropingId: [null],
      hasMicroNutrientDeficiency: [null],
      isTrashMulchingDone: [null],
      isGapsFillingDone: [null],
      weedicides: this.formbuilder.array([]),
      pests: this.formbuilder.array([]),
      fertilizers: this.formbuilder.array([]),
      diseases: this.formbuilder.array([]),
    })
  }

  initCropType() {
    this.lookupService.Crops().subscribe((resp) => {
      this.cropstypes = resp as unknown as LookupDetailDto[];
    });
  }

  initweedstatus() {
    this.lookupService.WeedStatuses().subscribe((resp) => {
      this.weedstatus = resp as unknown as LookupDetailDto[];
    });
  }
  get FormControls() {
    return this.fbPlotAssessment.controls;
  }

  getFormArrayControl(formGroupName: string): FormArray {
    return this.fbPlotAssessment.controls[formGroupName] as FormArray
  }

  createpests(pest: MaintPestDto): FormGroup {
    return this.formbuilder.group({
      plotPestId: [pest.plotPestId],
      pestId: [pest.pestId],
      plotAssessmentId: [pest.plotAssessmentId],
      pestName: [pest.pestName],
      remarks: [pest.remarks],
      identifiedDate: [pest.identifiedDate && FORMAT_DATE(new Date(pest.identifiedDate))],
      controlDate: [pest.controlDate && FORMAT_DATE(new Date(pest.controlDate))]
    })
  }

  createWeed(weed: MaintWeedicideDto): FormGroup {
    return this.formbuilder.group({
      plotWeedicideId: [weed.plotWeedicideId],
      weedicideId: [weed.weedicideId],
      plotAssessmentId: [weed.plotAssessmentId],
      weedicideName: [weed.weedicideName],
      checked: [weed.selected],
    });
  }

  createFertlizer(fertilizer: MaintFertilizerDto): FormGroup {
    return this.formbuilder.group({
      plotFertilizerId: [fertilizer.plotFertilizerId],
      fertilizerId: [fertilizer.fertilizerId],
      plotAssessmentId: [fertilizer.plotAssessmentId],
      fertilizerName: [fertilizer.fertilizerName],
      checked: [fertilizer.selected],
    });
  }

  createDisease(disease: MaintDiseaseDto): FormGroup {
    return this.formbuilder.group({
      plotDiseaseId: [disease.plotDiseaseId],
      diseaseId: [disease.diseaseId],
      plotAssessmentId: [disease.plotAssessmentId],
      diseaseName: [disease.diseaseName],
      remarks: [disease.remarks],
      identifiedDate: [disease.identifiedDate && FORMAT_DATE(new Date(disease.identifiedDate))],
      controlDate: [disease.controlDate && FORMAT_DATE(new Date(disease.controlDate))]
    })
  }

  savePlotAssessment(): Observable<HttpEvent<PlotAssessmentDto>> {
    var postValues = this.fbPlotAssessment.value;
    postValues.weedicides = postValues.weedicides.filter((weed: any) => weed.checked == true)
    postValues.pests = postValues.pests.filter((pest: any) => pest.identifiedDate != undefined || pest.controlDate != undefined)
    postValues.fertilizers = postValues.fertilizers.filter((fertilizer: any) => fertilizer.checked == true)
    postValues.diseases = postValues.diseases.filter((disease: any) => disease.identifiedDate != undefined || disease.controlDate != undefined)
    if (this.addFlag) return this.monitoringService.CreatePlotAssessment(postValues)
    else return this.monitoringService.UpdatePlotAssessment(postValues)
  }

  editPlotAssessment(plotAssessment: IPlotAssessmentViewDto) {
    this.initPlotNumbers(plotAssessment.seasonId, plotAssessment?.plotId);
    this.plotAssessment.plotAssessmentId = plotAssessment.plotAssessmentId;
    this.plotAssessment.plotId = plotAssessment?.plotId;
    this.plotAssessment.measuredArea = plotAssessment.assessedArea;
    this.plotAssessment.measuredDate = plotAssessment.measuredDate && new Date(plotAssessment.measuredDate);
    this.plotAssessment.isaDemoPlot = plotAssessment.isADemoPlot;
    this.plotAssessment.weedStatusId = plotAssessment.weedStatusId;
    this.plotAssessment.interCropingId = plotAssessment.interCropId;
    this.plotAssessment.hasMicroNutrientDeficiency = plotAssessment.isTrashMulchingDone;
    this.plotAssessment.isGapsFillingDone = plotAssessment.isGapsFillingDone;
    this.fbPlotAssessment.patchValue(this.plotAssessment);
    this.fbPlotAssessment.controls['seasonId'].setValue(plotAssessment.seasonId);
    this.getPlotinfo(plotAssessment.plotId);
    this.getMaintenanceItemsForAssessment(plotAssessment.plotAssessmentId);

    this.addFlag = false;
    this.submitLabel = 'Update Assessment';
    this.showDialog = true;
  }

  onSubmit() {
    if (this.fbPlotAssessment.valid) {
      this.savePlotAssessment().subscribe(resp => {
        if (resp) {
          this.dtPlotAssessments.expandedRowKeys = {};
          // this.savePlotAssessment();
          this.initPlotAssessments(this.currentSeason.seasonId!);
          this.fbPlotAssessment.reset();
          this.showDialog = false;
          this.alertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMOPAS001" : "SMOPAS002"]);
        }
      });
    }
    else {
      this.fbPlotAssessment.markAllAsTouched();
    }
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
    this.onSearch();
  }

  exportPdf() {

    const doc = new jsPDF('l', 'mm', 'a4');
    (doc as any).autoTable(this.exportColumns, this.plotAssessments);

    // doc['autoTable'](this.exportColumns, this.plotAssessments);
    // doc.autoTable(this.exportColumns, this.plotAssessments);
    doc.save('plot_Assessments.pdf');
  }
  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.plotAssessments);
      const workbook = {
        Sheets: { data: worksheet },
        SheetNames: ['data']
      };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'plotAssessments');
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    let EXCEL_TYPE =
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    let EXCEL_EXTENSION = '.xlsx';
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE,
    });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }


}
