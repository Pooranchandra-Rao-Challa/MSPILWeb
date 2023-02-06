import { NgModule } from '@angular/core';
import { PrimeNgModule } from 'src/app/_shared/primeng.module';
import { AppMastersRoutingModule } from './appmasters-routing.module';
import { SeasonComponent } from './season/season.component';
import { WeedComponent } from './weed/weed.component'

@NgModule({
  declarations: [
    SeasonComponent,
    WeedComponent
  ],
  imports: [
    PrimeNgModule,
    AppMastersRoutingModule
  ],
})
export class AppMastersModule { }
