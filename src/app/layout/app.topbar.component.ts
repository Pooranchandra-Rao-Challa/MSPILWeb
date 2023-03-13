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
  app_config_dialog: boolean = false;
  lookup_dialog: boolean = false;
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
      { label: 'App Config', icon: 'pi pi-external-link', command: (e) => { this.app_config_dialog = true; this.submitLabel = 'Update Application Constants'; } },
      { label: 'Lookup', icon: 'pi pi-external-link', command: (e) => { this.lookup_dialog = true; this.submitLabel = 'Update lookups'; } },
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
