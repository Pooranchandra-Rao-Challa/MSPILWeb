import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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

  navigateToNext(){
    console.log(this.userName);

    this.router.navigate(['/forgotpassword/securityquestion'],{ queryParams: { username: this.userName }})
  }

  ngOnInit(): void {
  }

}
