import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { EMPTY, catchError, switchMap } from 'rxjs';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from '../../../config/routes.config';
import { AuthService } from '../../auth/services/auth.service';
import { DefaultImagePipe } from '../pipes/default-image.pipe';

@Component({
    selector: 'app-details-cv',
    templateUrl: './details-cv.component.html',
    styleUrls: ['./details-cv.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [DefaultImagePipe]
})
export class DetailsCvComponent {
  private cvService = inject(CvService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  isAuthenticated = inject(AuthService).isAuthenticated;

  /**
   * Le cv dont l'id est dans l'url, rechargé à chaque changement de l'id
   * Si le cv n'existe pas, on revient à la liste des cvs
   */
  cv = toSignal(
    this.activatedRoute.paramMap.pipe(
      switchMap((params) =>
        this.cvService.getCvById(+params.get('id')!).pipe(
          catchError(() => {
            this.router.navigate([APP_ROUTES.cv]);
            return EMPTY;
          })
        )
      )
    ),
    { initialValue: null }
  );

  deleteCv(cv: Cv) {
    this.cvService.deleteCvById(cv.id).subscribe({
      next: () => {
        this.toastr.success(`${cv.name} supprimé avec succès`);
        this.router.navigate([APP_ROUTES.cv]);
      },
      error: () => {
        this.toastr.error(
          `Problème avec le serveur veuillez contacter l'admin`
        );
      },
    });
  }
}
