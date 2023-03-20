import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';

// application servicex
import { AccountService } from 'src/app/_services/account.service';
import { CommonService } from 'src/app/_services/common.service';
import { BillMasterService } from 'src/app/_services/billmaster.service';
import { JWTService } from 'src/app/_services/jwt.service';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { AppMasterService } from 'src/app/_services/appmaster.service';
import { SugarAPIInterceptor } from 'src/app/_helpers/sugar.api.interceptor';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MonitoringService } from 'src/app/_services/monitoring.service';

@NgModule({
  declarations: [
    AppComponent, NotfoundComponent
  ],
  imports: [
    AppRoutingModule,
    AppLayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    ToastModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: SugarAPIInterceptor, multi: true },
    // { provide: LocationStrategy, useClass: HashLocationStrategy },
    CountryService, CustomerService, EventService, IconService, NodeService,
    PhotoService, ProductService,
    // Application services,
    AccountService, JWTService, GeoMasterService, CommonService, BillMasterService,
    AppMasterService, MessageService, MonitoringService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
