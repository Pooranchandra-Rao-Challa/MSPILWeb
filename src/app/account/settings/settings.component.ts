import { ThemeNotifier, THEMES } from 'src/app/_helpers/theme.notifier.service';
import { ThemeDto } from 'src/app/_models/security';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { SecureQuestionDto, UserQuestionDto } from 'src/app/_models/security';
import { JWTService } from 'src/app/_services/jwt.service';
import { SecurityService } from 'src/app/_services/security.service';
import { ConfirmedValidator } from 'src/app/_validators/confirmValidator';
import { BehaviorSubject } from 'rxjs';
import { ConfirmationDialogService } from 'src/app/_alerts/confirmationdialoug.service';
import { ConfirmationRequest } from 'src/app/_models/common';

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
  secureQuestions: BehaviorSubject<any> = new BehaviorSubject([]);
  oldSecurity: UserQuestionDto = {};
  security: UserQuestionDto = {};
  themeItems!: ThemeDropdownItems[];
  getSecureQuestions: SecureQuestionDto[] = []
  allSecureQuestions: SecureQuestionDto[] = []
  showDialog: boolean = false;
  submitted: boolean = true;
  qstnSubmitLabel: String = "Add";
  fbChangePassword!: FormGroup;
  themeDto: ThemeDto = {};
  userQuestions: UserQuestionDto[] = [];
  addFlag!: boolean;
  confirmationRequest: ConfirmationRequest = new ConfirmationRequest();

  constructor(
    private formbuilder: FormBuilder,
    private securityService: SecurityService,
    public layoutService: LayoutService,
    private jwtService: JWTService,
    private alertMessage: AlertMessage,
    private themeNotifier: ThemeNotifier,
    private confirmationDialogService: ConfirmationDialogService,) {
    this.themeDto.theme = this.jwtService.ThemeName ? this.jwtService.ThemeName : 'lara-light-indigo';
  }

  ngOnInit(): void {
    this.initGetSecureQuestions();
    this.getUserQuestionsAndAnswers();
    this.themeItems = THEMES;
    this.changePasswordForm();
  }

  getUserQuestionsAndAnswers() {
    this.securityService.UserSecurityQuestions(this.jwtService.GivenName).subscribe((resp) => {
      this.userQuestions = resp as unknown as UserQuestionDto[];
      this.filterSecureQuestions();
    });
  }

  filterSecureQuestions(security: UserQuestionDto = {}) {
    if (this.userQuestions && this.allSecureQuestions) {
      const filteredQuestions = this.allSecureQuestions.filter((secureQuestion) => {
        return this.userQuestions.findIndex((userQuestion) => userQuestion.question === secureQuestion.question) === -1 || secureQuestion.question === security.question;
      });
      this.secureQuestions.next(filteredQuestions);
    }
  }
  addSecurityQuestion() {
    this.security = {
      userId: this.jwtService.UserId,
    };
    this.submitted = false;
    this.qstnSubmitLabel = "Add";
    this.showDialog = true;
    this.addFlag = true;
    this.filterSecureQuestions();
  }

  initGetSecureQuestions() {
    this.securityService.GetSecureQuestions().subscribe((resp) => {
      this.allSecureQuestions = resp as unknown as SecureQuestionDto[];
      this.secureQuestions.next(this.allSecureQuestions);
      this.filterSecureQuestions();
    });
  }

  onChange(event: any) {
    this.security.questionId = this.allSecureQuestions[this.allSecureQuestions.findIndex(item => item.question === event.value)].questionId;
  }

  editSecurityQuestion(s: UserQuestionDto) {
    Object.assign(this.security, s);
    Object.assign(this.oldSecurity, s);
    this.qstnSubmitLabel = "Update";
    this.addFlag = false;
    this.showDialog = true;
    this.filterSecureQuestions(this.security);
  }

  deleteSecurityQuestion(userQuestionId: UserQuestionDto) {
    this.confirmationDialogService.comfirmationDialog(this.confirmationRequest).subscribe(userChoice => {
      if (userChoice) {
        this.securityService.DeleteSecurityQuestions([userQuestionId]).subscribe((resp) => {
          console.log(resp);
          if (resp) {
            this.alertMessage.displayAlertMessage(ALERT_CODES["SSESQ004"]);
            this.getUserQuestionsAndAnswers();
            this.filterSecureQuestions();
          }
          else {
            this.alertMessage.displayErrorMessage(ALERT_CODES["SSESQ005"]);
          }
        })
      }
    });
  }

  hideDialog() {
    this.showDialog = false;
    this.submitted = false;
  }

  saveSecurityQuestions() {
    this.submitted = true;
    if (this.security.answer?.trim() && this.security.questionId) {
      let selectedIndex = this.userQuestions.findIndex(value => value.question == this.oldSecurity.question)
      if (selectedIndex == -1) {
        this.userQuestions.push(this.security);
      } else {
        this.userQuestions[selectedIndex] = this.security;
      }
      this.clearSelection();
    }
  }

  clearSelection() {
    this.showDialog = false;
    this.security = {};
    this.oldSecurity = {};
    this.filterSecureQuestions();
  }

  onSubmit() {
    this.securityService.CreateSecurityQuestions(this.userQuestions).subscribe((resp) => {
      if (resp) {
        this.getUserQuestionsAndAnswers();
        this.alertMessage.displayAlertMessage(ALERT_CODES["SSESQ002"]);
      }
      else {
        this.alertMessage.displayErrorMessage(ALERT_CODES["SSESQ003"]);
      }
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

}
