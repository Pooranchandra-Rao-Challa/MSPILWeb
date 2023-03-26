import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/_shared/shared.module';
import { CuttingOrderComponent } from './cuttingorder/cuttingorder.component';
import { NonRegisteredComponent } from './nonregistered/nonregistered.component';
import { PermitApprovalComponent } from './permitapproval/permitapproval.component';
import { PermitChartComponent } from './permitchart/permitchart.component';
import { PermitPrintingComponent } from './permitprinting/permitprinting.component';

import { PermitsRoutingModule } from './permits-routing.module';
import { ScheduleGroupingComponent } from './schedulegrouping/schedulegrouping.component';
import { SpecialPermitsComponent } from './specialpermits/specialpermits.component';

@NgModule({
  declarations: [
    PermitChartComponent,
    SpecialPermitsComponent,
    ScheduleGroupingComponent,
    PermitPrintingComponent,
    PermitApprovalComponent,
    NonRegisteredComponent,
    CuttingOrderComponent
  ],
  imports: [
    SharedModule,
    PermitsRoutingModule
  ],
})
export class PermitsModule { }
