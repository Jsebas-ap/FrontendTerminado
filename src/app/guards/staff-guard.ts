// staff.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '@app/services/auth.service';

/**
 * Permite el acceso al panel /dashboard al personal de la biblioteca
 * (Administrador y Bibliotecario).
 */
@Injectable({ providedIn: 'root' })
export class StaffGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (this.auth.isAuthenticated() && this.auth.canAccessDashboard()) {
      return true;
    }
    return this.router.createUrlTree(['/']);
  }
}
