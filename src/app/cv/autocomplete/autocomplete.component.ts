import { Component, inject } from "@angular/core";
import { FormBuilder, AbstractControl } from "@angular/forms";
import { Router } from "@angular/router";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from "rxjs";
import { CvService } from "../services/cv.service";
import { Cv } from "../model/cv";

@Component({
  selector: "app-autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.css"],
})
export class AutocompleteComponent {
  private formBuilder = inject(FormBuilder);
  private cvService = inject(CvService);
  private router = inject(Router);

  form = this.formBuilder.group({ search: [""] });
  isLoading = false;

  get search(): AbstractControl {
    return this.form.get("search")!;
  }

  /**
   * Flux réactif pour la recherche autocomplétée :
   * - map : normalise la saisie et supprime les espaces superflus
   * - debounceTime(300) : temporise les frappes pour éviter de spammer le serveur
   * - distinctUntilChanged : ne déclenche rien si la valeur reste inchangée
   * - switchMap : annule toute requête HTTP précédente encore en cours si une nouvelle frappe arrive
   * - catchError : intercepte les erreurs réseau sans casser le flux
   */
  cvs$: Observable<Cv[]> = this.search.valueChanges.pipe(
    map((term) => (term ?? "").trim()),
    debounceTime(300),
    distinctUntilChanged(),
    tap(() => {
      this.isLoading = true;
    }),
    switchMap((term: string) => {
      if (!term) {
        this.isLoading = false;
        return of([] as Cv[]);
      }
      return this.cvService.selectByName(term).pipe(
        catchError((err) => {
          console.error("Erreur lors de la recherche des CVs :", err);
          return of([] as Cv[]);
        }),
        tap(() => {
          this.isLoading = false;
        })
      );
    })
  );

  /**
   * Sélectionne un CV :
   * - Notifie le flux global CvService.selectCv$
   * - Redirige vers la page de détails du CV (/cv/:id)
   */
  selectCv(cv: Cv): void {
    this.cvService.selectCv(cv);
    this.router.navigate(["/cv", cv.id]);
  }

  resetSearch(): void {
    this.search.setValue("");
  }
}
