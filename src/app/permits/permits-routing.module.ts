


import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CuttingOrderComponent } from './cuttingorder/cuttingorder.component';
import { NonRegisteredComponent } from './nonregistered/nonregistered.component';
import { PermitApprovalComponent } from './permitapproval/permitapproval.component';
import { PermitChartComponent } from './permitchart/permitchart.component';
import { PermitPrintingComponent } from './permitprinting/permitprinting.component';
import { ScheduleGroupingComponent } from './schedulegrouping/schedulegrouping.component';
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
    
  ])],
  exports: [RouterModule]
})

export class PermitsRoutingModule { }
