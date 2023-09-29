import { ThemeDto } from 'src/app/_models/security';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { LoginModel } from 'src/app/_models/account/account.model';
import { AccountService, LogInSuccessModel } from 'src/app/_services/account.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { JWTService } from 'src/app/_services/jwt.service';
import { AppComponent } from '../app.component';

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
  themeDto: ThemeDto = {};
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
                this.appComponent.initTheme(this.jWTService.ThemeName);
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
    private accountService: AccountService,
    private jWTService: JWTService,
    private appComponent: AppComponent) { }
}
