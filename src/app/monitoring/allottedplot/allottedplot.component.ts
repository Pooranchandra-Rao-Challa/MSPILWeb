import { Component, OnInit } from '@angular/core';
import { Table } from 'primeng/table';

export interface IHeader {
  field: string;
  header: string;
  label: string;
}

@Component({
  selector: 'app-allottedplot',
  templateUrl: './allottedplot.component.html',
  styles: [
  ]
})

export class AllottedplotComponent implements OnInit {
  allottedPlots: any;
  loading: boolean = false;
  globalFilterFields: string[] = ["Season", "OfferNo", "OfferDate", "FarmerCode", "FarmerName", "FarmerVillage", "PlotVillage", "PlantType", "Area", "Variety", "PlantingDate"];
  filter: any;
  headers: IHeader[] = [
    { field: 'Season', header: 'Season', label: 'Season' },
    { field: 'OfferNo', header: 'OfferNo', label: 'Offer No' },
    { field: 'OfferDate', header: 'OfferDate', label: 'Offer Date' },
    { field: 'FarmerCode', header: 'FarmerCode', label: 'Farmer Code' },
    { field: 'FarmerName', header: 'FarmerName', label: 'Farmer Name' },
    { field: 'FarmerVillage', header: 'FarmerVillage', label: 'Farmer Village' },
    { field: 'PlotVillage', header: 'PlotVillage', label: 'Plot Village' },
    { field: 'PlantType', header: 'PlantType', label: 'Plant Type' },
    { field: 'Area', header: 'Area', label: 'Area' },
    { field: 'Variety', header: 'Variety', label: 'Variety' },
    { field: 'PlantingDate', header: 'PlantingDate', label: 'Planting Date' },
  ]


  constructor() {
    this.allottedPlots = [
      { Id: 1, Season: '123456', OfferNo: '100001', OfferDate: '01/5/1665', FarmerCode: 24 },
      { Id: 2, Season: '123', OfferNo: '100002', OfferDate: '05/09/1995', FarmerCode: 61 },
      { Id: 3, Season: '345', OfferNo: '100003', OfferDate: '11/07/1935', FarmerCode: 2 }
    ];
  }

  ngOnInit(): void {
  }

  addAllottedPlot() {

  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  editBillParam(product: any) {
    console.log(product);

  }

}
