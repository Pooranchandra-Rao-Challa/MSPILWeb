import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VillageRoutingModule } from './village-routing.module';
import { VillageComponent } from './village.component';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { CalendarModule } from 'primeng/calendar';
import { ContextMenuModule } from 'primeng/contextmenu';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutoCompleteModule } from "primeng/autocomplete";
import { ChipsModule } from "primeng/chips";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { InputTextareaModule } from "primeng/inputtextarea";
import { InputSwitchModule } from 'primeng/inputswitch';
import {ToolbarModule} from 'primeng/toolbar';



@NgModule({
  declarations: [VillageComponent],
  imports: [
    CommonModule,
    VillageRoutingModule,
    TableModule,
	RatingModule,
	ButtonModule,
	SliderModule,
	InputTextModule,
	ToggleButtonModule,
	RippleModule,
	MultiSelectModule,
	DropdownModule,
	ProgressBarModule,
	ToastModule,
	DialogModule,
	ToolbarModule,
	ContextMenuModule,
	CalendarModule,
    AutoCompleteModule,
    ChipsModule,
    InputMaskModule,
    InputNumberModule,
    CascadeSelectModule,
    InputTextareaModule,
    InputSwitchModule,FormsModule,
	ReactiveFormsModule
  ]
})
export class VillageModule { }
