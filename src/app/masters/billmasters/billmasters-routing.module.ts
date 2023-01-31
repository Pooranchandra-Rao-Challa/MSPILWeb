import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoanMasterComponent } from './loanmaster/loanmaster.component';
import { DieselRatesComponent } from './dieselrates/dieselrates.component';
import { BillParametersComponent } from './billparameters/billparameters.component';
import { BillMasterComponent } from './billmaster/billmaster.component';
import { DistanceRateSlabComponent } from './distancerateslab/distancerateslab.component';
import { VillageParamRatesComponent } from './villageparamrates/villageparamrates.component';
import { VillageTPTRateComponent } from './village-tpt-rate/village-tpt-rate.component';
import { DieselBunkComponent } from './dieselbunk/dieselbunk.component';
import { WareHouseComponent } from './warehouse/warehouse.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'billmaster', component: BillMasterComponent },
    { path: 'billparameters', component: BillParametersComponent },
    { path: 'dieselrates', component: DieselRatesComponent },
    { path: 'loanmaster', component: LoanMasterComponent },
    { path: 'distancerateslab', component: DistanceRateSlabComponent },
    { path: 'villageparamrates', component: VillageParamRatesComponent },
    { path: 'villagetptrate', component: VillageTPTRateComponent },
    { path: 'dieselbunk', component: DieselBunkComponent },
    { path: 'warehouse', component: WareHouseComponent },
  ])],
  exports: [RouterModule]
})
export class BillMastersRoutingModule { }
