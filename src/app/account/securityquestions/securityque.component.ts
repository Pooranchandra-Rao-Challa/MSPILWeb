import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';


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
  id?: string;
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

  securityquestions: SecurQuestion[];
  selectedQuestion!: SecurQuestion;

  securityDto: SecurityDto[] = [];
  security!: SecurityDto;
  productDialog: boolean = false;
  submitted: boolean = true;

  constructor(
    private messageService: MessageService,

  ) {
    this.securityquestions = [
      { code: 1, name: 'What city were you born in?' },
      { code: 2, name: 'What is the name of your first pet?' },
      { code: 3, name: 'What is the title and artist of your favorite song?' },
      { code: 4, name: 'What is your astrological sign?' },
      { code: 5, name: 'What is your date of birth?' }
    ];
    this.selectedQuestion = this.securityquestions[0];
  }
  headers: IHeader[] = [
    { field: 'SecurityQuestions', header: 'SecurityQuestions', label: 'Security Questions' },
    { field: 'Answer', header: 'Answer', label: 'Answer' },

  ];

  openNew() {
    debugger
    this.security = {};
    this.submitted = false;
    this.productDialog = true;
  }
  ngOnInit(): void {
    // this.fillData();
  }

  fillData() {
    debugger
    for (var i of [1, 2]) {
      this.securityDto.push(
        {
          id: "one",
          SecurityQuestions: "Code",
          Answer: "name",
        }
      )
    }
    console.log(this.securityDto);
  }

  editProduct(security: SecurityDto) {
    debugger
    this.security = { ...security };
    this.productDialog = true;
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }



  onChange(event: any) {

    // let myIndex = this.securityquestions.findIndex(fruit => fruit.name === event.value);
    // debugger
    // this.securityquestions.splice(myIndex, 1);

    this.securityquestions.splice(this.securityquestions.findIndex(item => item.name === event.value), 1);

    console.log(this.securityquestions);
  }

  saveProduct() {
    debugger

    // this.deleteMsg(event);

    this.submitted = true;

    if (this.security.Answer?.trim()) {
      if (this.security.id) {
        this.securityDto[this.findIndexById(this.security.id)] = this.security;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
      }
      else {
        // this.security.id = this.createId();
        // this.security.image = 'security-placeholder.svg';
        this.securityDto.push(this.security);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
      }

      this.securityDto = [...this.securityDto];
      this.productDialog = false;
      this.security = {};
    }
  }

  findIndexById(id: string): number {
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