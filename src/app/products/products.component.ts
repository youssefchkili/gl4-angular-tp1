import { Component, inject } from "@angular/core";
import {
  BehaviorSubject,
  Observable,
  concatMap,
  map,
  takeWhile,
  scan,
} from "rxjs";
import { Product } from "./dto/product.dto";
import { ProductService } from "./services/product.service";
import { Settings } from "./dto/product-settings.dto";

@Component({
  selector: "app-products",
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.css"],
})
export class ProductsComponent {
  /* Todo : Faire le nécessaire pour créer le flux des produits à afficher */
  /* Tips : vous pouvez voir les différents imports non utilisés et vous en inspirer */
  private productService = inject(ProductService);

  private readonly pageSize = 12;

  private settings$ = new BehaviorSubject<Settings>({ limit: this.pageSize, skip: 0 });

  products$: Observable<Product[]> = this.settings$.pipe(
    concatMap((settings) => this.productService.getProducts(settings)),
    takeWhile((response) => response.skip + response.products.length < response.total, true),
    map((response) => response.products),
    scan((all, page) => [...all, ...page], [] as Product[])
  );

  loadMore() {
    const { limit, skip } = this.settings$.value;
    this.settings$.next({ limit, skip: skip + limit });
  };
  trackById(index: number, product: Product): number {
    return product.id;
  }
  constructor() {}
}
