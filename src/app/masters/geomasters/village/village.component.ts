import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Customer, Representative } from 'src/app/demo/api/customer';
import { CustomerService } from 'src/app/demo/service/customer.service';
import { Product } from 'src/app/demo/api/product';
import { ProductService } from 'src/app/demo/service/product.service';
import { Table } from 'primeng/table';
import { MessageService, ConfirmationService } from 'primeng/api';
import { SortEvent } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-village',
  templateUrl: './village.component.html',
  styleUrls: ['./village.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class VillageComponent implements OnInit {

  cities:any=[];
  selectedDrop: any;

  showDialog() {
    this.display = false;
}

  display: boolean = false;


   customers1: Customer[] = [];

    customers2: Customer[] = [];

    customers3: Customer[] = [];

    selectedCustomers1: Customer[] = [];

    selectedCustomer: Customer = {};

    representatives: Representative[] = [];

    statuses: any[] = [];

    products: Product[] = [];

    // cols: any[];

    rowGroupMetadata: any;

    activityValues: number[] = [0, 100];

    isExpanded: boolean = false;

    idFrozen: boolean = false;

    loading: boolean = true;
    

    @ViewChild('filter') filter!: ElementRef;

    

    constructor(private customerService: CustomerService,
              private productService: ProductService,
              private formbuilder:FormBuilder) {



      this.cities = [
        { label: 'New York', value: { id: 1, name: 'New York', code: 'NY' } },
        { label: 'Rome', value: { id: 2, name: 'Rome', code: 'RM' } },
        { label: 'London', value: { id: 3, name: 'London', code: 'LDN' } },
        { label: 'Istanbul', value: { id: 4, name: 'Istanbul', code: 'IST' } },
        { label: 'Paris', value: { id: 5, name: 'Paris', code: 'PRS' } }
    ];
     }

     valSwitch:boolean = false;
     villageform!: FormGroup;
    ngOnInit() {
        this.customerService.getCustomersLarge().then(customers => {
            this.customers1 = customers;
            this.loading = false;

            // @ts-ignore
            this.customers1.forEach(customer => customer.date = new Date(customer.date));
        });
        
        this.customerService.getCustomersLarge().then(customers => this.customers3 = customers);
      

        this.villageform = this.formbuilder.group({
            division: ['', Validators.required],
            circle: ['', Validators.required],
            section: ['', Validators.required],
            target: ['', Validators.required],
            district: ['', Validators.required],
            mandal: ['', Validators.required],
            address: ['', Validators.required],
            PinCode:['', Validators.required],
            code: ['', Validators.required],
            name: ['', Validators.required],
            inchargeName: ['',],
            inchargePhoneNo: ['',],
            distance: ['', Validators.required],
            divertedDistance: ['', Validators.required],
            noOfEBServices: ['', Validators.required],
            TPTRate: ['', Validators.required],
            circleCode: ['', Validators.required],
            cultivatableArea: ['', Validators.required],
            totalGeographicArea: ['', Validators.required],
            irrigationArea: ['', Validators.required],
            dryArea: ['', Validators.required],
            suitableAreaforCane: ['', Validators.required],
            notSuitable: ['', Validators.required],
            ord: ['', Validators.required],
            isActive: [ Validators.required],
        });



        
    }
    customSort(event: SortEvent) {
       
    }
    onSort() {
        this.updateRowGroupMetaData();
    }

    updateRowGroupMetaData() {
        this.rowGroupMetadata = {};

        if (this.customers3) {
            for (let i = 0; i < this.customers3.length; i++) {
                const rowData = this.customers3[i];
                const representativeName = rowData?.representative?.name || '';

                if (i === 0) {
                    this.rowGroupMetadata[representativeName] = { index: 0, size: 1 };
                }
                else {
                    const previousRowData = this.customers3[i - 1];
                    const previousRowGroup = previousRowData?.representative?.name;
                    if (representativeName === previousRowGroup) {
                        this.rowGroupMetadata[representativeName].size++;
                    }
                    else {
                        this.rowGroupMetadata[representativeName] = { index: i, size: 1 };
                    }
                }
            }
        }
    }


    formatCurrency(value: number) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

 



    onSubmit(){
        console.log(this.villageform.value)
    }

    get f(){
        return this.villageform.controls
      }


    

    
}
