import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeNgModule } from "src/app/_shared/primeng.module";
import { AlphaDirective } from 'src/app/_directives/alphaOnly.directive';
import { AlphaNumericDirective } from 'src/app/_directives/alphaNumeric.directive';
import { NumericDirective } from "src/app/_directives/numericOnly.directive";
import { AlertMessage } from "src/app/_alerts/alertMessage";
import { AddressDirective } from "src/app/_directives/address.directive";

@NgModule({
  declarations: [
    AlphaDirective,
    AlphaNumericDirective,
    NumericDirective,
    AddressDirective,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    AlphaDirective,
    AlphaNumericDirective,
    NumericDirective,
    AddressDirective,
  ],
  providers: [AlertMessage]
})
export class SharedModule { }
