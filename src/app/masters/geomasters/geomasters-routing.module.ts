import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'districts', data: { breadcrumb: 'Districts' }, loadChildren: () => import('./districts/district.module').then(m => m.DistirctsModule) },
        { path: 'circle', data: { breadcrumb: 'Circles' }, loadChildren: () => import('./circles/circles.module').then(m => m.CirclesModule) },
        { path: 'division', data: { breadcrumb: 'Division' }, loadChildren: () => import('./division/divisions.module').then(m => m.DivisionsModule) },
        { path: 'mandal', data: { breadcrumb: 'villages' }, loadChildren: () => import('./mandal/mandal.module').then(m => m.MandalModule) },
        { path: 'section', data: { breadcrumb: 'Section' }, loadChildren: () => import('./section/section.module').then(m => m.SectionModule) },
        { path: 'state', data: { breadcrumb: 'State' }, loadChildren: () => import('./state/state.module').then(m => m.StateModule) },
        { path: 'village', data: { breadcrumb: 'Village' }, loadChildren: () => import('./village/village.module').then(m => m.VillageModule) },

    ])],
    exports: [RouterModule]
})
export class GeoMastersRoutingModule { }
