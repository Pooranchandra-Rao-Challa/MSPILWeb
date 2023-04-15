import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styles: [
  ]
})
export class UserNameComponent implements OnInit {

  constructor(private router: Router) { }

  navigateToNext(){
    this.router.navigate(['/forgotpassword/securityquestion'],{ queryParams: { username: 'superuser' }})
  }

  ngOnInit(): void {
  }

}
