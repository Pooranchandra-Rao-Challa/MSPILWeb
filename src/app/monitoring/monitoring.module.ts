import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/_shared/shared.module';
import { MonitoringRoutingModule } from 'src/app/monitoring/monitoring-routing.module';
import { PlotofferComponent } from './plotoffer/plotoffer.component';
import { PlotTransfersComponent } from './plot-transfers/plot-transfers.component';
import { CompletedPlotsComponent } from './completed-plots/completed-plots.component';
import { PlotassesmentComponent } from './plotassesment/plotassesment.component';
import { SampleEntryComponent } from './sampleentry/sampleentry.component';
import { PlotreportsComponent } from './plotreports/plotreports.component';
import { ProppingComponent } from './propping/propping.component';
import { SeedComponent } from './seed/seed.component';
import { PlotagreementComponent } from './plotagreement/plotagreement.component';
import { PlotyieldComponent } from './plotyield/plotyield.component';



@NgModule({
  declarations: [
    PlotofferComponent,
    PlotTransfersComponent,
    CompletedPlotsComponent,
    PlotassesmentComponent,
    SampleEntryComponent,
    PlotreportsComponent,
    ProppingComponent,
    SeedComponent,
    PlotagreementComponent,
    PlotyieldComponent,
  ],
  imports: [
    SharedModule,
    MonitoringRoutingModule
  ],
})
export class MonitoringModule { }
