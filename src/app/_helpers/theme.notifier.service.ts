import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class ThemeNotifier {
  themeChangeNotifier = new Subject<string>();

  notifyChangeTheme(themeName: string){
    this.themeChangeNotifier.next(themeName);
  }

  updateTheme(): Observable<string>{
    return this.themeChangeNotifier.asObservable();
  }

  clear(){
    this.themeChangeNotifier.next('');
  }
}

export const THEMES = [
  { Label: 'Green (Default)', icon: 'pi pi-external-link', Name: 'lara-light-indigo' },
  { Label: 'Dark Green', icon: 'pi pi-external-link', Name: 'lara-dark-indigo' },
  { Label: 'Light Blue', icon: 'pi pi-external-link', Name: 'lara-light-blue' },
  { Label: 'Dark Blue', icon: 'pi pi-external-link', Name: 'lara-dark-blue' },
  { Label: 'Light Purple', icon: 'pi pi-external-link', Name: 'lara-light-purple' },
  { Label: 'Dark Purple', icon: 'pi pi-external-link', Name: 'lara-dark-purple' },
  { Label: 'Light Teal', icon: 'pi pi-external-link', Name: 'lara-light-teal' },
  { Label: 'Dark Teal', icon: 'pi pi-external-link', Name: 'lara-dark-teal' },
];
