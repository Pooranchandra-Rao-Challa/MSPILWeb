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
  CirclesViewDto,
  CircleDto,
  DivisionDto,
} from 'src/app/_models/geomodels';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { MEDIUM_DATE } from 'src/app/_helpers/date.format.pipe';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as FileSaver from 'file-saver';
import {
  MAX_LENGTH_20,
  MIN_LENGTH_2,
  RG_ALPHA_NUMERIC,
  RG_ALPHA_ONLY,
  RG_NUMERIC_ONLY,
  RG_PHONE_NO,
} from 'src/app/_shared/regex';
import { MaxLength } from 'src/app/_models/common';
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';

@Component({
  selector: 'app-circle',
  templateUrl: './circles.component.html',
})
export class CirclesComponent implements OnInit {
  dialog: boolean = false;
  circles: CirclesViewDto[] = [];
  circle: CircleDto = new CircleDto();
  fbcircle!: FormGroup;
  @ViewChild('filter') filter!: ElementRef;
  submitLabel!: string;
  addFlag: boolean = true;
  divisions: DivisionDto[] = [];
  mediumDate: string = MEDIUM_DATE;
  maxLength: MaxLength = new MaxLength();
  permissions: any;
  @ViewChild('dt1') table?: Table;
  exportColumns: any;
  constructor(
    private formbuilder: FormBuilder,
    private geoMasterService: GeoMasterService,
    private commonService: CommonService,
    public jwtService: JWTService,
    private AlertMessage: AlertMessage,
  ) { }

  addCircle() {
    this.fbcircle.controls['isActive'].setValue(true);
    this.circle = new CircleDto();
    this.submitLabel = 'Add Circle';
    this.addFlag = true;
    this.dialog = true;
  }

  get FormControls() {
    return this.fbcircle.controls;
  }

  ngOnInit() {
    // this.exportColumns = this.dt1.map((col) => ({
    //   title: col.label,
    //   dataKey: col.field,
    // }));
    this.permissions = this.jwtService.Permissions;
    this.initCircles();
    this.commonService.GetDivision().subscribe((resp) => {
      this.divisions = resp as unknown as DivisionDto[];
    });

    this.fbcircle = this.formbuilder.group({
      circleId: [null],
      divisionId: [null, Validators.required],
      code: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_NUMERIC), Validators.minLength(MIN_LENGTH_2), Validators.maxLength(MAX_LENGTH_20)]),
      name: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY), Validators.minLength(MIN_LENGTH_2)]),
      inchargeName: new FormControl(null, [Validators.pattern(RG_ALPHA_ONLY)]),
      listingOrder: new FormControl('', [Validators.required, Validators.pattern(RG_NUMERIC_ONLY)]),
      isActive: [null, (Validators.required)],
      inchargePhoneNo: new FormControl('', [Validators.pattern(RG_PHONE_NO)]),
      address: ['', Validators.required],
    });
  }

  initCircles() {
    this.geoMasterService.GetCircles().subscribe((resp) => {
      this.circles = resp as unknown as CirclesViewDto[];
    });
  }

  editProduct(circle: CirclesViewDto) {
    this.circle.code = circle.circleCode;
    this.circle.name = circle.circleName;
    this.circle.isActive = circle.isActive;
    this.circle.divisionId = circle.divisionId;
    this.circle.inchargeName = circle.inchargeName;
    this.circle.inchargePhoneNo = circle.inchargePhoneNo;
    this.circle.listingOrder = circle.listingOrder;
    this.circle.address = circle.address;
    this.circle.circleId = circle.circleId;
    this.fbcircle.setValue(this.circle);
    this.submitLabel = 'Update Circle';
    this.addFlag = false;
    this.dialog = true;
  }

  saveCircle(): Observable<HttpEvent<CircleDto>> {
    if (this.addFlag)
      return this.geoMasterService.CreateCircle(this.fbcircle.value);
    else return this.geoMasterService.UpdateCircle(this.fbcircle.value);
  }

isUniqueCircleCode() {
    const existingCircleCodes = this.circles.filter(Circle => 
      Circle.circleCode === this.fbcircle.value.code && 
      Circle.circleId !== this.fbcircle.value.circleId
    )
    return existingCircleCodes.length > 0; 
  }
  
  isUniqueCircleName() {
    const existingCircleNames = this.circles.filter(circle =>
      circle.circleName === this.fbcircle.value.name && 
      circle.circleId !== this.fbcircle.value.circleId
    )
    return existingCircleNames.length > 0;
  }
  
  onSubmit() {
    if (this.fbcircle.valid) {
      if (this.addFlag) {
        if (this.isUniqueCircleCode()) {
          this.AlertMessage.displayErrorMessage(
            `Circle Code :"${this.fbcircle.value.code}" Already Exists.`
          );
        } else if (this.isUniqueCircleName()) {
          this.AlertMessage.displayErrorMessage(
            `Circle Name :"${this.fbcircle.value.name}" Already Exists.` 
          );
        } else {
          this.save();
        }
      } else {
        this.save(); 
      }
    } else {
      this.fbcircle.markAllAsTouched(); 
    }
  }
  save() {
    if (this.fbcircle.valid) {
      this.saveCircle().subscribe((resp) => {
        if (resp) {
          this.initCircles();
          this.dialog = false;
          this.AlertMessage.displayAlertMessage(ALERT_CODES[this.addFlag ? "SMGMCI001" : "SMGMCI002"]);
        }
      });
    } else {
      this.fbcircle.markAllAsTouched();
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
    this.divisions = [];
    this.circles = [];
  }

  exportPdf() {
    const doc = new jsPDF('l', 'mm', 'a4');

    const head = [['Division', 'Code', 'Name', 'Incharge Name', 'Incharge PhoneNo', 'Order', 'Address', 'Is Active']];

    autoTable(doc, {
      head: head,
      body: this.toPdfFormat(),
      didDrawCell: (data) => { },
    });
    doc.save('circles.pdf');
  }

  toPdfFormat() {
    let data = [];
    for (var i = 0; i < this.circles.length; i++) {
      data.push([
        this.circles[i].divisionName,
        this.circles[i].circleCode,
        this.circles[i].circleName,
        this.circles[i].inchargeName,
        this.circles[i].inchargePhoneNo,
        this.circles[i].listingOrder,
        this.circles[i].address,
        this.circles[i].isActive
      ]);
    }
    return data;
  }

  exportExcel() {
    import('xlsx').then((xlsx) => {
      const worksheet = xlsx.utils.json_to_sheet(this.circles);
      const workbook = {
        Sheets: { data: worksheet },
        SheetNames: ['data']
      };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });
      this.saveAsExcelFile(excelBuffer, 'circles');
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
