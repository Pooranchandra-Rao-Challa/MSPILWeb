import { PlotreportsComponent } from './plotreports/plotreports.component';
import { AllottedplotComponent } from './allottedplot/allottedplot.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlotTransfersComponent } from './plot-transfers/plot-transfers.component';
import { CompletedPlotsComponent } from './completed-plots/completed-plots.component';
import { PlotassesmentComponent } from './plotassesment/plotassesment.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'allottedplot', component: AllottedplotComponent },
    { path: 'PlotTransfers', component: PlotTransfersComponent },
    { path: 'CompletedPlots', component: CompletedPlotsComponent },
    { path: 'allottedplot/:paramUrl', component: AllottedplotComponent },
    { path: 'plotassesment', component: PlotassesmentComponent},
    { path: 'plotreports', component: PlotreportsComponent},
  ])],
  exports: [RouterModule]
})
export class MonitoringRoutingModule { }
