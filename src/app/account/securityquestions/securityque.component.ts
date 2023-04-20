import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';


export interface IHeader {
  field: string;
  header: string;
  label: string;
}

export interface SecurQuestion {
  value: number,
  name: string
}

export class SecurityDto {
  id? : string;
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
  securityDto: SecurityDto[] = [];
  selectedQuestion!: SecurQuestion;
  security!: SecurityDto;
  productDialog: boolean = false;
  submitted: boolean = true;
  constructor(
    private messageService: MessageService,
   
  ) { 
    this.securityquestions = [
      { value: 1, name: 'New York' },
      { value: 2, name: 'Rome' },
      { value: 3, name: 'London' },
      { value: 4, name: 'Istanbul' },
      {value: 5, name: 'Paris' }
    ];
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

saveProduct() {
        this.submitted = true;

        if(this.security.Answer?.trim()){
            if (this.security.id) {
                this.securityDto[this.findIndexById(this.security.id)] = this.security;                
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Updated', life: 3000});
            }
            else {
                // this.security.id = this.createId();
                // this.security.image = 'security-placeholder.svg';
                this.securityDto.push(this.security);
                this.messageService.add({severity:'success', summary: 'Successful', detail: 'Product Created', life: 3000});
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