import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SecurityService } from 'src/app/_services/security.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styles: [
  ]
})
export class ChangePasswordComponent implements OnInit {
  userName?:string;
  constructor(private router: Router,
    private securityService:SecurityService,
    private activatedRoute:ActivatedRoute) { }

  navigateToPrev(){
    this.router.navigate(['/forgotpassword/securityquestion'])
  }
  navigateToNext(){
    this.router.navigate(['/forgotpassword/successmessage'])
  }
  ngOnInit(): void {
    this.userName = this.activatedRoute.snapshot.queryParams['username'];
  }

}
