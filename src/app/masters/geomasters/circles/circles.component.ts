import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CustomerService } from 'src/app/demo/service/customer.service';
import { ProductService } from 'src/app/demo/service/product.service';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CirclesViewDto } from 'src/app/_models/geomodels';
import { GeoMasterService } from 'src/app/_services/geomaster.service';
import { CommonService } from 'src/app/_services/common.service';
import { JWTService } from 'src/app/_services/jwt.service';


@Component({
  selector: 'app-circles',
  templateUrl: './circles.component.html',
  providers: [MessageService, ConfirmationService]
})
export class CirclesComponent implements OnInit {

  cities:any=[];
  selectedDrop: any;
  filter:any;
  circles: CirclesViewDto[] = [];
  display: boolean = false;
  loading: boolean = true;
    circleForm: any;
    

    constructor(private customerService: CustomerService,
        private productService: ProductService,
        private geoMasterService: GeoMasterService,
        private commonService: CommonService,
        public jwtService: JWTService,
        private formbuilder:FormBuilder) {
     }
    ngOnInit() {
        this.geoMasterService.GetCircles().subscribe((resp) => {
            this.circles = resp as unknown as CirclesViewDto[]
          })
        this.customerService.getCustomersLarge().then(customers => {
            this.loading = false;
        });
        this.circleForm = this.formbuilder.group({
            division: ['', Validators.required],
            circleName: ['', Validators.required],
            inchargeName: ['', Validators.required],
            order: ['', Validators.required],
            isActive: [this.valSwitch, Validators.required],
            circleCode: ['', Validators.required],
            inchargePhoneNo: ['', Validators.required],
            address: ['', Validators.required]
        });
    }
    onSubmit() {
        if (this.circleForm.valid) {
            console.log(this.circleForm.value)
            alert("adedd")
          // submit the form
        } else {
          this.circleForm.markAllAsTouched();
        }
      }
    get f(){
       return this.circleForm.controls
     }
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }
    valSwitch: boolean = true;
          
}


