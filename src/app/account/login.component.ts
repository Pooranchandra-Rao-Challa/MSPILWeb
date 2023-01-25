import { Component } from '@angular/core';
import { LayoutService } from '../layout/service/app.layout.service';
import { LoginModel } from '../_models/account/account.model';
import { AccountService } from '../_services/account.service';
// import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];

    password!: string;

    loginModel: LoginModel = {};

    constructor(public layoutService: LayoutService,
      private accountService: AccountService) { }



}
