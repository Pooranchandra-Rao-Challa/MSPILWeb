import { FloatLabelDemoComponent } from './../demo/components/uikit/floatlabel/floatlabeldemo.component';
import { JWTService } from 'src/app/_services/jwt.service';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

  model: any[] = [];

  constructor(public layoutService: LayoutService, private jwtService: JWTService) { }

  GroupPermission(groupName: string): boolean {
    switch (groupName) {
      case 'Security':
        return this.jwtService.Permissions.CanViewUsers || this.jwtService.Permissions.CanViewRoles
      case 'Masters':
        return this.GroupPermission('Geo Masters') || this.GroupPermission('Bill Masters')
      case 'Geo Masters':
        return this.jwtService.Permissions.CanViewStates || this.jwtService.Permissions.CanViewDistricts
          || this.jwtService.Permissions.CanViewMandals || this.jwtService.Permissions.CanViewDivisions
          || this.jwtService.Permissions.CanViewCircles || this.jwtService.Permissions.CanViewSections
          || this.jwtService.Permissions.CanViewVillages
      case 'Bill Masters':
        return this.jwtService.Permissions.CanViewBills || this.jwtService.Permissions.CanViewBillParameters
          || this.jwtService.Permissions.CanViewDieselBunks || this.jwtService.Permissions.CanViewDieselRates
          || this.jwtService.Permissions.CanViewDistanceRates || this.jwtService.Permissions.CanViewLoanMasters
          || this.jwtService.Permissions.CanViewVillageParamRates || this.jwtService.Permissions.CanViewVillagetptRates
          || this.jwtService.Permissions.CanViewWareHouses
      case 'Application Masters':
        return this.jwtService.Permissions.CanViewTpts || this.jwtService.Permissions.CanViewVarieties
          || this.jwtService.Permissions.CanViewVehicleTypes
      default: return false;
    }
  }
  ngOnInit() {
    console.log(this.jwtService.Permissions);

    this.model = [

      /*Sample Menus*/

      /*If you want Menu with lable copy this entire block in between flower brackets
      {
         label: 'Home',
         items: [
             { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['home'] },
             /*if u want to add single copy this line and pase change router link
             { label: 'Empty', icon: 'pi pi-fw pi-circle-off', routerLink: ['/pages/empty'] }
         ]
     },
     /* If you want Sub Manu Copy this block between flower brackets, Label you need to add sub menu title in items u
           need to add submenu items in icon section you can add icon for that sub menu
         {
             label: 'Forms',
             icon: 'pi pi-fw pi-user',
             items: [
                 { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
                 { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
                 { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', routerLink: ['/uikit/floatlabel'] },
                 { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/uikit/invalidstate'] },
                 { label: 'Button', icon: 'pi pi-fw pi-box', routerLink: ['/uikit/button'] },
             ]
         },

     */
      {
        label: 'Home',
        items: [
          { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['dashboard'], permission: true },
          /*if u want to add single copy this line and pase change router link */
          {
            label: 'Security',
            icon: 'pi pi-fw pi-lock',
            permission: this.GroupPermission('Security'),
            items: [

              { label: 'Users', icon: 'pi pi-fw pi-user', routerLink: ['/security/users'], permission: this.jwtService.Permissions.CanViewUsers },
              { label: 'Roles', icon: 'pi pi-fw pi-users', routerLink: ['/security/roles'], permission: this.jwtService.Permissions.CanViewRoles },
            ]
          },
          {
            label: 'Masters',
            icon: 'pi pi-fw pi-user',
            permission: this.GroupPermission('Masters'),
            items: [
              {
                label: 'Geo Masters',
                icon: 'pi pi-fw pi-id-card',
                permission: this.GroupPermission('Geo Masters'),
                items: [
                  { label: 'States', icon: 'pi pi-fw pi-circle', routerLink: ['/geomasters/state'], permission: this.jwtService.Permissions.CanViewStates },
                  { label: 'Districts', icon: 'pi pi-fw pi-circle', routerLink: ['/geomasters/districts'], permission: this.jwtService.Permissions.CanViewDistricts },
                  { label: 'Mandals', icon: 'pi pi-fw pi-circle', routerLink: ['/geomasters/mandal'], permission: this.jwtService.Permissions.CanViewMandals },
                  { label: 'Divisions', icon: 'pi pi-fw pi-circle', routerLink: ['/geomasters/division'], permission: this.jwtService.Permissions.CanViewDivisions },
                  { label: 'Circles', icon: 'pi pi-fw pi-circle', routerLink: ['/geomasters/circle'], permission: this.jwtService.Permissions.CanViewCircles },
                  { label: 'Sections', icon: 'pi pi-fw pi-circle', routerLink: ['/geomasters/section'], permission: this.jwtService.Permissions.CanViewSections },
                  { label: 'Villages', icon: 'pi pi-fw pi-circle', routerLink: ['/geomasters/village'], permission: this.jwtService.Permissions.CanViewVillages },
                ]
              },
              {
                label: 'Bill Masters',
                icon: 'pi pi-fw pi-bitcoin text-lg',
                permission: this.GroupPermission('Bill Masters'),
                items: [
                  { label: 'Bills', icon: 'pi pi-fw pi-circle', routerLink: ['/billmasters/billmaster'], permission: this.jwtService.Permissions.CanViewBills },
                  { label: 'Bill Parameters', icon: 'pi pi-fw pi-circle', routerLink: ['/billmasters/billparameters'], permission: this.jwtService.Permissions.CanViewBillParameters },
                  { label: 'Loan Masters', icon: 'pi pi-fw pi-circle', routerLink: ['/billmasters/loanmaster'], permission: this.jwtService.Permissions.CanViewLoanMasters },
                  { label: 'Diesel Rates', icon: 'pi pi-fw pi-circle', routerLink: ['/billmasters/dieselrates'], permission: this.jwtService.Permissions.CanViewDieselRates },
                  { label: 'Distance Rates', icon: 'pi pi-fw pi-circle', routerLink: ['/billmasters/distancerateslab'], permission: this.jwtService.Permissions.CanViewDistanceRates },
                  { label: 'Village Param Rates', icon: 'pi pi-fw pi-circle', routerLink: ['/billmasters/villageparamrates'], permission: this.jwtService.Permissions.CanViewVillageParamRates },
                  { label: 'Village TPT Rates', icon: 'pi pi-fw pi-circle', routerLink: ['/billmasters/villagetptrate'], permission: this.jwtService.Permissions.CanViewVillagetptRates },
                  { label: 'Diesel Bunks', icon: 'pi pi-fw pi-circle', routerLink: ['/billmasters/dieselbunk'], permission: this.jwtService.Permissions.CanViewDieselBunks },
                  { label: 'Ware Houses', icon: 'pi pi-fw pi-circle', routerLink: ['/billmasters/warehouse'], permission: this.jwtService.Permissions.CanViewWareHouses },
                ]
              },
              {
                label: 'Application Masters',
                icon: 'pi pi-fw pi-align-justify text-lg',
                permission: this.GroupPermission('Application Masters'),
                items: [
                  { label: 'Seasons', icon: 'pi pi-fw pi-circle', routerLink: ['/appmasters/season'], permission: true },
                  { label: 'Farmers', icon: 'pi pi-fw pi-circle', routerLink: ['/appmasters/farmer'], permission: true },
                  { label: 'HGLs', icon: 'pi pi-fw pi-circle', routerLink: ['/appmasters/hgl'], permission: true },
                  { label: 'TPTs', icon: 'pi pi-fw pi-circle', routerLink: ['/appmasters/tpt'], permission: this.jwtService.Permissions.CanViewTpts },
                  { label: 'Plant Types', icon: 'pi pi-fw pi-circle', routerLink: ['/appmasters/planttype'], permission: true },
                  { label: 'Plant Sub Types', icon: 'pi pi-fw pi-circle', routerLink: ['/appmasters/plantsubtype'], permission: true },
                  { label: 'Varieties', icon: 'pi pi-fw pi-circle', routerLink: ['/appmasters/variety'], permission: this.jwtService.Permissions.CanViewVarieties },
                  { label: 'Banks', icon: 'pi pi-fw pi-circle', routerLink: ['/appmasters/bank'], permission: true },
                  { label: 'Vehicles', icon: 'pi pi-fw pi-circle', routerLink: ['/appmasters/vehicle'], permission: this.jwtService.Permissions.CanViewVehicleTypes },
                  { label: 'Lookups', icon: 'pi pi-fw pi-circle', routerLink: ['/appmasters/lookup'], permission: true },
                  { label: 'Shifts', icon: 'pi pi-fw pi-circle', routerLink: ['/appmasters/Shift'], permission: true },
                  { label: 'Sample Slabs', icon: 'pi pi-fw pi-circle', routerLink: ['/appmasters/Sample_Slabs'], permission: true },
                ]
              }
            ]
          },
          {
            label: 'Monitoring',
            icon: 'pi pi-fw pi-eye',
            permission: true,
            items: [
              { label: 'Allotted Plots', icon: 'pi pi-fw pi-circle', routerLink: ['/monitoring/allottedplot'], permission: true },
              { label: 'Plot Assesment', icon: 'pi pi-fw pi-circle', routerLink: ['/monitoring/plotassesment'], permission: true },
              { label: 'Plot Transfers', icon: 'pi pi-fw pi-circle', routerLink: ['/monitoring/PlotTransfers'], permission: true },
              { label: 'Completed Plots', icon: 'pi pi-fw pi-circle', routerLink: ['/monitoring/CompletedPlots'], permission: true },
              // { label: 'Allotted Plots', icon: 'pi pi-fw pi-circle', routerLink: ['/monitoring/allottedplot/:notapproval'], permission: true },
              { label: 'Allotted Plot Approval', icon: 'pi pi-fw pi-circle', routerLink: ['/monitoring/allottedplot/:forapproval'], permission: true },
              { label: 'Sample Entry', icon: 'pi pi-fw pi-circle', routerLink: ['/monitoring/sampleentry'], permission: true },
            ]
          }
        ]
      },










      // This is for demo UI Dont Use This

      {
        label: 'Demo',
        icon: 'pi pi-fw pi-briefcase',
        permission: true,
        items: [

          {
            label: 'ui',
            icon: 'pi pi-fw pi-user',
            permission: true,
            items: [
              { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'], permission: true },
              { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'], permission: true },
              { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', routerLink: ['/uikit/floatlabel'], permission: true },
              { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/uikit/invalidstate'], permission: true },
              { label: 'Button', icon: 'pi pi-fw pi-box', routerLink: ['/uikit/button'], permission: true },
              { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'], permission: true },
              { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'], permission: true },
              { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'], permission: true },
              { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', routerLink: ['/utilities/icons'], permission: true },
              { label: 'demoui', icon: 'pi pi-fw pi-tablet', routerLink: ['/demoui/dashboard'], permission: true },
              {
                label: 'Tables', icon: 'pi pi-fw pi-table', permission: true, items: [
                  { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'], permission: true },

                ]
              },

              {

                label: 'Not Found',
                icon: 'pi pi-fw pi-exclamation-circle',
                permission: true,
                routerLink: ['/notfound']
              },

            ]
          },
          // This is for demo UI Dont Use This


        ]
      },



    ];

    //console.log(this.model);

  }
}
