import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ForgotpasswordComponent } from 'src/app/account/forgotpassword/forgotpassword.component';
import { RequestforgotpasswordComponent } from 'src/app/account/forgotpassword/requestforgotpassword/requestforgotpassword.component';
import { ChangePasswordComponent } from './changepassword/changepassword.component';
import { SecurityQuestionComponent } from './securityquestion/securityquestion.component';
import { SuccessMessageComponent } from './successmsg/successmessage.component';
import { UserNameComponent } from './username/username.component';

@NgModule({
  imports: [RouterModule.forChild([
     { path: '', component: ForgotpasswordComponent,
     
      children: [
        {path: '', redirectTo: 'username', pathMatch: 'full'},
        { path: 'username', component: UserNameComponent },
        { path: 'securityquestion', component: SecurityQuestionComponent },
        { path: 'changepassword', component: ChangePasswordComponent },
        { path: 'successmessage', component: SuccessMessageComponent },
      ],
    },
    
    // { path: 'requestforgotpassword', component: RequestforgotpasswordComponent },
   
    
    
   
  ])],
  exports: [RouterModule]
})
export class ForgotPasswordRoutingModule { }
