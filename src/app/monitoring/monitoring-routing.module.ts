import { AllottedplotComponent } from './allottedplot/allottedplot.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlotTransfersComponent } from './plot-transfers/plot-transfers.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'allottedplot', component: AllottedplotComponent },
    { path: 'PlotTransfers', component: PlotTransfersComponent },
  ])],
  exports: [RouterModule]
})
export class MonitoringRoutingModule { }
