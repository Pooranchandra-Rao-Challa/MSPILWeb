import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[numericOnly]'
})
export class NumericDirective {

  private regex: RegExp = new RegExp(/^[0-9]*$/);

  private specialKeys: Array<string> = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'End', 'Home'];
  constructor(private el: ElementRef) {

  }
  /* Key board action */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Allow Backspace, tab, end, and home keys
    if (this.specialKeys.indexOf(event.key) !== -1) {
      return;
    }
    let current: string = this.el.nativeElement.value;
    let next: string = current.concat(event.key);
    if (next && !String(next).match(this.regex)) {
      event.preventDefault();
    }
  }

  /* Copy paste action */
  @HostListener('paste', ['$event'])
  onPaste(event: any) {
    const clipboardData = (event.originalEvent || event).clipboardData.getData("text/plain");
    if (clipboardData) {
      if (!this.regex.test(clipboardData)) {
        event.preventDefault();
      }
    }
    return
  }
}
