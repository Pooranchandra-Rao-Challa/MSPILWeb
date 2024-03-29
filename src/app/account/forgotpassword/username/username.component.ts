import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-username',
  templateUrl: './username.component.html',
  styles: [
  ]
})
export class UserNameComponent implements OnInit {
  userName?: string;

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateToNext() {
    this.router.navigate(['/forgotpassword/securityquestion'], { queryParams: { username: this.userName } })
  }

}
