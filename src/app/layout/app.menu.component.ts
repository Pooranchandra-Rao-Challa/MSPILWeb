import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
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
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['dashboard'] },
                    { label: 'Login', icon: 'pi pi-fw pi-check-square', routerLink: ['login'] },
                    /*if u want to add single copy this line and pase change router link */
                    {
                        label: 'Masters',
                        icon: 'pi pi-fw pi-user',
                        items: [
                            { 
                                label: 'Geo Masters', 
                                icon: 'pi pi-fw pi-id-card', 
                                items: [
                                    { label: 'Districts', icon: 'pi pi-fw pi-check-square', routerLink: ['/geomasters/districts'] },
                                    
                                ]
                               
                            },
                          
                        ]
                    },
                   
                ]
            },


            {
                label: 'Demo',
                icon: 'pi pi-fw pi-briefcase',
                items: [
                  
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
                    {
                        label: 'Tables',
                        icon: 'pi pi-fw pi-table',
                        items: [
                           
                            { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
                           
                        ]
                    },
                    
                    { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
                    { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
                    { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
                    { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', routerLink: ['/utilities/icons'] },
                    {
                        
                        label: 'Not Found',
                        icon: 'pi pi-fw pi-exclamation-circle',
                        routerLink: ['/notfound']
                    },
                    { label: 'demoui', icon: 'pi pi-fw pi-tablet', routerLink: ['/demoui/dashboard'] },
                    
                ]
            },
           
        ];
    }
}
