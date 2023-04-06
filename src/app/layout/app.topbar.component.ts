
import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { JWTService } from '../_services/jwt.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAX_LENGTH_20, RG_ALPHA_ONLY } from '../_shared/regex';
import { LookupDetailDto, LookupDetailViewDto, LookUpHeaderDto, LookupViewDto } from '../_models/applicationmaster';
import { AppMasterService } from '../_services/appmaster.service';
import { ApplicationConstantDto } from '../_models/common';
import { CommonService } from '../_services/common.service';
import {  Table } from 'primeng/table';
export class AppConfig {
  Name?: string;
  Value?: number;
  CreatedAt?: Date;
  CreatedBy?: string;
  UpdatedAt?: Date;
  UpdatedBy?: string;
}

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
  // standalone:true,
  // imports:[TableModule]
})
export class AppTopBarComponent {
  showlookup: boolean = false;
  items!: MenuItem[];
  setting_items!: MenuItem[];
  loggedInUser: String = "";
  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  @ViewChild('dtConfig') dtConfig!: Table;
  @ViewChild('lookupDetail') lookupDetail!: Table;

  lookup_dialog: boolean = false;
  submitLabel!: string;

  lookups: LookupViewDto[] = [];
  lookupDetails: LookupDetailViewDto[] = [];
  appConfigItems: ApplicationConstantDto[] = [];
  app_config_dialog: boolean = false;

  selectedConfig: { [s: number]: ApplicationConstantDto; } = {};
  selectedLookupDetail: { [s: number]: LookupDetailViewDto; } = {};

  constructor(public layoutService: LayoutService,
    private jwtService: JWTService,
    private formbuilder: FormBuilder,
    private appMasterservice: AppMasterService,
    private commomService: CommonService) {
    this.loggedInUser = this.jwtService.GivenName;
  }



  addLookup() {
    let data = {
      lookupDetailId: this.lookupDetails.length * -1,
      name:"",
      value:"",
      listingorder:undefined
    }
    this.lookupDetails.push(data)
    this.lookupDetail.editingRowKeys[data.lookupDetailId.toString()] = true;
    this.selectedLookupDetail[data.lookupDetailId] = data;
  }

  generateRow(lookupArray: LookupDetailDto = new LookupDetailDto()): FormGroup {
    return this.formbuilder.group({
      lookupId: [lookupArray.lookupId],
      lookupDetailId: [lookupArray.lookupDetailId],
      code: new FormControl(lookupArray.code, [Validators.required, Validators.maxLength(MAX_LENGTH_20)]),
      name: [lookupArray.name, (Validators.required)],
      remarks: [lookupArray.remarks],
      listingorder: [lookupArray.listingorder, (Validators.required)],
      isActive: [lookupArray.isActive],
    })
  }

  addAppConfig() {
    let data = {
      id: this.appConfigItems.length * -1,
      name:"",
      value:"",
    }
    this.appConfigItems.push(data)
    this.dtConfig.editingRowKeys[data.id.toString()] = true;
    this.selectedConfig[data.id] = data;
  }
  ngOnInit() {
    this.initAppConstants();
    this.initLookups();
    this.items = [
      { label: 'Settings', icon: 'pi pi-external-link', routerLink: ['changepassword'] },
      { label: 'App Config', icon: 'pi pi-external-link', command: (e) => { this.initAppConstants(); this.app_config_dialog = true; this.submitLabel = 'Update Application Constants'; } },
      { label: 'Lookup', icon: 'pi pi-external-link', command: (e) => { this.lookup_dialog = true; this.submitLabel = 'Update lookups'; } },
      {
        label: 'Logout', icon: 'pi pi-sign-out', command: (e) => {
          console.log(this.jwtService.Logout());
        }
      },

    ];
    this.setting_items = [
      { label: 'Green (Default)', icon: 'pi pi-external-link', command: () => this.changeTheme('lara-light-indigo', 'light'), },
      { label: 'Dark Green',      icon: 'pi pi-external-link', command: () => this.changeTheme('lara-dark-indigo', 'dark'), },
      { label: 'Light Blue',      icon: 'pi pi-external-link', command: () => this.changeTheme('lara-light-blue', 'light'), },
      { label: 'Dark Blue',       icon: 'pi pi-external-link', command: () => this.changeTheme('lara-dark-blue', 'dark'), },
      { label: 'Light Purple',    icon: 'pi pi-external-link', command: () => this.changeTheme('lara-light-purple', 'light'), },
      { label: 'Dark Purple',     icon: 'pi pi-external-link', command: () => this.changeTheme('lara-dark-purple', 'dark'), },
      { label: 'Light Teal',      icon: 'pi pi-external-link', command: () => this.changeTheme('lara-light-teal', 'light'), },
      { label: 'Dark Teal',       icon: 'pi pi-external-link', command: () => this.changeTheme('lara-dark-teal', 'dark'), },
    ];
  }

  changeTheme(theme: string, colorScheme: string) {
    const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
    const newHref = themeLink.getAttribute('href')!.replace(this.layoutService.config.theme, theme);
    this.layoutService.config.colorScheme
    this.replaceThemeLink(newHref, () => {
        this.layoutService.config.theme = theme;
        this.layoutService.config.colorScheme = colorScheme;
        this.layoutService.onConfigUpdate();
    });
  }

  replaceThemeLink(href: string, onComplete: Function) {
      const id = 'theme-css';
      const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
      const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

      cloneLinkElement.setAttribute('href', href);
      cloneLinkElement.setAttribute('id', id + '-clone');

      themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);

      cloneLinkElement.addEventListener('load', () => {
          themeLink.remove();
          cloneLinkElement.setAttribute('id', id);
          onComplete();
      });
  }


  getLookupDetailsByLookupId(lookupId:number) {
    this.appMasterservice.GetLookupDetailsforMenu(lookupId).subscribe((resp)=>{
      this.lookupDetails = resp as unknown as LookupDetailViewDto[];
    })
   }

  initLookups() {
    this.appMasterservice.GetlookUp().subscribe((resp) => {
      this.lookups = resp as unknown as LookupViewDto[];
    });
  }



  initAppConstants() {
    this.commomService.GetApplicationConstant().subscribe((resp) => {
      this.appConfigItems = resp as unknown as ApplicationConstantDto[];
    });
  }

  onConstantEditInit(config: ApplicationConstantDto) {
    this.selectedConfig[config.id!] = { ...config };
  }

  onConstantEditSave(config: ApplicationConstantDto, ri: number) {
    // saving that row item and update local object
    if(config.id! < 0 ) config.id = undefined;
    this.commomService.UpdateConstant(config).subscribe(resp=>{
      if(resp) this.initAppConstants();
    })

  }
  onConstantEditCancel(config: ApplicationConstantDto, ri: number) {
    if(Number(config.id!) < 0 ){
      this.appConfigItems.splice(ri,1);
    }else{
      this.appConfigItems[ri] = this.selectedConfig[config.id!];
    }
    delete this.selectedConfig[config.id!];
  }

  onLookupDetailEdit(lookupDetail:LookupDetailViewDto){
    this.selectedLookupDetail[lookupDetail.lookupDetailId!] = { ...lookupDetail };
  }

  onRowLookupDetailSave(lookupDetail:LookupDetailViewDto,ri:number){


  }
  onRowLookupDetailCancel(lookupDetail:LookupDetailViewDto,ri:number){
    if(Number(lookupDetail.lookupDetailId!) < 0 ){
      this.lookupDetails.splice(ri,1);
    }else{
      this.lookupDetails[ri] = this.selectedConfig[lookupDetail.lookupDetailId!];
    }
    delete this.selectedLookupDetail[lookupDetail.lookupDetailId!];

  }

}
