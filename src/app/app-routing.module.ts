import { SettingsComponent } from 'src/app/account/settings/settings.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from "src/app/layout/app.layout.component";
import { NotfoundComponent } from './account/notfound/notfound.component';

const routes: Routes = [
  { path: '', loadChildren: () => import('src/app/account/login.module').then(m => m.LoginModule) },
  { path: 'login', loadChildren: () => import('src/app/account/login.module').then(m => m.LoginModule) },
  { path: 'forgotpassword', loadChildren: () => import('src/app/account/forgotpassword/forgotpassword.module').then(m => m.ForgotPasswordModule) },
  { path: 'error', loadChildren: () => import('src/app/_common/error/error.module').then(m => m.ErrorModule) },
  { path: 'access', loadChildren: () => import('src/app/_common/access/access.module').then(m => m.AccessModule) },
  {
    path: '', component: AppLayoutComponent,
    children: [
      { path: 'settings', component: SettingsComponent },
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
  
  { path: 'notfound', component: NotfoundComponent },
  { path: '**', redirectTo: '/notfound' },
];

@NgModule({


  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', anchorScrolling: 'disabled', onSameUrlNavigation: 'reload', useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
