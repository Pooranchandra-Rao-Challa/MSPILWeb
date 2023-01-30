import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'roles', component: RolesComponent },
    { path: 'users', component: UsersComponent },

  ])],
  exports: [RouterModule]
})
export class SecurityRoutingModule { }
