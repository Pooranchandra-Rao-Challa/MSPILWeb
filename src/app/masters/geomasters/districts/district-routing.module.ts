import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DistrictComponent } from './district.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: DistrictComponent }
	])],
	exports: [RouterModule]
})
export class DistrictRoutingModule { }
