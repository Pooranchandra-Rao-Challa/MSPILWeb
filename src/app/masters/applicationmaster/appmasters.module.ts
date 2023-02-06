import { NgModule } from '@angular/core';
import { PrimeNgModule } from 'src/app/_shared/primeng.module';
import { AppMastersRoutingModule } from './appmasters-routing.module';
import { SeasonComponent } from './season/season.component';
import { WeedComponent } from './weed/weed.component';
import { PestComponent } from './pest/pest.component';
import { DiseaseComponent } from './disease/disease.component';
import { FertilizerComponent } from './fertilizer/fertilizer.component'

@NgModule({
  declarations: [
    SeasonComponent,
    WeedComponent,
    PestComponent,
    DiseaseComponent,
    FertilizerComponent
  ],
  imports: [
    PrimeNgModule,
    AppMastersRoutingModule
  ],
})
export class AppMastersModule { }
