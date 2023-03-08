import { AllottedplotComponent } from './allottedplot/allottedplot.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'allottedplot/:paramUrl', component: AllottedplotComponent },
  ])],
  exports: [RouterModule]
})
export class MonitoringRoutingModule { }
