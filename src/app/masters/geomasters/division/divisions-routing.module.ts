import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DivisionsComponent } from './divisions.component';

const routes: Routes = [
  {path:'',component:DivisionsComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DivisionsRoutingModule { }
