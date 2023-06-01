import { JWTService } from './_services/jwt.service';
import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
    private style?: HTMLLinkElement;
    constructor(private primengConfig: PrimeNGConfig,
      private readonly messageService: MessageService,
      @Inject(DOCUMENT) private document: Document,
      private renderer2: Renderer2,
      private jWTService: JWTService
    ) {
      //theme-css

    }

    ngOnInit() {
        this.primengConfig.ripple = true;

        const cssPath = 'assets/layout/styles/theme/lara-light-indigo/theme.css';
        if(this.jWTService.IsLoggedIn){

        }

        // Create a link element via Angular's renderer to avoid SSR troubles
        this.style = this.renderer2.createElement('link') as HTMLLinkElement;

        // Add the style to the head section
        this.renderer2.appendChild(this.document.head, this.style);

        // Set type of the link item and path to the css file
        this.renderer2.setProperty(this.style, 'rel', 'stylesheet');
        this.renderer2.setProperty(this.style, 'id', 'theme-css');
        this.renderer2.setProperty(this.style, 'href', cssPath);
        this.renderer2.setProperty(this.style, 'type', 'text/css');
    }
}
