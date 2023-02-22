import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/account/login.component';
import { RequestforgotpasswordComponent } from 'src/app/account/requestforgotpassword/requestforgotpassword.component';
import { ForgotpasswordComponent } from 'src/app/account/forgotpassword/forgotpassword.component';
import { ChangepasswordComponent } from 'src/app/account/changepassword/changepassword.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: LoginComponent },
    { path: 'changepassword', component: ChangepasswordComponent },
    { path: 'forgotpassword', component: ForgotpasswordComponent },
    { path: 'requestforgotpassword', component: RequestforgotpasswordComponent },
  ])],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
