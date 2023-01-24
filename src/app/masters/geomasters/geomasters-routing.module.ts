import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'districts', data: { breadcrumb: 'Districts' }, loadChildren: () => import('./districts/district.module').then(m => m.DistirctsModule) },
        
    ])],
    exports: [RouterModule]
})
export class GeoMastersRoutingModule { }
