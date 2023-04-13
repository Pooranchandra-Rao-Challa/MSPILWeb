import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styles: [
    `
        .ui-steps .ui-steps-item {
            width: 25%;
        }
        
        .ui-steps.steps-custom {
            margin-bottom: 30px;
        }
        
        .ui-steps.steps-custom .ui-steps-item .ui-menuitem-link {
            padding: 0 1em;
            overflow: visible;
        }
        
        .ui-steps.steps-custom .ui-steps-item .ui-steps-number {
            background-color: #0081c2;
            color: #FFFFFF;
            display: inline-block;
            width: 36px;
            border-radius: 50%;
            margin-top: -14px;
            margin-bottom: 10px;
        }
        
        .ui-steps.steps-custom .ui-steps-item .ui-steps-title {
            color: #555555;
        }
    `,
  ]
})
export class ForgotpasswordComponent implements OnInit {
  items: MenuItem[] = [];
  activeIndex: number = 0;
  constructor(private router: Router) { }
  navigateToNext(){
    this.router.navigate(['securityquestion'])
  }
  ngOnInit() {
    this.items = [
      {
        label: 'User Name',
        routerLink: 'username',
      },
      {
        label: 'security Question',
        routerLink: 'securityquestion',
      },
      {
        label: 'Change Password',
        routerLink: 'changepassword',
      },
      {
        label: 'Success',
        routerLink: 'successmessage',
      }
    ];
  }


}
