import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-successmessage',
  templateUrl: './successmessage.component.html',
  styles: [
  ]
})
export class SuccessMessageComponent implements OnInit {

  constructor(private router: Router) { }
  navigateToPrev(){
    this.router.navigate(['/forgotpassword/changepassword'])
  }
  ngOnInit(): void {
  }

}
