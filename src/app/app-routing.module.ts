import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";

const routes: Routes = [
  { path: '', loadChildren: () => import('./account/login.module').then(m => m.LoginModule) },
  { path: 'login', loadChildren: () => import('./account/login.module').then(m => m.LoginModule) },
  { path: 'error', loadChildren: () => import('./_common/error/error.module').then(m => m.ErrorModule) },
  { path: 'access', loadChildren: () => import('./_common/access/access.module').then(m => m.AccessModule) },
  {
      path: '', component: AppLayoutComponent,
      children: [
          { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) },
          { path: 'geomasters', loadChildren: () => import('./masters/geomasters/geomasters.module').then(m => m.GeoMastersModule) },
      ]
  },






   // Demo UI Routing  menu

  {
      path: '', component: AppLayoutComponent,
      children: [       
          { path: 'uikit', loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
          { path: 'utilities', loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
          { path: 'documentation', loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
          { path: 'blocks', loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
          { path: 'pages', loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) },
          
          
      ]
  },
  { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
  { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
  { path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: '/notfound' },
];

@NgModule({


  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'disabled', onSameUrlNavigation: 'reload', useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
