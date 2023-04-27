import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import {  SecureQuestionDto } from 'src/app/_models/security';
import { SecurityService } from 'src/app/_services/security.service';
import { SecurityDto, SecurQuestion } from '../securityquestions/securityque.component';


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
