import { AllottedplotComponent } from './allottedplot/allottedplot.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlotTransfersComponent } from './plot-transfers/plot-transfers.component';

@NgModule({
  imports: [RouterModule.forChild([
<<<<<<< HEAD
    { path: 'allottedplot', component: AllottedplotComponent },
    { path: 'PlotTransfers', component: PlotTransfersComponent },
=======
    { path: 'allottedplot/:paramUrl', component: AllottedplotComponent },
>>>>>>> d3294811ab22cade5333f7e0bec962cc88e450ed
  ])],
  exports: [RouterModule]
})
export class MonitoringRoutingModule { }
