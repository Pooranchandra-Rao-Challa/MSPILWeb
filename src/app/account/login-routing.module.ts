import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/account/login.component';
import { SecurityQueComponent } from './securityquestions/securityque.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: LoginComponent },
    { path: 'securityquestions', component: SecurityQueComponent },



  ])],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
