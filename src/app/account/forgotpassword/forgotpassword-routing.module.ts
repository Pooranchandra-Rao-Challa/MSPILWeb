import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ForgotpasswordComponent } from 'src/app/account/forgotpassword/forgotpassword.component';
import { RequestforgotpasswordComponent } from 'src/app/account/forgotpassword/requestforgotpassword/requestforgotpassword.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: ForgotpasswordComponent },
    { path: 'requestforgotpassword', component: RequestforgotpasswordComponent },
  ])],
  exports: [RouterModule]
})
export class ForgotPasswordRoutingModule { }
