import { ChangepasswordComponent } from 'src/app/account/changepassword/changepassword.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotfoundComponent } from 'src/app/demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "src/app/layout/app.layout.component";

const routes: Routes = [
  { path: '', loadChildren: () => import('src/app/account/login.module').then(m => m.LoginModule) },
  { path: 'login', loadChildren: () => import('src/app/account/login.module').then(m => m.LoginModule) },
  { path: 'forgotpassword', loadChildren: () => import('src/app/account/forgotpassword/forgotpassword.module').then(m => m.ForgotPasswordModule) },
  { path: 'error', loadChildren: () => import('src/app/_common/error/error.module').then(m => m.ErrorModule) },
  { path: 'access', loadChildren: () => import('src/app/_common/access/access.module').then(m => m.AccessModule) },
  {
    path: '', component: AppLayoutComponent,
    children: [
      { path: 'changepassword', component: ChangepasswordComponent },
      { path: 'dashboard', loadChildren: () => import('src/app/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'security', loadChildren: () => import('src/app/security/security.module').then(m => m.SecurityModule) },
      { path: 'geomasters', loadChildren: () => import('src/app/masters/geomasters/geomasters.module').then(m => m.GeoMastersModule) },
      { path: 'billmasters', loadChildren: () => import('src/app/masters/billmasters/billmasters.module').then(m => m.BillMastersModule) },
      { path: 'appmasters', loadChildren: () => import('src/app/masters/applicationmasters/appmasters.module').then(m => m.AppMastersModule) },
      { path: 'monitoring', loadChildren: () => import('src/app/monitoring/monitoring.module').then(m => m.MonitoringModule) },
      { path: 'permits', loadChildren: () => import('src/app/permits/permits.module').then(m => m.PermitsModule) },
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
      { path: 'geomasters', loadChildren: () => import('./masters/geomasters/geomasters.module').then(m => m.GeoMastersModule) }

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
