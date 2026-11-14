import { Routes } from "@angular/router";
import { AuthGuard } from "../auth/guards/auth.guard";
import { CvComponent } from "./cv/cv.component";
import { MasterDetailsCvComponent } from "./master-details-cv/master-details-cv.component";
import { DetailsCvComponent } from "./details-cv/details-cv.component";
import { AddCvComponent } from "./add-cv/add-cv.component";
import { AutocompleteComponent } from "./autocomplete/autocomplete.component";

/**
 * Les routes de la feature cv, chargées en lazy loading depuis app.routes.ts
 */
export const CV_ROUTES: Routes = [
  { path: "", component: CvComponent },
  // Avant ":id", sinon "list" serait pris pour un id
  {
    path: "list",
    component: MasterDetailsCvComponent,
    children: [{ path: ":id", component: DetailsCvComponent }],
  },
  { path: "add", component: AddCvComponent, canActivate: [AuthGuard] },
  { path: "autocomplete", component: AutocompleteComponent },
  { path: ":id", component: DetailsCvComponent },
];
