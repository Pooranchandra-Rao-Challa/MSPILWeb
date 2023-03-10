import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { JWTService } from '../_services/jwt.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RG_ALPHA_ONLY } from '../_shared/regex';

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
  dialog: boolean = false;
  application_contsants!: FormGroup;
  submitLabel!: string;

  constructor(public layoutService: LayoutService, private jwtService: JWTService, private formbuilder: FormBuilder) {
    console.log(this.jwtService.GivenName)
    this.loggedInUser = this.jwtService.GivenName;
  }

  get FormControls() {
    return this.application_contsants.controls;
  }
  
  ngOnInit() {

    this.application_contsants = this.formbuilder.group({
      name:new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY)]),
      value:new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY)]),
    });
    
    this.items = [
      { label: 'Settings', icon: 'pi pi-external-link', routerLink: ['changepassword'] },
      { label: 'Application Constants', icon: 'pi pi-external-link', command: (e) => { this.dialog = true; this.submitLabel = 'Add Apllication Contstraints'; } },
      {
        label: 'Logout', icon: 'pi pi-sign-out', command: (e) => {
          console.log(this.jwtService.Logout());
          // logic
        }
      }
    ];
    

  }
  
  onSubmit() {

  }
}
