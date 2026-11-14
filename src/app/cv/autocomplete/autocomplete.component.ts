import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
} from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import { Router } from "@angular/router";
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  of,
  switchMap,
  tap,
} from "rxjs";
import { CvService } from "../services/cv.service";
import { Cv } from "../model/cv";
import { DefaultImagePipe } from "../pipes/default-image.pipe";

@Component({
  selector: "app-autocomplete",
  templateUrl: "./autocomplete.component.html",
  styleUrls: ["./autocomplete.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DefaultImagePipe],
})
export class AutocompleteComponent {
  private cvService = inject(CvService);
  private router = inject(Router);

  /** Signal contenant le terme de recherche courant */
  searchTerm = signal<string>("");

  /** Signal d'état indiquant si une requête HTTP est en cours */
  isLoading = signal<boolean>(false);

  /**
   * Signal dérivé calculé à partir du terme de recherche :
   * - toObservable convertit le signal searchTerm en flux Observable
   * - map : normalise et retire les espaces superflus
   * - debounceTime(300) : temporise pour ne pas spammer le serveur
   * - distinctUntilChanged : ignore si la valeur nettoyée reste la même
   * - switchMap : annule toute requête en cours si une nouvelle frappe survient
   * - catchError : évite de briser le flux en cas d'erreur API
   * - toSignal : convertit le résultat final en Signal réactif
   */
  cvs = toSignal(
    toObservable(this.searchTerm).pipe(
      map((term) => term.trim()),
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.isLoading.set(true)),
      switchMap((term: string) => {
        if (!term) {
          this.isLoading.set(false);
          return of([] as Cv[]);
        }
        return this.cvService.selectByName(term).pipe(
          catchError((err) => {
            console.error("Erreur lors de la recherche des CVs :", err);
            return of([] as Cv[]);
          }),
          tap(() => this.isLoading.set(false))
        );
      })
    ),
    { initialValue: [] as Cv[] }
  );

  /** Met à jour le signal de recherche à chaque saisie */
  updateSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm.set(input.value);
  }

  /**
   * Sélectionne un CV :
   * - Met à jour le signal du CV sélectionné via CvService.selectCv
   * - Navigue vers la page de détails du CV sélectionné (/cv/:id)
   */
  selectCv(cv: Cv): void {
    this.cvService.selectCv(cv);
    this.router.navigate(["/cv", cv.id]);
  }

  resetSearch(inputEl?: HTMLInputElement): void {
    this.searchTerm.set("");
    if (inputEl) {
      inputEl.value = "";
    }
  }
}
