import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { JWTService } from '../_services/jwt.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAX_LENGTH_20, RG_ALPHA_ONLY } from '../_shared/regex';
import { LookupDetailViewDto, LookupViewDto } from '../_models/applicationmaster';
import { AppMasterService } from '../_services/appmaster.service';



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
  showlookup: boolean = true;
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

  lookupDetails: LookupDetailViewDto= new LookupDetailViewDto();
  appConfig: AppConfig[] = [];
  app_config_dialog: boolean = false;
  constructor(public layoutService: LayoutService, private jwtService: JWTService, private formbuilder: FormBuilder,private appMasterservice: AppMasterService,) {
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

     /* Form Array For hgl Details */
     lookupFrom(): FormArray {
      return this.application_contsants.get('lookupArray') as FormArray;
    }

    formArrayControls(i: number, formControlName: string) {
      return this.lookupFrom().controls[i].get(formControlName);
    }

    generaterow(lookupArray: LookupDetailViewDto = new LookupDetailViewDto()): FormGroup {
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
    appConfigGeneraterow(appArray: AppConfig = new AppConfig()): FormGroup {
      return this.formbuilder.group({
        Name: [appArray.Name],
        Value: [appArray.Value],
      })
    }

    addLookup(){
      this.showlookup= true;
      this.lookUpFrom = this.application_contsants.get("lookupArray") as FormArray  
      this.lookUpFrom.push(this.generaterow())
    }
    addAppConfig(){
      
      this.appConfigFrom = this.application_contsants.get("appArray") as FormArray  
      this.appConfigFrom.push(this.appConfigGeneraterow())
    }
  ngOnInit() {

    this.fillData();
    this.initLookupCode();
    this.application_contsants = this.formbuilder.group({
      lookupArray: this.formbuilder.array([]),
      // name:new FormControl('', [Validators.required, Validators.pattern(RG_ALPHA_ONLY)]),
      code: ['', (Validators.required)],
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

  getLookupDetailsByLookupId(code: number) {
    debugger
    this.appMasterservice.GetlookupDetails(code).subscribe((resp) => {
      if (resp) {
        this.lookupDetails = resp as unknown as LookupDetailViewDto;
        // this.branches = this.bank.branches as unknown as BranchDto[];
      }
    });
  }

  fillData() {
    for (var i of [1, 2]) {
      this.appConfig.push(
        {
          Name: 'DocNo' + i,
          Value: i,
          CreatedAt: new Date(),
          CreatedBy: 'CreatedBy' + i,
          UpdatedAt: new Date(),
          UpdatedBy: 'UpdatedBy' + i,
        }
      )
    }
  }

  
  onSubmit() {

  }
}
