import { ThemeNotifier, THEMES } from 'src/app/_helpers/theme.notifier.service';
import { ThemeDto } from 'src/app/_models/security';
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
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styles: [
  ]
})
export class SettingsComponent implements OnInit {
  themeItems!: ThemeDropdownItems[];
  getSecureQuestions: SecureQuestionDto[] = []
  allSecureQuestions: SecureQuestionDto[] = []
  // selectedQuestion!: SecurQuestion;
  // userQuestions: UserQuestionDto[] = [];
  // changePassword: ChangePasswordDto = {}
  security!: UserQuestionDto;
  showDialog: boolean = false;
  submitted: boolean = true;
  qstnSubmitLabel: String = "Add";
  fbChangePassword!: FormGroup;
  themeDto: ThemeDto = {};
  userQuestions: UserQuestionDto[] = [];
  addFlag!: boolean;

  constructor(
    private messageService: MessageService,
    private formbuilder: FormBuilder,
    private securityService: SecurityService,
    public layoutService: LayoutService,
    private jwtService: JWTService,
    private alertMessage: AlertMessage,
    private themeNotifier: ThemeNotifier
  ) {
    this.themeDto.theme = this.jwtService.ThemeName ? this.jwtService.ThemeName : 'lara-light-indigo';
  }

  ngOnInit(): void {
    this.initGetSecureQuestions();
    this.getUserQuestionsAndAnswers();
    this.themeItems = THEMES;
    this.changePasswordForm();
  }

  getUserQuestionsAndAnswers() {
    this.securityService.UserSecurityQuestions(this.jwtService.GivenName).subscribe({
      next: (resp) => {
        this.userQuestions = resp as unknown as UserQuestionDto[];
        console.log( this.userQuestions);

        this.filterSecurityQuestion(this.userQuestions);
      }
    });
  }

  filterSecurityQuestion(userQuestions: UserQuestionDto[]) {
    this.userQuestions.forEach(userQuestion => {
      this.getSecureQuestions = this.getSecureQuestions.filter(x => x.question != userQuestion.question) as UserQuestionDto[];
    });
  }

  addSecurityQuestion() {
    this.security = {};
    this.submitted = false;
    this.qstnSubmitLabel = "Add";
    this.showDialog = true;
    this.addFlag = true;
  }

  initGetSecureQuestions() {
    this.securityService.GetSecureQuestions().subscribe((resp) => {
      this.getSecureQuestions = resp as unknown as SecureQuestionDto[];
      this.allSecureQuestions = [...this.getSecureQuestions];
    });
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

  changeTheme(themeName: string) {
    this.themeNotifier.notifyChangeTheme(themeName);
  }

  editSecurityQuestion(security: UserQuestionDto) {
    this.onFilterSelection(security);
    this.security = { ...security };
    this.qstnSubmitLabel = "Update";
    this.showDialog = true;
    this.addFlag = false;
  }

  deleteSecurityQuestion(question: String) {
    this.userQuestions.splice(this.userQuestions.findIndex(item => item.question === question), 1);
    this.userQuestions = [...this.userQuestions];
  }

  hideDialog() {
    this.showDialog = false;
    this.submitted = false;
  }

  saveSecurityQuestions() {
    this.submitted = true;
    if (this.security.userQuestionId) {
      if (this.findIndexById(this.security.userQuestionId) >= 0) {
        this.userQuestions[this.findIndexById(this.security.userQuestionId)] = this.security;
      }
    }
    else {
      this.userQuestions.push(this.security);
    }
    this.onFilterSelection(this.security);
    this.userQuestions = [...this.userQuestions];
    this.showDialog = false;
    this.security = {};
  }

  onFilterSelection(security: UserQuestionDto) {
    if (!this.addFlag) {
      let tempData = this.getSecureQuestions.filter(x => x.question == security.question) as UserQuestionDto[];
      if (tempData.length == 0) {
        let params = {
          questionId: security.questionId,
          question: security.question
        }
        this.getSecureQuestions.push(params);
      }
    }
    else {
      this.getSecureQuestions.splice(this.getSecureQuestions.findIndex(item => item.question === this.security.question), 1);
    }
  }

  findIndexById(id: number): number {
    let index = -1;
    for (let i = 0; i < this.userQuestions.length; i++) {
      if (this.userQuestions[i].userQuestionId === id) {
        index = i;
        break;
      }
    }
    return index;
  }

  saveTheme() {
    this.securityService.UpdateTheme(this.themeDto).subscribe((resp) => {
      if (resp) {
        this.alertMessage.displayAlertMessage(ALERT_CODES["SSECT001"]);
        console.log(this.themeDto.theme);
        this.jwtService.ThemeName = this.themeDto.theme || '';
        this.changeTheme(this.jwtService.ThemeName);
      }
    });
  }

  onSubmit() {
    this.securityService.CreateSecurityQuestions(this.userQuestions).subscribe((resp) => {
      if (resp) {
        this.getUserQuestionsAndAnswers();
        this.alertMessage.displayAlertMessage(ALERT_CODES["SSESQ002"]);
      }
    });
  }

}
