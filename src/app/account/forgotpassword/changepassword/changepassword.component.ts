import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgotUserPasswordDto } from 'src/app/_models/security';
import { SecurityService } from 'src/app/_services/security.service';
import { ConfirmedValidator } from 'src/app/_validators/confirmValidator';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styles: [
  ]
})
export class ChangePasswordComponent implements OnInit {
  fbChangePassword!: FormGroup;
  changePassword: ForgotUserPasswordDto = {}

  constructor(private router: Router,
    private formbuilder: FormBuilder,
    private securityService: SecurityService,
    private activatedRoute: ActivatedRoute) { }

  navigateToPrev() {
    this.router.navigate(['/forgotpassword/securityquestion'], { queryParams: { username: this.changePassword.UserName } })
  }

  navigateToNext() {
    if (this.fbChangePassword.valid) {
      this.securityService.UpdateForgotPassword(this.fbChangePassword.value).subscribe(resp => {
        if (resp as unknown as boolean) {
          this.router.navigate(['/forgotpassword/successmessage'])
        }
      })
    }
    else {
      this.fbChangePassword.markAllAsTouched();
    }
  }

  ngOnInit(): void {
    this.changePasswordForm();
    this.fbChangePassword.controls['userName'].setValue(this.activatedRoute.snapshot.queryParams['username']);
  }

  changePasswordForm() {
    this.fbChangePassword = this.formbuilder.group({
      userName: new FormControl(''),
      password: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required)
    }, {
      validator: ConfirmedValidator('password', 'confirmPassword')
    });
  }

  get FormControls() {
    return this.fbChangePassword.controls;
  }

}
