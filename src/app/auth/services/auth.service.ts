import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { CredentialsDto } from '../dto/credentials.dto';
import { LoginResponseDto } from '../dto/login-response.dto';
import { ConnectedUser } from '../model/connected-user';
import { HttpClient } from '@angular/common/http';
import { API } from '../../../config/api.config';
import { CONSTANTES } from '../../../config/const.config';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  /**
   * L'utilisateur authentifié : seul le service peut le modifier
   * Au chargement de l'application, il est rechargé depuis le localStorage
   */
  #connectedUser = signal<ConnectedUser | null>(this.restoreUser());

  /**
   * L'utilisateur authentifié en lecture seule pour les consommateurs
   */
  readonly connectedUser = this.#connectedUser.asReadonly();

  /**
   * Est ce que l'utilisateur est authentifié, recalculé à chaque changement de l'utilisateur
   */
  readonly isAuthenticated = computed(() => !!this.#connectedUser());

  /**
   * Le token de l'utilisateur authentifié, null s'il n'y en a pas
   */
  readonly token = computed(() => this.#connectedUser()?.token ?? null);

  /**
   * Effet de bord : à chaque changement de l'utilisateur, on met à jour le localStorage
   * afin de pouvoir le recharger au prochain lancement de l'application
   */
  private persistUser = effect(() => {
    const user = this.#connectedUser();
    if (user) {
      localStorage.setItem(CONSTANTES.connectedUserKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(CONSTANTES.connectedUserKey);
    }
  });

  /**
   * Authentifie l'utilisateur et garde son id, son email et son token
   *
   * @param credentials: CredentialsDto
   * @returns Observable<LoginResponseDto>
   */
  login(credentials: CredentialsDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(API.login, credentials).pipe(
      tap((response) =>
        this.#connectedUser.set({
          id: response.userId,
          email: credentials.email,
          token: response.id,
        })
      )
    );
  }

  logout() {
    this.#connectedUser.set(null);
  }

  /**
   * Récupère l'utilisateur sauvegardé dans le localStorage
   *
   * @returns ConnectedUser | null
   */
  private restoreUser(): ConnectedUser | null {
    try {
      const user = localStorage.getItem(CONSTANTES.connectedUserKey);
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }
}
