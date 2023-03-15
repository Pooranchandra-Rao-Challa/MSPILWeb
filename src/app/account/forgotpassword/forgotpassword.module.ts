import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/_shared/shared.module';
import { ForgotpasswordComponent } from 'src/app/account/forgotpassword/forgotpassword.component';
import { RequestforgotpasswordComponent } from 'src/app/account/forgotpassword/requestforgotpassword/requestforgotpassword.component';
import { ForgotPasswordRoutingModule } from 'src/app/account/forgotpassword/forgotpassword-routing.module';


@NgModule({
  declarations: [
    ForgotpasswordComponent,
    RequestforgotpasswordComponent
  ],
  imports: [
    ForgotPasswordRoutingModule,
    SharedModule,
  ],
})
export class ForgotPasswordModule { }
