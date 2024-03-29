import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppLayoutModule } from './layout/app.layout.module';
// import { NotfoundComponent } from './demo/components/notfound/notfound.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { NodeService } from './demo/service/node.service';
// import { PhotoService } from './demo/service/photo.service';

// application servicex
import { AccountService } from 'src/app/_services/account.service';
import { CommonService } from 'src/app/_services/common.service';
import { BillMasterService } from 'src/app/_services/billmaster.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { SugarAPIInterceptor } from 'src/app/_helpers/sugar.api.interceptor';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MonitoringService } from 'src/app/_services/monitoring.service';
import { permitService } from './_services/permit.service';
import { ThemeNotifier } from 'src/app/_helpers/theme.notifier.service';
import { FormArrayValidationForDuplication } from 'src/app/_common/uniqeBranchValidators/unique-branch-validator';
import { NotfoundComponent } from './account/notfound/notfound.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@NgModule({
  declarations: [
    AppComponent, NotfoundComponent,
  ], 
  imports: [
    AppRoutingModule,
    AppLayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    ToastModule,
    ConfirmDialogModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SugarAPIInterceptor, multi: true },
    { provide: 'FormArrayValidationForDuplication', useValue: FormArrayValidationForDuplication },
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
   
    // Application services,
    AccountService, JWTService, GeoMasterService, CommonService, BillMasterService,
    AppMasterService, MessageService, MonitoringService,permitService,ConfirmationService, ThemeNotifier
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
 