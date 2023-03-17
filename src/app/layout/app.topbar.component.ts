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
  templateUrl: './app.topbar.component.html'
})


export class AppTopBarComponent {
  showlookup: boolean = false;
  items!: MenuItem[];
  loggedInUser: String = "";
  @ViewChild('menubutton') menuButton!: ElementRef;

  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

  @ViewChild('topbarmenu') menu!: ElementRef;

  lookup_dialog: boolean = false;
  application_contsants!: FormGroup;
  submitLabel!: string;

  lookUpFrom!: FormArray;
  appConfigFrom!: FormArray;
  lookupCode: LookupViewDto[] = [];
  lookupMenuCode: LookUpHeaderDto[] = [];

  lookupDetails: LookupDetailDto[] = [];
  appConfig: ApplicationConstantDto[] = [];
  app_config_dialog: boolean = false;

  clonedProducts: { [s: string]: ApplicationConstantDto; } = {};


  constructor(public layoutService: LayoutService, private jwtService: JWTService, private formbuilder: FormBuilder, private appMasterservice: AppMasterService, private commomService: CommonService) {
    console.log(this.jwtService.GivenName)
    this.loggedInUser = this.jwtService.GivenName;
  }
  get FormControls() {
    return this.application_contsants.controls;
  }
  initLookupCode() {
    debugger
    this.appMasterservice.GetlookUp().subscribe((resp) => {
      this.lookupCode = resp as unknown as LookupViewDto[];
    });
  }

  /* Form Array For lookup Details */
  faLookupFrom(): FormArray {
    return this.application_contsants.get('lookUpArray') as FormArray;
  }
  formArrayControls(i: number, formControlName: string) {
    return this.faLookupFrom().controls[i].get(formControlName);
  }
  addLookup() {
    this.lookUpFrom = this.application_contsants.get("lookupArray") as FormArray
    this.faLookupFrom().push(this.generateRow());
    this.showlookup = true;
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
  appConfigGeneraterow(appArray: ApplicationConstantDto = new ApplicationConstantDto()): FormGroup {
    return this.formbuilder.group({
      Name: [appArray.Name],
      Value: [appArray.Value],
    })
  }


  addAppConfig() {

    this.appConfigFrom = this.application_contsants.get("appArray") as FormArray
    this.appConfigFrom.push(this.appConfigGeneraterow())
  }
  ngOnInit() {
debugger
    this.initAppConstants();
    this.initLookupCode();
    this.initLookupMenuCode();
    this.application_contsants = this.formbuilder.group({
      lookUpArray: this.formbuilder.array([]),
      // name:new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY)]),
      code: ['', (Validators.required)],
      value: new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY)]),
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

  getLookupDetailsByLookupId(lookupId: number) {
    debugger
    this.appMasterservice.GetLookupDetailsforMenu(lookupId).subscribe((resp) => {
      if (resp) {
        this.lookupDetails = resp as unknown as LookupDetailDto[];
        // this.addLookup();
        this.faLookupFrom().clear();
        if (this.lookupDetails.length > 0) {
          this.lookupDetails.forEach((lookupDetail) => {
            this.faLookupFrom().push(this.generateRow(lookupDetail));
          });
          this.showlookup = true;
        }
        else {
          this.addLookup();
        }

      }
    });
  }

  initLookupMenuCode() {
    debugger
    this.appMasterservice.GetLookupsforMenu().subscribe((resp) => {
      this.lookupMenuCode = resp as unknown as LookUpHeaderDto[];
    });
  }

  initAppConstants() {
    debugger
    this.commomService.GetApplicationConstant().subscribe((resp) => {
      this.appConfig = resp as unknown as ApplicationConstantDto[];

      console.log(this.appConfig);
      
    });
  }

  onRowEditInit(appConfig: ApplicationConstantDto) {
    // this.clonedProducts[appConfig.Id] = {...appConfig};
}




  onSubmit() {

  }
}
