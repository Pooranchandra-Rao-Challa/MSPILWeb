


import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CancelPermitComponent } from './cancelpermit/cancelpermit.component';
import { CuttingOrderComponent } from './cuttingorder/cuttingorder.component';
import { EstimatedTonComponent } from './estimatedton/estimatedton.component';
import { NonRegisteredComponent } from './nonregistered/nonregistered.component';
import { PermitApprovalComponent } from './permitapproval/permitapproval.component';
import { PermitChartComponent } from './permitchart/permitchart.component';
import { PermitDateChangeComponent } from './permitdatechange/permitdatechange.component';
import { PermitPrintingComponent } from './permitprinting/permitprinting.component';
import { PermitQuotaComponent } from './permitquota/permitquota.component';
import { ScheduleGroupingComponent } from './schedulegrouping/schedulegrouping.component';
// import { ScheduleGroupingComponent } from './schedulegrouping/schedulegrouping.component';
import { SpecialPermitsComponent } from './specialpermits/specialpermits.component';


@NgModule({
  imports: [RouterModule.forChild([
    { path: 'permitchart', component: PermitChartComponent },
    { path: 'specialpermits', component: SpecialPermitsComponent },
    { path: 'schedulegrouping', component: ScheduleGroupingComponent },
    { path: 'permitprinting', component: PermitPrintingComponent },
    { path: 'permitapproval', component: PermitApprovalComponent },
    { path: 'nonregistered', component: NonRegisteredComponent },
    { path: 'cuttingorder', component: CuttingOrderComponent },
    { path: 'cancelpermit', component: CancelPermitComponent },
    { path: 'permitdatechange', component: PermitDateChangeComponent },
    { path: 'estimatedton', component: EstimatedTonComponent },
    { path: 'permitquota', component: PermitQuotaComponent },
    
  ])],
  exports: [RouterModule]
})

export class PermitsRoutingModule { }
