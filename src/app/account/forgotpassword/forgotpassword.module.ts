import { NgModule } from '@angular/core';
import { PrimeNgModule } from 'src/app/_shared/primeng.module';
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
    PrimeNgModule,
  ],
})
export class ForgotPasswordModule { }
