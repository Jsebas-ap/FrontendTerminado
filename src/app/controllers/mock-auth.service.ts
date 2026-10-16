import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MockAuthService {
  /**
   * Cambiar a false cuando se desee volver a usar el backend formal.
   */
  public readonly enabled = true;

  private mockUsers: any[] = [
    {
      id: 101,
      username: 'usuario@gmail.com',
      nombres: 'Carlos',
      apellidos: 'Lector Pérez',
      dni: '76543210',
      telefono: '987654321',
      direccion: 'Av. Los Sauces 123, Ate',
      fechaNacimiento: '2000-05-15',
      enabled: true,
      roles: [{ id: 1, name: 'ROLE_USER' }],
      reservas: [
        {
          id: 501,
          fechaReserva: '2026-10-10T10:00:00',
          fechaEstimadaDevolucion: '2026-10-24T18:00:00',
          fechaRealDevolucion: null,
          estado: 'PENDIENTE',
          ejemplar: {
            id: 201,
            codigoEjemplar: 'CIEN-001',
            libro: {
              id: 1,
              titulo: 'Cien años de soledad',
              autor: 'Gabriel García Márquez',
              editorial: 'Editorial Sudamericana'
            }
          }
        }
      ]
    },
    {
      id: 102,
      username: 'biblio@gmail.com',
      nombres: 'María',
      apellidos: 'Bibliotecaria Gómez',
      dni: '44556677',
      telefono: '912345678',
      direccion: 'Biblioteca Central de Ate',
      fechaNacimiento: '1988-08-20',
      enabled: true,
      roles: [{ id: 2, name: 'ROLE_BIBLIOTECARIO' }],
      reservas: []
    },
    {
      id: 103,
      username: 'admin@gmail.com',
      nombres: 'Alberto',
      apellidos: 'Administrador Ramos',
      dni: '11223344',
      telefono: '998877665',
      direccion: 'Oficina Central de Sistemas',
      fechaNacimiento: '1985-03-10',
      enabled: true,
      roles: [{ id: 3, name: 'ROLE_ADMIN' }],
      reservas: []
    }
  ];

  login(username: string, password: string): Observable<{ token: string; user: any }> {
    const cleanEmail = username ? username.trim().toLowerCase() : '';
    const userFound = this.mockUsers.find(u => u.username.toLowerCase() === cleanEmail);

    if (userFound) {
      // Simula token y respuesta exitosa
      return of({
        token: `mock-jwt-token-${userFound.id}-${Date.now()}`,
        user: { ...userFound }
      });
    }

    return throwError(() => new Error('Credenciales incorrectas (use usuario@gmail.com, biblio@gmail.com o admin@gmail.com)'));
  }
}
