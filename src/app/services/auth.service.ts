// auth.service.ts (reemplazar/añadir)
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { UsuariosService } from './usuarios.service';
import { MockAuthService } from './mock-auth.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'https://api.utpbiblio.dpdns.org/api/auth/login';
  public userSubject = new BehaviorSubject<any>(this.getUsuario());
  public user$ = this.userSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private usuarioService: UsuariosService,
    private mockAuth: MockAuthService
  ) { }

  login(username: string, password: string): Observable<void> {
    const loginSource$ = this.mockAuth.enabled
      ? this.mockAuth.login(username, password)
      : this.http.post<any>(this.apiUrl, { username, password });

    return loginSource$.pipe(
      tap(response => {
        const token = response.token;
        const user = response.user ?? response;

        if (token) {
          localStorage.setItem('token', token);
        }

        localStorage.setItem('usuario', JSON.stringify(user));
        this.userSubject.next(user);

        // 🔥 Redirección según rol
        if (this.canAccessDashboard()) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/cuenta']);
        }
      }),
      map(() => { }),
      catchError(error => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }


  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUsuario(): any {
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  logout(): void {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    this.userSubject.next(null);
    this.router.navigate(['/']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getUsuario();
  }

  isAdmin(): boolean {
    // roles podría venir como [{id:..., name:"ROLE_ADMIN"}, ...]
    return this.hasRole('ADMIN');
  }

  isBibliotecario(): boolean {
    return this.hasRole('BIBLIOTECARIO');
  }

  /** Administrador y Bibliotecario pueden entrar al panel /dashboard */
  canAccessDashboard(): boolean {
    return this.isAdmin() || this.isBibliotecario();
  }

  private hasRole(role: string): boolean {
    const usuario = this.getUsuario();
    if (!usuario || !usuario.roles) return false;
    return usuario.roles.some((r: any) => r.name === `ROLE_${role}` || r.name === role);
  }

  actualizarUsuarioConReserva(nuevaReserva: any): void {
    const usuarioActual = this.getUsuario();
    if (usuarioActual) {
      const usuarioActualizado = {
        ...usuarioActual,
        reservas: [...(usuarioActual.reservas || []), nuevaReserva]
      };
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      this.userSubject.next(usuarioActualizado);
    }
  }

  actualizarUsuarioDesdeBackend(): void {
    if (this.mockAuth.enabled) return;

    const usuario = this.getUsuario();
    if (!usuario?.id) return;

    this.usuarioService.getUsuario(usuario.id).subscribe({
      next: (usuarioActualizado) => {
        localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
        this.userSubject.next(usuarioActualizado);
      },
      error: (err) => {
        console.error('Error actualizando usuario desde backend:', err);
      }
    });
  }
}
