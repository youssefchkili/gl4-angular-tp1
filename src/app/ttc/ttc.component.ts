import { Component, ChangeDetectionStrategy, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, PercentPipe } from '@angular/common';

@Component({
    selector: 'app-ttc',
    templateUrl: './ttc.component.html',
    styleUrls: ['./ttc.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [FormsModule, DecimalPipe, PercentPipe]
})
export class TtcComponent {
  quantity = signal(1);
  price = signal(0);
  tva = signal(18);

  /**
   * 20% de remise entre 10 et 15 pièces, 30% au delà de 15
   */
  discount = computed(() => {
    const quantity = this.quantity();
    if (quantity > 15) return 0.3;
    if (quantity >= 10) return 0.2;
    return 0;
  });

  unitPriceTtc = computed(() => this.price() * (1 + this.tva() / 100));

  totalTtc = computed(
    () => this.unitPriceTtc() * this.quantity() * (1 - this.discount())
  );
}
