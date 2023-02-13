
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Table } from 'primeng/table/table';
import { JWTService } from 'src/app/_services/jwt.service';

@Component({
  selector: 'app-planttype',
  templateUrl: './planttype.component.html',

})
export class PlanttypeComponent implements OnInit {
  display: boolean = false;
  showDialog: boolean = false;
  plant: [] = [];
  loading: boolean = false;
  fbplanttype!: FormGroup;
  filter: any;
  submitLabel!: string;
  addFlag: boolean = true;
  valSwitch: boolean = true;

  constructor(private formbuilder: FormBuilder,
    public jwtService: JWTService,
  ) {

  } Initloantype() {
    this.fbplanttype.reset();
    this.submitLabel = "Add PlantType";
    this.addFlag = true;
    this.display = true;
  }

  get FormControls() {
    return this.fbplanttype.controls;
  }

  ngOnInit() {
    this.fbplanttype = this.formbuilder.group({
      divisionId: [null],
      code: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z0-9]+$/)]),
      name: new FormControl('', [Validators.required, Validators.pattern(('[a-zA-Z ]*'))]),
      estmatedton: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      loaneligible: new FormControl('', [Validators.required, Validators.pattern(/^\d+$/)]),
      isActive: new FormControl(true,),
    });
  }

  onSubmit() {
    if (this.fbplanttype.valid) {
        console.log(this.fbplanttype.value)
    }
    else {
      // alert("please fill the fields")
      this.fbplanttype.markAllAsTouched();
    }
  }

  onGlobalFilter(table: Table, event: Event) {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  clear(table: Table) {
    table.clear();
    this.filter.nativeElement.value = '';
  } 
}
