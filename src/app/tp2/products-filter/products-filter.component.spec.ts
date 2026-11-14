import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PRODUCTS } from './product.data';
import { ProductsFilterComponent } from './products-filter.component';

describe('ProductsFilterComponent', () => {
  let fixture: ComponentFixture<ProductsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ProductsFilterComponent] }).compileComponents();
    fixture = TestBed.createComponent(ProductsFilterComponent);
    fixture.detectChanges();
  });

  const items = () => Array.from(fixture.nativeElement.querySelectorAll('li'))
    .map((item: Element) => item.textContent?.trim() ?? '');

  it('shows every product initially and each category once', () => {
    expect(items().length).toBe(PRODUCTS.length);
    const options = fixture.nativeElement.querySelectorAll('option');
    expect(options.length).toBe(new Set(PRODUCTS.map(p => p.category)).size + 1);
  });

  it('keeps the search active when the category changes', async () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');

    input.value = '  INTRODUCTION ';
    input.dispatchEvent(new Event('input'));
    select.value = 'Technology';
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(items().length).toBeGreaterThan(0);
    expect(items().every(item => item.toLowerCase().includes('introduction') && item.includes('(Technology)'))).toBeTrue();

    select.value = 'Life Sciences';
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(items().length).toBeGreaterThan(0);
    expect(items().every(item => item.toLowerCase().includes('introduction') && item.includes('(Life Sciences)'))).toBeTrue();
    expect(input.value).toBe('  INTRODUCTION ');
  });

  it('shows an empty state and resets both filters', async () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');

    input.value = 'nonexistent product';
    input.dispatchEvent(new Event('input'));
    select.value = 'Mathematics';
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(items()).toEqual(['No products found']);

    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(input.value).toBe('');
    expect(select.value).toBe('');
    expect(items().length).toBe(PRODUCTS.length);
  });
});
