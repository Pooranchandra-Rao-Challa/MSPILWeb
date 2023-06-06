import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeoMastersRoutingModule } from './geomasters-routing.module';
import { CirclesComponent } from './circles/circles.component';
import { DistrictComponent } from './districts/district.component';
import { DivisionsComponent } from './division/divisions.component';
import { MandalComponent } from './mandal/mandal.component';
import { SectionComponent } from './section/section.component';
import { StateComponent } from './state/state.component';
import { VillageComponent } from './village/village.component';
import { SharedModule } from 'src/app/_shared/shared.module';

@NgModule({
	declarations: [
		CirclesComponent,
		DistrictComponent,
		DivisionsComponent,
		MandalComponent,
		SectionComponent,
		StateComponent,
		VillageComponent],
	imports: [
		CommonModule,
		GeoMastersRoutingModule,
		SharedModule],
	providers: []
})
export class GeoMastersModule { }
