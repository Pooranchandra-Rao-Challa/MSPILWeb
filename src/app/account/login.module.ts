import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { FormControl, FormGroup,ReactiveFormsModule, Validators, } from '@angular/forms';
import {ToastModule} from 'primeng/toast';
import {RippleModule} from 'primeng/ripple';


@NgModule({
    imports: [
       
        CommonModule,
        LoginRoutingModule,
        ButtonModule,
        CheckboxModule,
        InputTextModule,
        FormsModule,
        PasswordModule,
        ToastModule,
        ReactiveFormsModule,
        RippleModule
      
        
        
    ],
    declarations: [LoginComponent],
    bootstrap:    [ LoginComponent ]
})
export class LoginModule { }
