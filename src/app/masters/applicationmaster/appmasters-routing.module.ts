import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SeasonComponent } from './season/season.component';
import { WeedComponent } from './weed/weed.component';
import { PestComponent } from './pest/pest.component';
import { DiseaseComponent } from './disease/disease.component';
import { FertilizerComponent } from './fertilizer/fertilizer.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'season', component: SeasonComponent },
    { path: 'weed', component: WeedComponent },
    { path: 'pest', component: PestComponent},
    { path: 'disease', component: DiseaseComponent},
    { path: 'fertilizer', component: FertilizerComponent},
  ])],
  exports: [RouterModule]
})
export class AppMastersRoutingModule { }
