import { NgModule } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { SharedModule } from 'src/app/_shared/shared.module';
import { CancelPermitComponent } from './cancelpermit/cancelpermit.component';
import { CuttingOrderComponent } from './cuttingorder/cuttingorder.component';
import { EstimatedTonComponent } from './estimatedton/estimatedton.component';
import { NonRegisteredComponent } from './nonregistered/nonregistered.component';
import { PermitApprovalComponent } from './permitapproval/permitapproval.component';
import { PermitChartComponent } from './permitchart/permitchart.component';
import { PermitDateChangeComponent } from './permitdatechange/permitdatechange.component';
import { PermitPrintingComponent } from './permitprinting/permitprinting.component';
import { PermitQuotaComponent } from './permitquota/permitquota.component';
import { PermitsRoutingModule } from './permits-routing.module';
import { ScheduleGroupingComponent } from './schedulegrouping/schedulegrouping.component';
// import { ScheduleGroupingComponent } from './schedulegrouping/schedulegrouping.component';
import { SpecialPermitsComponent } from './specialpermits/specialpermits.component';

@NgModule({
  declarations: [
    PermitChartComponent,
    SpecialPermitsComponent,
    ScheduleGroupingComponent,
    PermitPrintingComponent,
    PermitApprovalComponent,
    NonRegisteredComponent,
    CuttingOrderComponent,
    CancelPermitComponent,
    PermitDateChangeComponent,
    EstimatedTonComponent,
    PermitQuotaComponent
  ],
  imports: [
    SharedModule,
    PermitsRoutingModule,
    PanelModule,
  ],
})
export class PermitsModule { }
