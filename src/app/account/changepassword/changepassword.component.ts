import { ThemeDto } from './../../_models/security';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { SecureQuestionDto, UserQuestionDto } from 'src/app/_models/security';
import { JWTService } from 'src/app/_services/jwt.service';
import { SecurityService } from 'src/app/_services/security.service';
import { ConfirmedValidator } from 'src/app/_validators/confirmValidator';
import { SecurityDto, SecurQuestion } from '../securityquestions/securityque.component';

export class ThemeDropdownItems {
  // UserName?: string
  Name?: string;
  Label?: string;
  icon?: string;
  Value?: string;
}
export class ChangePasswordDto {
  // UserName?: string
  CurrentPassword?: string
  NewPassword?: string
  ConfirmPassword?: string;
}

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styles: [
  ]
})
export class ChangepasswordComponent implements OnInit {
  setting_items!: ThemeDropdownItems[];
  getSecureQuestions: SecureQuestionDto[] = []
  allSecureQuestions: SecureQuestionDto[] = []
  selectedQuestion!: SecurQuestion;
  securityDto: SecurityDto[] = [];
  // changePassword: ChangePasswordDto = {}
  security!: SecurityDto;
  showDialog: boolean = false;
  submitted: boolean = true;
  qstnSubmitLabel: String = "Add";
  fbChangePassword!: FormGroup;
  themeDto: ThemeDto = {};
  userQuestions: UserQuestionDto[] = [];

  constructor(
    private messageService: MessageService,
    private formbuilder: FormBuilder,
    private securityService: SecurityService,
    public layoutService: LayoutService,
    private jwtService: JWTService,
    private alertMessage: AlertMessage
  ) {
    debugger
    this.themeDto.theme = 'lara-light-indigo';
   }

  getUserQuestionsAndAnswers() {
    this.securityService.UserSecurityQuestions(this.jwtService.GivenName).subscribe({
      next: (resp) => {
        this.userQuestions = resp as unknown as UserQuestionDto[];
        this.userQuestions = this.userQuestions.map((value) => ({
          id: value.userId,
          SecurityQuestions: value.question,
          Answer: value.answer
        })) as any;
        this.securityDto = this.userQuestions as any;
      }
    });
  }

  openNew() {
    this.security = {};
    this.submitted = false;
    this.qstnSubmitLabel = "Add";
    this.showDialog = true;
  }

  initGetSecureQuestions() {
    this.securityService.GetSecureQuestions().subscribe((resp) => {
      this.getSecureQuestions = resp as unknown as SecureQuestionDto[];
      this.allSecureQuestions = [...this.getSecureQuestions];
    });
  }

  ngOnInit(): void {
    this.getUserQuestionsAndAnswers();
    this.initGetSecureQuestions();
    this.setting_items = [
      { Label: 'Green (Default)', icon: 'pi pi-external-link', Name: 'lara-light-indigo' },
      { Label: 'Dark Green', icon: 'pi pi-external-link', Name: 'lara-dark-indigo' },
      { Label: 'Light Blue', icon: 'pi pi-external-link', Name: 'lara-light-blue' },
      { Label: 'Dark Blue', icon: 'pi pi-external-link', Name: 'lara-dark-blue' },
      { Label: 'Light Purple', icon: 'pi pi-external-link', Name: 'lara-light-purple' },
      { Label: 'Dark Purple', icon: 'pi pi-external-link', Name: 'lara-dark-purple' },
      { Label: 'Light Teal', icon: 'pi pi-external-link', Name: 'lara-light-teal' },
      { Label: 'Dark Teal', icon: 'pi pi-external-link', Name: 'lara-dark-teal' },
    ];
    this.changePasswordForm();
  }

  changePasswordForm() {
    this.fbChangePassword = this.formbuilder.group({
      password: new FormControl('', Validators.required),
      newPassword: new FormControl('', Validators.required),
      confirmPassword: new FormControl('', Validators.required)
    }, {
      validator: ConfirmedValidator('newPassword', 'confirmPassword')
    });
  }

  get FormControls() {
    return this.fbChangePassword.controls;
  }

  onChangePassword() {
    this.securityService.ChangePassword(this.fbChangePassword.value).subscribe(resp => {
      var message = resp as any;
      this.alertMessage.displayAlertMessage(message);
      this.fbChangePassword.reset();
    });
  }

  onDropChange(event: any) {
    const dropvalue = event.value;
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

  editSecurityQuestion(security: SecurityDto) {
    this.getSecureQuestions = [...this.allSecureQuestions]
    this.security = { ...security };
    this.qstnSubmitLabel = "Update";
    this.showDialog = true;
  }

  deleteSecurityQuestion(question: String) {
    this.securityDto.splice(this.securityDto.findIndex(item => item.SecurityQuestions === question), 1);
    this.securityDto = [...this.securityDto];
  }

  hideDialog() {
    this.showDialog = false;
    this.submitted = false;
  }

  onChange(event: any) {
    // let myIndex = this.securityquestions.findIndex(fruit => fruit.name === event.value);
    // this.securityquestions.splice(myIndex, 1);
    this.security.id = this.getSecureQuestions[this.getSecureQuestions.findIndex(item => item.question === event.value)].questionId;
    this.getSecureQuestions.splice(this.getSecureQuestions.findIndex(item => item.question === event.value), 1);
  }

  saveSecurityQuestions() {
    // this.deleteMsg(event);
    this.submitted = true;
    if (this.security.Answer?.trim()) {
      if (this.security.id) {
        if (this.findIndexById(this.security.id) >= 0) {
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
      this.showDialog = false;
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

  saveTheme(){
    this.securityService.UpdateTheme(this.themeDto).subscribe((resp) => {
      if (resp) {
        this.alertMessage.displayAlertMessage(ALERT_CODES["SSECT001"]);
      }
    });
  }

}
