import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/_shared/shared.module';
import { ForgotpasswordComponent } from 'src/app/account/forgotpassword/forgotpassword.component';
import { RequestforgotpasswordComponent } from 'src/app/account/forgotpassword/requestforgotpassword/requestforgotpassword.component';
import { ForgotPasswordRoutingModule } from 'src/app/account/forgotpassword/forgotpassword-routing.module';
import { StepsModule } from 'primeng/steps';
import { ChangePasswordComponent } from './changepassword/changepassword.component';
import { SecurityQuestionComponent } from './securityquestion/securityquestion.component';
import { SuccessMessageComponent } from './successmsg/successmessage.component';
import { UserNameComponent } from './username/username.component';


@NgModule({
  declarations: [
    ForgotpasswordComponent,
    RequestforgotpasswordComponent,
    ChangePasswordComponent,
    SecurityQuestionComponent,
    SuccessMessageComponent,
    UserNameComponent

  ],
  imports: [
    ForgotPasswordRoutingModule,
    SharedModule,
    StepsModule 
  ],
})
export class ForgotPasswordModule { }
