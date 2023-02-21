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
    { path: 'tpt', component: TptComponent }

  ])],
  exports: [RouterModule]
})
export class AppMastersRoutingModule { }
