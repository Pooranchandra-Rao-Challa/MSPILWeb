import { NgModule } from '@angular/core';
import { PrimeNgModule } from 'src/app/_shared/primeng.module';
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
    PrimeNgModule,
    BillMastersRoutingModule
  ],
})
export class BillMastersModule { }
