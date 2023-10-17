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
import { SettingsComponent } from 'src/app/account/settings/settings.component';
import { SharedModule } from 'src/app/_shared/shared.module';
import { SecurityQueComponent } from 'src/app/account/securityquestions/securityque.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

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
    SharedModule,
    ConfirmDialogModule
  ],
  declarations: [LoginComponent, SettingsComponent, SecurityQueComponent],
  bootstrap: [LoginComponent]
})
export class LoginModule { }
