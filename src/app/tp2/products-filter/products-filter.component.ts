import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PRODUCTS } from './product.data';

@Component({
  selector: 'app-products-filter',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './products-filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './products-filter.component.css',
})
export class ProductsFilterComponent {
  protected readonly products = PRODUCTS;
  protected readonly categories = [...new Set(PRODUCTS.map(p => p.category))];
  protected readonly search = signal('');
  protected readonly category = signal('');

  protected readonly filteredProducts = computed(() => {
    const search = this.search().trim().toLowerCase();
    const category = this.category();
    return this.products.filter(p =>
      (!category || p.category === category) && p.name.toLowerCase().includes(search)
    );
  });

  protected reset() {
    this.search.set('');
    this.category.set('');
  }
}
