import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SeasonComponent } from './season/season.component';
import { WeedComponent } from './weed/weed.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'season', component: SeasonComponent },
    { path: 'weed', component: WeedComponent },
  ])],
  exports: [RouterModule]
})
export class AppMastersRoutingModule { }
