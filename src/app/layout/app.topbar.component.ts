import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { JWTService } from '../_services/jwt.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];
    loggedInUser: String = "";
    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(public layoutService: LayoutService,private jwtService:JWTService) {
      console.log(this.jwtService.GivenName)
      this.loggedInUser = this.jwtService.GivenName;
     }

    Logout(){
      this.jwtService.Logout();
    }
}
