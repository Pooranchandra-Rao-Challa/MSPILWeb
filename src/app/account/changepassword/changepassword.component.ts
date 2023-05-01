import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import {  SecureQuestionDto } from 'src/app/_models/security';
import { SecurityService } from 'src/app/_services/security.service';
import { SecurityDto, SecurQuestion } from '../securityquestions/securityque.component';

export class ThemeDropdownItems {
  // UserName?: string
  Name?: string;
  Label?: string;
  icon?: string;
  Value?:string;
}
export class ChangePasswordDto {
  // UserName?: string
  CurrentPassword?: string
  NewPassword?: string
  ConfirmPassword?:string;
}


@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styles: [
  ]
})
export class ChangepasswordComponent implements OnInit {

  setting_items!: ThemeDropdownItems[];
  getSecureQuestions:SecureQuestionDto[] = []
  allSecureQuestions:SecureQuestionDto[] = []
  selectedQuestion!: SecurQuestion;
  securityDto: SecurityDto[] = [];

  changePassword: ChangePasswordDto ={}

  security!: SecurityDto;
  productDialog: boolean = false;
  submitted: boolean = true;
  qstnSubmitLabel: String = "Add";

  constructor(
    private messageService: MessageService,
    private formbuilder: FormBuilder,
    private securityService: SecurityService,
    public layoutService: LayoutService,
  ) {
    
   }
   openNew() {
    debugger
    this.security = {};
    this.submitted = false;
    this.qstnSubmitLabel = "Add";
    this.productDialog = true;
  }
  initGetSecureQuestions() {
    this.securityService.GetSecureQuestions().subscribe((resp) => {
      this.getSecureQuestions = resp as unknown as SecureQuestionDto[];
      this.allSecureQuestions = [...this.getSecureQuestions];
    });
  }

  ngOnInit(): void {
    this.initGetSecureQuestions();

    this.setting_items = [
      { Label: 'Green (Default)', icon: 'pi pi-external-link', Name: 'lara-light-indigo' },
      { Label: 'Dark Green',      icon: 'pi pi-external-link', Name: 'lara-dark-indigo' },
      { Label: 'Light Blue',      icon: 'pi pi-external-link', Name: 'lara-light-blue' },
      { Label: 'Dark Blue',       icon: 'pi pi-external-link', Name: 'lara-dark-blue' },
      { Label: 'Light Purple',    icon: 'pi pi-external-link', Name: 'lara-light-purple' },
      { Label: 'Dark Purple',     icon: 'pi pi-external-link', Name: 'lara-dark-purple'},
      { Label: 'Light Teal',      icon: 'pi pi-external-link', Name: 'lara-light-teal'},
      { Label: 'Dark Teal',       icon: 'pi pi-external-link', Name: 'lara-dark-teal'},
    ];
  }

  

  onDropChange(event: any) {
    debugger
    const dropvalue = event.value;
    console.log(dropvalue);
    this.changeTheme(dropvalue);
  }

  changeTheme(theme: string) {
    
    const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
    const newHref = themeLink.getAttribute('href')!.replace(this.layoutService.config.theme, theme);
    this.layoutService.config.colorScheme
    this.replaceThemeLink(newHref, () => {
        this.layoutService.config.theme = theme;
        // this.layoutService.config.colorScheme = colorScheme;
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

  editProduct(security: SecurityDto) {
    debugger
    this.getSecureQuestions = [...this.allSecureQuestions]
    this.security = { ...security };
    this.qstnSubmitLabel = "Update";
    this.productDialog = true;
  }

  deleteProduct(question: String){
    this.securityDto.splice(this.securityDto.findIndex(item => item.SecurityQuestions === question), 1);
    this.securityDto = [...this.securityDto];
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }




  onChange(event: any) {

    // let myIndex = this.securityquestions.findIndex(fruit => fruit.name === event.value);
    // debugger
    // this.securityquestions.splice(myIndex, 1);
    this.security.id = this.getSecureQuestions[this.getSecureQuestions.findIndex(item => item.question === event.value)].questionId;
    this.getSecureQuestions.splice(this.getSecureQuestions.findIndex(item => item.question === event.value), 1);

    console.log(this.getSecureQuestions);
  }

  saveProduct() {
    debugger

    // this.deleteMsg(event);

    this.submitted = true;

    if (this.security.Answer?.trim()) {
      if (this.security.id) {
        if(this.findIndexById(this.security.id) >= 0){
          this.securityDto[this.findIndexById(this.security.id)] = this.security;
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
        }
        else {
          // this.security.id = this.createId();
          // this.security.image = 'security-placeholder.svg';
          this.securityDto.push(this.security);
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
        }
      }
      

      this.securityDto = [...this.securityDto];
      this.productDialog = false;
      this.security = {};
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.securityDto.length; i++) {
      if (this.securityDto[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  }

}
