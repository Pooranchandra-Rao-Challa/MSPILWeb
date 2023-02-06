import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SeasonComponent } from './season/season.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'season', component: SeasonComponent },
  ])],
  exports: [RouterModule]
})
export class AppMastersRoutingModule { }
