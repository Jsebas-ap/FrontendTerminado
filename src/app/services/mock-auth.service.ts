import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { USE_MOCK_DATA } from './mock-config';
import { MockDataStore } from './mock-data.store';

@Injectable({ providedIn: 'root' })
export class MockAuthService {
  /**
   * Vinculado a USE_MOCK_DATA en shared/mock-config.ts.
   * Cambiar allí para alternar entre Mock y Backend real.
   */
  public get enabled(): boolean {
    return USE_MOCK_DATA;
  }

  constructor(private mockStore: MockDataStore) {}

  login(username: string, _password: string): Observable<{ token: string; user: any }> {
    const cleanEmail = username ? username.trim().toLowerCase() : '';
    const users = this.mockStore.getMockUsersForAuth();
    const userFound = users.find(u => u.username?.toLowerCase() === cleanEmail);

    if (userFound) {
      // Simula token y respuesta exitosa
      return of({
        token: `mock-jwt-token-${userFound.id}-${Date.now()}`,
        user: { ...userFound }
      });
    }

    return throwError(() => new Error('Credenciales incorrectas (puede usar andre@gmail.com, biblio@gmail.com, usuario@gmail.com, etc.)'));
  }
}
