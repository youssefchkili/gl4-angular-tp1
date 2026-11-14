import { Component, ChangeDetectionStrategy, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { RouterLink, RouterLinkActive, RouterOutlet } from "@angular/router";
import { catchError, of } from "rxjs";
import { Cv } from "../model/cv";
import { CvService } from "../services/cv.service";
import { ItemComponent } from "../item/item.component";

@Component({
  selector: "app-master-details-cv",
  templateUrl: "./master-details-cv.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, ItemComponent],
})
export class MasterDetailsCvComponent {
  private cvService = inject(CvService);

  /**
   * La vue maître : les cvs de l'API, ou les cvs fictifs si le serveur ne répond pas
   */
  cvs = toSignal(
    this.cvService
      .getCvs()
      .pipe(catchError(() => of(this.cvService.getFakeCvs()))),
    { initialValue: [] as Cv[] }
  );
}
