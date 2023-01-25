import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LayoutService } from '../layout/service/app.layout.service';
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
    loginForm: any;
    submitted= false;

    ngOnInit() {
        this.loginForm = new FormGroup({
            'login': new FormControl('', Validators.required),
            'password': new FormControl('', Validators.required)
        });
    }
    
    onSubmit() { 
        this.submitted = true;
        alert(JSON.stringify(this.loginForm.value));
    }
    
    constructor(public layoutService: LayoutService) { }
}
