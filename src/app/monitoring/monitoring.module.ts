import { NgModule } from '@angular/core';
import { PrimeNgModule } from 'src/app/_shared/primeng.module';
import { MonitoringRoutingModule } from 'src/app/monitoring/monitoring-routing.module';
import { AllottedplotComponent } from './allottedplot/allottedplot.component';
import { PlotTransfersComponent } from './plot-transfers/plot-transfers.component';
import { CompletedPlotsComponent } from './completed-plots/completed-plots.component';
import { PlotassesmentComponent } from './plotassesment/plotassesment.component';

@NgModule({
  declarations: [
  
    AllottedplotComponent,
    PlotTransfersComponent,
    CompletedPlotsComponent,
    PlotassesmentComponent
  ],
  imports: [
    PrimeNgModule,
    MonitoringRoutingModule
  ],
})
export class MonitoringModule { }
