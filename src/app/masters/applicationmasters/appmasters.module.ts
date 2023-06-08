import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/_shared/shared.module';
import { AppMastersRoutingModule } from './appmasters-routing.module';
import { SeasonComponent } from './season/season.component';
import { WeedComponent } from './weed/weed.component';
import { PestComponent } from './pest/pest.component';
import { DiseaseComponent } from './disease/disease.component';
import { FertilizerComponent } from './fertilizer/fertilizer.component';
import { FarmerComponent } from './farmer/farmer.component';
import { LookupComponent } from './lookup/lookup.component';
import { PlanttypeComponent } from './planttype/planttype.component';
import { VarietyComponent } from './variety/variety.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { TptComponent } from './tpt/tpt.component'
import { PlantsubtypeComponent } from './plantsubtype/plantsubtype.component';
import { BankComponent } from './bank/bank.component';
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
    VarietyComponent,
    VehicleComponent,
    TptComponent,
    PlantsubtypeComponent,
    BankComponent,
    VarietyComponent,
    HglComponent,
    ShiftsComponent,
    SampleslabsComponent,

  ],
  imports: [
    SharedModule,
    AppMastersRoutingModule
  ],
})
export class AppMastersModule { }
