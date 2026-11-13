import { Directive, signal } from '@angular/core';

@Directive({
  selector: 'input[appRainbow]',
  host: {
    '[style.color]': 'color()',
    '[style.borderColor]': 'borderColor()',
    '(keyup)': 'onKeyUp()',
  },
})
export class RainbowDirective {
  color = signal('');
  borderColor = signal('');

  onKeyUp() {
    const randomColor = this.getRandomColor();
    this.color.set(randomColor);
    this.borderColor.set(randomColor);
  }

  getRandomColor(): string {
    const hex = Math.floor(Math.random() * 0x1000000).toString(16);
    return '#' + hex.padStart(6, '0');
  }
}
