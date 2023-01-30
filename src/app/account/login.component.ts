import { Subject } from 'rxjs';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LayoutService } from '../layout/service/app.layout.service';
import { LoginModel } from '../_models/account/account.model';
import { AccountService } from '../_services/account.service';
import { Router } from '@angular/router';
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
    loginForm: any;
    submitted= false;

    ngOnInit() {
        this.loginForm = new FormGroup({
            'UserName': new FormControl('', Validators.required),
            'Password': new FormControl('', Validators.required)
        });
    }

    onSubmit() {
        this.submitted = true;
        this.accountService.Authenticate(this.loginForm.value as LoginModel)
        .subscribe(
          (resp) => this.router.navigate(['dashboard']),
          (error) => console.error(error),
        );
    }

    public logOut(){
      this.router.navigate(["/"])
    }

    constructor(public layoutService: LayoutService,
      private router: Router,
      private accountService: AccountService) { }
}
