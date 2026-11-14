import { Injectable } from "@angular/core";
import { PreloadingStrategy, Route } from "@angular/router";
import { Observable, of } from "rxjs";

/**
 * Précharge en arrière-plan uniquement les routes lazy marquées avec data: { preload: true }
 * Les autres routes lazy ne sont téléchargées qu'au moment où on y navigue
 */
@Injectable({
  providedIn: "root",
})
export class SelectivePreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    return route.data?.["preload"] ? load() : of(null);
  }
}
