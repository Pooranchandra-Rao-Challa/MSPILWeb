import { SecurityService } from 'src/app/_services/security.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserQuestionDto } from 'src/app/_models/security';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-securityquestion',
  templateUrl: './securityquestion.component.html',
  styles: [
  ]
})
export class SecurityQuestionComponent implements OnInit {
  userQuestions: UserQuestionDto[] = []
  userName?:string;
  constructor(private router: Router,
    private securityService:SecurityService,
    private activatedRoute:ActivatedRoute) { }


  navigateToPrev(){
    this.router.navigate(['/forgotpassword/username']);
  }
  navigateToNext(){
    console.log(this.userQuestions);
    let flag = true;
    this.userQuestions.forEach(question => {
      if(flag)
        flag = question.answer?.toLowerCase() ==  question.userAnswer?.toLowerCase()
    });

    if(flag)
      this.router.navigate(['/forgotpassword/changepassword'],{ queryParams: { username: this.userName }})
  }
  ngOnInit(): void {
    this.userName = this.activatedRoute.snapshot.queryParams['username'];
    this.securityService.UserSecurityQuestions(this.userName!).subscribe({
      next: (resp) =>{
        this.userQuestions = resp as unknown as UserQuestionDto[];
      }
    })
  }

}