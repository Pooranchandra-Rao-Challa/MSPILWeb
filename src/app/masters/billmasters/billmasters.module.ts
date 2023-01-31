import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillMastersRoutingModule } from './billmasters-routing.module';
import { BillMasterComponent } from './billmaster/billmaster.component';
import { BillParametersComponent } from './billparameters/billparameters.component';
import { LoanMasterComponent } from './loanmaster/loanmaster.component';
import { DieselRatesComponent } from './dieselrates/dieselrates.component';
import { DistanceRateSlabComponent } from './distancerateslab/distancerateslab.component';
import { VillageParamRatesComponent } from './villageparamrates/villageparamrates.component';
import { VillageTPTRateComponent } from './village-tpt-rate/village-tpt-rate.component';
import { DieselBunkComponent } from './dieselbunk/dieselbunk.component';
import { WareHouseComponent } from './warehouse/warehouse.component';

@NgModule({
  imports: [
    CommonModule,
    BillMastersRoutingModule
  ],
  declarations: [
    BillMasterComponent,
    BillParametersComponent,
    LoanMasterComponent,
    DieselRatesComponent,
    DistanceRateSlabComponent,
    VillageParamRatesComponent,
    VillageTPTRateComponent,
    DieselBunkComponent,
    WareHouseComponent,
  ]
})
export class BillMastersModule { }
