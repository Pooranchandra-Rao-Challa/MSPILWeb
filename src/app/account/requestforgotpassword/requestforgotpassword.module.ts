import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestforgotpasswordRoutingModule } from './requestforgotpassword-routing.module';
import { RequestforgotpasswordComponent } from './requestforgotpassword.component';


@NgModule({
  declarations: [
    RequestforgotpasswordComponent
  ],
  imports: [
    CommonModule,
    RequestforgotpasswordRoutingModule
  ]
})
export class RequestforgotpasswordModule { }
