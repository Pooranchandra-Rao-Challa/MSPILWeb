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
  changePassword: ForgotUserPasswordDto ={}
  constructor(private router: Router,
    private securityService:SecurityService,
    private activatedRoute:ActivatedRoute) { }

  navigateToPrev(){
    this.router.navigate(['/forgotpassword/securityquestion'],{ queryParams: { username: 'superuser' }})
  }
  navigateToNext(){
    if(this.changePassword.Password == this.changePassword.ConfirmPassword){
      this.securityService.UpdateForgotPassword(this.changePassword).subscribe(resp =>{
        if(resp as unknown as boolean){
          this.router.navigate(['/forgotpassword/successmessage'])
        }
      })
    }
  }
  ngOnInit(): void {
    this.changePassword.UserName = this.activatedRoute.snapshot.queryParams['username'];
  }

}
