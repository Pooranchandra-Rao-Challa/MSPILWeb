import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/_shared/shared.module';
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
import { DatePipe } from '@angular/common';

@NgModule({
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
  ],
  imports: [
    SharedModule,
    BillMastersRoutingModule
  ],
  providers: [
    DatePipe
  ]
})
export class BillMastersModule { }
