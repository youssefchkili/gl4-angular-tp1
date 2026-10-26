import { Injectable, signal } from '@angular/core';
import { Cv } from '../model/cv';

@Injectable({
  providedIn: 'root',
})
export class EmbaucheService {
  /**
   * La liste des embauchees : seul le service peut la modifier
   */
  #embauchees = signal<Cv[]>([]);

  /**
   * La liste des embauchees en lecture seule pour les consommateurs
   */
  readonly embauchees = this.#embauchees.asReadonly();

  /**
   *
   * Embauche une personne si elle ne l'est pas encore
   * Sinon il retourne false
   *
   * @param cv : Cv
   * @returns boolean
   */
  embauche(cv: Cv): boolean {
    if (this.#embauchees().some((embauchee) => embauchee.id === cv.id)) {
      return false;
    }
    this.#embauchees.update((embauchees) => [...embauchees, cv]);
    return true;
  }
}
