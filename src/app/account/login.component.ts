import { Subject } from 'rxjs';
import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LayoutService } from '../layout/service/app.layout.service';
import { LoginModel } from '../_models/account/account.model';
import { AccountService } from '../_services/account.service';
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
    `],
    providers: [MessageService]
})
export class LoginComponent {

    valCheck: string[] = ['remember'];
    loginForm: any;
    submitted= false;
    errorMsg: String = "";
    isError:boolean = false;
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
          (resp) => {
            this.messageService.add({severity:'success', summary:'Success!', detail:'Signing in...!'});
            setTimeout(() => {
                this.router.navigate(['dashboard']);
            }, 1000);
            
        },
          (error) => {
            console.log(error);
            if(error.status == 401)
               this.messageService.add({severity:'error', summary:'Error', detail:"Invalid Credentials!"});
            
            else if(error.status == 400)
               this.messageService.add({severity:'error', summary:'Error', detail:"User Not found"});
            else
                this.router.navigate(["error"])
          },
        );
    }

    constructor(public layoutService: LayoutService,
      private router: Router,
      private messageService: MessageService,
      private accountService: AccountService) { }
}
