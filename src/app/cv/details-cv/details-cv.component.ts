import { Component } from '@angular/core';
import { EMPTY, Observable, catchError } from 'rxjs';
import { Cv } from '../model/cv';
import { CvService } from '../services/cv.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from '../../../config/routes.config';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-details-cv',
  templateUrl: './details-cv.component.html',
  styleUrls: ['./details-cv.component.css'],
})
export class DetailsCvComponent {
  cv$: Observable<Cv>;
  constructor(
    private cvService: CvService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public authService: AuthService
  ) {
    const id = this.activatedRoute.snapshot.params['id'];
    this.cv$ = this.cvService.getCvById(+id).pipe(
      catchError(() => {
        this.router.navigate([APP_ROUTES.cv]);
        return EMPTY;
      })
    );
  }

  deleteCv(cv: Cv) {
    this.cvService
      .deleteCvById(cv.id)
      .pipe(
        catchError(() => {
          this.toastr.error(
            `Problème avec le serveur veuillez contacter l'admin`
          );
          return EMPTY;
        })
      )
      .subscribe(() => {
        this.toastr.success(`${cv.name} supprimé avec succès`);
        this.router.navigate([APP_ROUTES.cv]);
      });
  }
}
