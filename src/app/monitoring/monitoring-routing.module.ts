import { PlotreportsComponent } from './plotreports/plotreports.component';
import { PlotofferComponent } from './plotoffer/plotoffer.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlotTransfersComponent } from './plot-transfers/plot-transfers.component';
import { CompletedPlotsComponent } from './completed-plots/completed-plots.component';
import { PlotassesmentComponent } from './plotassesment/plotassesment.component';
import { SampleEntryComponent } from './sampleentry/sampleentry.component';
import { ProppingComponent } from './propping/propping.component';
import { SeedComponent } from './seed/seed.component';
import { PlotagreementComponent } from './plotagreement/plotagreement.component';
import { PlotyieldComponent } from './plotyield/plotyield.component';



@NgModule({
  imports: [RouterModule.forChild([
    { path: 'plotoffer', component: PlotofferComponent },
    { path: 'PlotTransfers', component: PlotTransfersComponent },
    { path: 'CompletedPlots', component: CompletedPlotsComponent },
    { path: 'plotoffer/:paramUrl', component: PlotofferComponent },
    { path: 'plotassessment', component: PlotassesmentComponent},
    { path: 'plotagreement', component: PlotagreementComponent},
    { path: 'sampleentry', component: SampleEntryComponent},
    { path: 'plotreports', component: PlotreportsComponent},
    { path: 'plotreports/:paramUrl', component: PlotreportsComponent },
    { path: 'propping', component: ProppingComponent},
    { path: 'seed', component: SeedComponent},
    { path: 'plotyield', component: PlotyieldComponent},
  ])],
  exports: [RouterModule]
})
export class MonitoringRoutingModule { }
