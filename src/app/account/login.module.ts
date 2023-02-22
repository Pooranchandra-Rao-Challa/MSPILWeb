import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from 'src/app/account/login-routing.module';
import { LoginComponent } from 'src/app/account/login.component';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { ChangepasswordComponent } from 'src/app/account/changepassword/changepassword.component';
import { ForgotpasswordComponent } from 'src/app/account/forgotpassword/forgotpassword.component';
import { RequestforgotpasswordComponent } from 'src/app/account/requestforgotpassword/requestforgotpassword.component';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    ReactiveFormsModule,
    RippleModule,
  ],
  declarations: [LoginComponent, ChangepasswordComponent, ForgotpasswordComponent, RequestforgotpasswordComponent],
  bootstrap: [LoginComponent]
})
export class LoginModule { }
