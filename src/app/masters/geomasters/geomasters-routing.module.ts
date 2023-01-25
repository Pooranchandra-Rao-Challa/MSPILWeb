import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'district', data: { breadcrumb: 'Districts' }, loadChildren: () => import('./districts/district.module').then(m => m.DistirctsModule) },

        { path: 'createDistrict', data: { breadcrumb: 'Create Districts' }, loadChildren: () => import('./districts/district.module').then(m => m.DistirctsModule) },

    ])],
    exports: [RouterModule]
})
export class GeoMastersRoutingModule { }
