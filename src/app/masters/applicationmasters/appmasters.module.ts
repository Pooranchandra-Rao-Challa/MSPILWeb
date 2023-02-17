import { NgModule } from '@angular/core';
import { PrimeNgModule } from 'src/app/_shared/primeng.module';
import { AppMastersRoutingModule } from './appmasters-routing.module';
import { SeasonComponent } from './season/season.component';
import { WeedComponent } from './weed/weed.component';
import { PestComponent } from './pest/pest.component';
import { DiseaseComponent } from './disease/disease.component';
import { FertilizerComponent } from './fertilizer/fertilizer.component';
import { FarmerComponent } from './farmer/farmer.component';
import { LookupComponent } from './lookup/lookup.component';
import { PlanttypeComponent } from './planttype/planttype.component';
import { PlantsubtypeComponent } from './plantsubtype/plantsubtype.component';
import { BankComponent } from './bank/bank.component';
import { VarietyComponent } from './variety/variety.component';
import { HglComponent } from './hgl/hgl.component'
import { ShiftsComponent } from './shift/shift.component';
import { SampleslabsComponent } from './sampleslab/sampleslab.component';

@NgModule({
  declarations: [
    SeasonComponent,
    WeedComponent,
    PestComponent,
    DiseaseComponent,
    FertilizerComponent,
    FarmerComponent,
    LookupComponent,
    PlanttypeComponent,
    PlantsubtypeComponent,
    BankComponent ,
    VarietyComponent,
    HglComponent,
   ShiftsComponent,
   SampleslabsComponent
  ],
  imports: [
    PrimeNgModule,
    AppMastersRoutingModule
  ],
})
export class AppMastersModule { }
