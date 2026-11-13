import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TtcComponent } from './ttc.component';

describe('TtcComponent', () => {
  let component: TtcComponent;
  let fixture: ComponentFixture<TtcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TtcComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TtcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should start with quantity 1, price 0 and tva 18', () => {
    expect(component.quantity()).toBe(1);
    expect(component.price()).toBe(0);
    expect(component.tva()).toBe(18);
    expect(component.totalTtc()).toBe(0);
  });

  it('should not apply a discount under 10 pieces', () => {
    component.price.set(100);
    component.quantity.set(9);
    expect(component.discount()).toBe(0);
    expect(component.totalTtc()).toBeCloseTo(1062);
  });

  it('should apply 20% between 10 and 15 pieces', () => {
    component.price.set(100);
    component.quantity.set(10);
    expect(component.discount()).toBe(0.2);
    component.quantity.set(15);
    expect(component.discount()).toBe(0.2);
    expect(component.totalTtc()).toBeCloseTo(1416);
  });

  it('should update the signals when the user types', async () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('#quantity');
    input.value = '12';
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();

    expect(component.quantity()).toBe(12);
    expect(component.discount()).toBe(0.2);
  });

  it('should apply 30% above 15 pieces', () => {
    component.price.set(100);
    component.quantity.set(16);
    expect(component.discount()).toBe(0.3);
    expect(component.totalTtc()).toBeCloseTo(1321.6);
  });
});
