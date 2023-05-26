import { Subject, map } from 'rxjs';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LayoutService } from '../layout/service/app.layout.service';
import { LoginModel } from '../_models/account/account.model';
import { AccountService, LogInSuccessModel } from '../_services/account.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
// import { MessageService } from 'primeng/api/messageservice';

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
  submitted = false;
  errorMsg: String = "";
  isError: boolean = false;
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
        {
          next: (resp: LogInSuccessModel) => {
            if (resp.isLoginSuccess && !resp.isFirstTimeLogin) {
              this.messageService.add({ severity: 'success', key: 'myToast', summary: 'Success!', detail: 'Signing in...!' });
              setTimeout(() => {
                this.router.navigate(['dashboard']);
              }, 1000);
            }
            else if (resp.isLoginSuccess && resp.isFirstTimeLogin) {
              // redirect the call to take secure questions form user.
            } else {
              this.submitted = false;
            }
          },
          error: (error) => {
            if ([401].includes(error)) {
              this.messageService.add({ severity: 'error', key: 'myToast', summary: 'Error', detail: "Invalid Credentials!" });
            } else if ([400].includes(error)) {
              this.messageService.add({ severity: 'error', key: 'myToast', summary: 'Error', detail: "User Not found" });
            }
            this.messageService.add({ severity: 'error', key: 'myToast', summary: 'Error', detail: "UserName Or Password Is Incorrect" });
            this.submitted = false;
          },
          complete: () => {
            console.log("The user is login successfully");
          }
        });
  }

  constructor(public layoutService: LayoutService,
    private router: Router,
    private messageService: MessageService,
    private accountService: AccountService) { }
}
