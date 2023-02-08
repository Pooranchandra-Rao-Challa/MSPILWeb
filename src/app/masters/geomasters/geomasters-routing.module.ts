import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CirclesComponent } from './circles/circles.component';
import { DistrictComponent } from './districts/district.component';
import { DivisionsComponent } from './division/divisions.component';
import { MandalComponent } from './mandal/mandal.component';
import { SectionComponent } from './section/section.component';
import { StateComponent } from './state/state.component';
import { VillageComponent } from './village/village.component';

@NgModule({
    imports: [RouterModule.forChild([
        {path:'circle', component: CirclesComponent },
        {path:'districts', component: DistrictComponent },
        {path:'division',component:DivisionsComponent},
        {path:'mandal',component:MandalComponent},
        {path:'section',component:SectionComponent},
        {path:'state',component:StateComponent},
        {path:'village',component:VillageComponent},
    ])],
    exports: [RouterModule]
})
export class GeoMastersRoutingModule { }
