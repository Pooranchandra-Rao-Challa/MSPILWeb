import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-securityquestion',
  templateUrl: './securityquestion.component.html',
  styles: [
  ]
})
export class SecurityQuestionComponent implements OnInit {

  constructor(private router: Router) { }
  navigateToPrev(){
  
    this.router.navigate(['/forgotpassword/username']);
  }
  navigateToNext(){
    this.router.navigate(['/forgotpassword/changepassword'])
  }
  ngOnInit(): void {
  }

}
