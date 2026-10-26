/**
 * L'utilisateur authentifié tel qu'on le garde dans l'application
 */
export interface ConnectedUser {
  id: number;
  email: string;
  /**
   * Le token envoyé par l'API, ajouté par l'intercepteur à chaque requête
   */
  token: string;
}
