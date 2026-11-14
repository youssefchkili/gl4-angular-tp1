import { Routes } from "@angular/router";
import { FrontComponent } from "./templates/front/front.component";
import { LoginComponent } from "./auth/login/login.component";
import { NF404Component } from "./components/nf404/nf404.component";

/**
 * Stratégie de chargement :
 * - eager : login, le layout de l'accueil et la 404 (petits et utiles dès le premier écran)
 * - lazy + préchargé : la feature cv (la plus utilisée, voir SelectivePreloadingStrategy)
 * - lazy sans préchargement : les autres pages, rarement visitées
 */
export const routes: Routes = [
  { path: "login", component: LoginComponent },
  {
    path: "rh",
    loadComponent: () =>
      import("./optimizationPattern/rh/rh.component").then((m) => m.RhComponent),
  },
  {
    path: "currency",
    loadComponent: () =>
      import("./tp2/currency-selector/country-currency-selector.component").then(
        (m) => m.CountryCurrencySelectorComponent
      ),
  },
  {
    path: "products-filter",
    loadComponent: () =>
      import("./tp2/products-filter/products-filter.component").then(
        (m) => m.ProductsFilterComponent
      ),
  },
  {
    path: "rainbow",
    loadComponent: () =>
      import("./directives/ngclass/ngclass.component").then((m) => m.NgclassComponent),
  },
  {
    path: "cv",
    loadChildren: () => import("./cv/cv.routes").then((m) => m.CV_ROUTES),
    data: { preload: true },
  },
  {
    path: "",
    component: FrontComponent,
    children: [
      {
        path: "todo",
        loadComponent: () =>
          import("./todo/todo/todo.component").then((m) => m.TodoComponent),
      },
      {
        path: "word",
        loadComponent: () =>
          import("./directives/mini-word/mini-word.component").then(
            (m) => m.MiniWordComponent
          ),
      },
      {
        path: "ttc",
        loadComponent: () => import("./ttc/ttc.component").then((m) => m.TtcComponent),
      },
    ],
  },
  {
    path: "admin",
    loadComponent: () =>
      import("./templates/admin/admin.component").then((m) => m.AdminComponent),
    children: [
      {
        path: "color",
        loadComponent: () =>
          import("./components/color/color.component").then((m) => m.ColorComponent),
      },
    ],
  },
  { path: "**", component: NF404Component },
];
