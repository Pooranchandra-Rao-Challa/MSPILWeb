import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, observable, Observable } from 'rxjs';
import { AlertMessage, ALERT_CODES } from 'src/app/_alerts/alertMessage';
import { SecureQuestionDto, UserQuestionDto } from 'src/app/_models/security';
import { JWTService } from 'src/app/_services/jwt.service';
import { SecurityService } from 'src/app/_services/security.service';

export interface IHeader {
  field: string;
  header: string;
  label: string;
}

export interface SecurQuestion {
  code: number,
  name: string
}

export class SecurityDto {
  id?: number;
  SecurityQuestions?: string;
  Answer?: string;
}

@Component({
  selector: 'app-securityque',
  templateUrl: './securityque.component.html',
  styles: [
    `
        :host ::ng-deep .p-dialog .product-image {
            width: 150px;
            margin: 0 auto 2rem auto;
            display: block;
        }
    `,
  ],
})
export class SecurityQueComponent implements OnInit {
  getSecureQuestions: SecureQuestionDto[] = [];
  secureQuestions: BehaviorSubject<any> = new BehaviorSubject([]);
  securityDto: SecurityDto[] = [];
  oldSecurity: SecurityDto = {};
  security: SecurityDto = {};
  productDialog: boolean = false;
  submitted: boolean = true;
  qstnSubmitLabel: String = "Add";

  constructor(private securityService: SecurityService,
    private alertMessage: AlertMessage,
    private jwtService: JWTService,
    private router: Router,) { }

  ngOnInit(): void {
    this.initGetSecureQuestions();
  }

  openNew() {
    this.security = {};
    this.submitted = false;
    this.qstnSubmitLabel = "Add";
    this.productDialog = true;
  }

  initGetSecureQuestions() {
    this.securityService.GetSecureQuestions().subscribe((resp) => {
      this.getSecureQuestions = resp as unknown as SecureQuestionDto[];
      this.secureQuestions.next(this.getSecureQuestions);
    });
  }

  editProduct(security: SecurityDto) {
    Object.assign(this.security, security);
    Object.assign(this.oldSecurity, security);
    this.qstnSubmitLabel = "Update";
    this.productDialog = true;
    this.resetSecureQuestions(this.security);
  }

  deleteProduct(question: String) {
    this.securityDto.splice(this.securityDto.findIndex(item => item.SecurityQuestions === question), 1);
    this.resetSecureQuestions();
  }

  resetSecureQuestions(security: SecurityDto = {}) {
    let test = this.getSecureQuestions.filter((value => this.securityDto.findIndex(question => question.SecurityQuestions === value.question) == -1 || value.question === security.SecurityQuestions));
    this.secureQuestions.next(test);
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  onChange(event: any) {
    this.security.id = this.getSecureQuestions[this.getSecureQuestions.findIndex(item => item.question === event.value)].questionId;
  }

  clearSelection() {
    this.productDialog = false;
    this.security = {};
    this.oldSecurity = {};
    this.resetSecureQuestions();
  }

  saveQuestion() {
    this.submitted = true;
    if (this.security.Answer?.trim() && this.security.id) {
      let selectedIndex = this.securityDto.findIndex(value => value.SecurityQuestions == this.oldSecurity.SecurityQuestions);
      if (selectedIndex == -1) {
        this.securityDto.push(this.security);
      } else {
        this.securityDto[selectedIndex] = this.security;
      }
      this.clearSelection();
    }
    
  }

  onSubmit() {
    debugger
    const username = this.jwtService.GivenName;
    const userId = this.jwtService.UserId;
    const createUserQuestions: UserQuestionDto[] = this.securityDto.map(security => {
      return {
        question: security.SecurityQuestions,
        answer: security.Answer,
        username: username,
        userId: userId,
        questionId: security.id,
      };
    });
    this.securityService
      .CreateSecurityQuestions(createUserQuestions)
      .subscribe((resp) => {
        if (resp) {
          this.alertMessage.displayAlertMessage(ALERT_CODES["SCUQ001"]);
          this.securityDto = [];
          this.router.navigate(['./dashboard']);
        }
        else {
          this.alertMessage.displayErrorMessage(ALERT_CODES["SCUQ002"]);
        }
      })
  }

}
