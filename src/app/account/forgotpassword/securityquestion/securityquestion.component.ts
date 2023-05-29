import { SecurityService } from 'src/app/_services/security.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserQuestionDto } from 'src/app/_models/security';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-securityquestion',
  templateUrl: './securityquestion.component.html',
  styles: [
  ]
})
export class SecurityQuestionComponent implements OnInit {
  userQuestions: UserQuestionDto[] = []
  userName?: string;

  constructor(private router: Router,
    private securityService: SecurityService,
    private messageService: MessageService,
    private activatedRoute: ActivatedRoute) { }

  navigateToPrev() {
    this.router.navigate(['/forgotpassword/username']);
  }

  navigateToNext() {
    let flag = true;
    this.userQuestions.forEach(question => {
      if (flag)
        flag = question.answer == question.userAnswer;
    });
    if (flag)
      this.router.navigate(['/forgotpassword/changepassword'], { queryParams: { username: this.userName } })
    else this.messageService.add({ severity: 'error', key: 'myToast', summary: 'Error', detail: "Entered Answer Is Incorrect" });
  }

  ngOnInit(): void {
    this.userName = this.activatedRoute.snapshot.queryParams['username'];
    this.securityService.UserSecurityQuestions(this.userName!).subscribe({
      next: (resp) => {
        this.userQuestions = resp as unknown as UserQuestionDto[];
        if (this.userQuestions.length < 1) {
          this.messageService.add({ severity: 'error', key: 'myToast', summary: 'Error', detail: "Invalid User Name!" });
          this.navigateToPrev();
        }
      }
    })
  }

  onDisabled(): boolean {
    var securityAnswerCount = 0;
    this.userQuestions.forEach(question => {
      if (question.userAnswer) {
        securityAnswerCount = securityAnswerCount + 1;
      }
    });
    if (securityAnswerCount == 2) {
      return false;
    }
    else return true;
  }

}
