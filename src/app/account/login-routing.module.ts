import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginComponent } from 'src/app/account/login.component';
import { ChangepasswordComponent } from 'src/app/account/changepassword/changepassword.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: LoginComponent },
  ])],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
