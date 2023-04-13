import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styles: [
  ]
})
export class ChangePasswordComponent implements OnInit {

  constructor(private router: Router) { }

  navigateToPrev(){
    this.router.navigate(['/forgotpassword/securityquestion'])
  }
  navigateToNext(){
    this.router.navigate(['/forgotpassword/successmessage'])
  }
  ngOnInit(): void {
  }

}
