import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MandalComponent } from './mandal.component';

const routes: Routes = [
  {path:'',component:MandalComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MandalRoutingModule { }
