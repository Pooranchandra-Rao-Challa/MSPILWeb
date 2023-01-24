import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'districts', data: { breadcrumb: 'Districts' }, loadChildren: () => import('./districts/district.module').then(m => m.DistirctsModule) },
        { path: 'circle', data: { breadcrumb: 'Districts' }, loadChildren: () => import('./circles/circles.module').then(m => m.CirclesModule) },
        
    ])],
    exports: [RouterModule]
})
export class GeoMastersRoutingModule { }
