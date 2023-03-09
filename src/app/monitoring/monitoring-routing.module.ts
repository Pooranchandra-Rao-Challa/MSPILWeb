import { AllottedplotComponent } from './allottedplot/allottedplot.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlotTransfersComponent } from './plot-transfers/plot-transfers.component';
import { CompletedPlotsComponent } from './completed-plots/completed-plots.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'allottedplot', component: AllottedplotComponent },
    { path: 'PlotTransfers', component: PlotTransfersComponent },
    { path: 'CompletedPlots', component: CompletedPlotsComponent },
    { path: 'allottedplot/:paramUrl', component: AllottedplotComponent },
  ])],
  exports: [RouterModule]
})
export class MonitoringRoutingModule { }
