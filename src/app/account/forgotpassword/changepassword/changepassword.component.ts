import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForgotUserPasswordDto } from 'src/app/_models/security';
import { SecurityService } from 'src/app/_services/security.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styles: [
  ]
})
export class ChangePasswordComponent implements OnInit {

  message: string = '';
     
  changePassword: ForgotUserPasswordDto ={}
  constructor(private router: Router,
    private securityService:SecurityService,
    private activatedRoute:ActivatedRoute) { }

  navigateToPrev(){
    debugger
    this.router.navigate(['/forgotpassword/securityquestion'],{ queryParams: { username: this.changePassword.UserName }})
  }
  navigateToNext(){
    debugger
    if(this.changePassword.Password == this.changePassword.ConfirmPassword){
      this.securityService.UpdateForgotPassword(this.changePassword).subscribe(resp =>{
        if(resp as unknown as boolean){
          this.router.navigate(['/forgotpassword/successmessage'])
        }
      })
    }
   this.message = "password and confirm password does not match Please check "
  }
  ngOnInit(): void {
    this.changePassword.UserName = this.activatedRoute.snapshot.queryParams['username'];
  }

}
