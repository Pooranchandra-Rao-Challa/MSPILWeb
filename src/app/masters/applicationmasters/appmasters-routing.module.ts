import { TptComponent } from './tpt/tpt.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { VarietyComponent } from './variety/variety.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
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
import { HglComponent } from './hgl/hgl.component';
import { ShiftsComponent } from './shift/shift.component';
import { SampleslabsComponent } from './sampleslab/sampleslab.component';


@NgModule({
  imports: [RouterModule.forChild([
    { path: 'season', component: SeasonComponent },
    { path: 'weed', component: WeedComponent },
    { path: 'pest', component: PestComponent },
    { path: 'disease', component: DiseaseComponent },
    { path: 'fertilizer', component: FertilizerComponent },
    { path: 'farmer', component: FarmerComponent },
    { path: 'lookup', component: LookupComponent },
    { path: 'planttype', component: PlanttypeComponent },
    { path: 'variety', component: VarietyComponent },
    { path: 'vehicle', component: VehicleComponent },
    { path: 'tpt', component: TptComponent },
    { path: 'plantsubtype', component: PlantsubtypeComponent },
    { path: 'bank', component: BankComponent },
    { path: 'variety', component: VarietyComponent },
    { path: 'hgl', component: HglComponent },
    { path: 'Shift', component: ShiftsComponent },
    { path: 'SampleSlabs', component: SampleslabsComponent },
  ])],
  exports: [RouterModule]
})
export class AppMastersRoutingModule { }
