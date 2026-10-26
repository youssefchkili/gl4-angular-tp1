import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appRainbow]',
})
export class RainbowDirective {
  @HostBinding('style.color') color = '';
  @HostBinding('style.borderColor') borderColor = '';

  @HostListener('keyup') onKeyUp() {
    const randomColor = this.getRandomColor();
    this.color = randomColor;
    this.borderColor = randomColor;
  }

  getRandomColor(): string {
    const hex = Math.floor(Math.random() * 0x1000000).toString(16);
    return '#' + hex.padStart(6, '0');
  }
}
