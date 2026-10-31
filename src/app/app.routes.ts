import { Routes } from '@angular/router';
import { Libros } from './views/dashboard/libros/libros';
import { Dashboard } from './views/dashboard/dashboard/dashboard';
import { PrincipalComponent } from './paginas/principal/principal.component';
import { DashboardNavbar } from './views/dashboard/dashboard-navbar/dashboard-navbar';
import { PrincipalNavbarComponent } from './paginas/principal-navbar/principal-navbar.component';
import { CatalogoComponent } from './paginas/catalogo/catalogo.component';
import { DetalleComponent } from './paginas/detalle/detalle.component';
import { PrestamoComponent } from './paginas/prestamo/prestamo.component';
import { RegistrarComponent } from './paginas/registrar/registrar.component';
import { CuentaComponent } from './paginas/cuenta/cuenta.component';
import { MisReservasComponent } from './paginas/mis-reservas/mis-reservas.component';
import { Ejemplares } from './views/dashboard/ejemplares/ejemplares';
import { Usuarios } from './views/dashboard/usuarios/usuarios';
import { Reservas } from './views/dashboard/reservas/reservas';
import { Historial } from './views/dashboard/historial/historial';
import { Atrasadas } from './views/dashboard/atrasadas/atrasadas';
import { AdminGuard } from './guards/admin-guard';
import { StaffGuard } from './guards/staff-guard';

export const routes: Routes = [
    {
        path: '',
        component: PrincipalNavbarComponent,
        children: [
            {
                path: '',
                component: PrincipalComponent
            },
            {
                path: 'catalogo',
                component: CatalogoComponent
            },
            {
                path: 'detalle/:slug',
                loadComponent: () => import('./paginas/detalle/detalle.component').then(m => m.DetalleComponent)
            },
            {
                path: 'prestamo/:slug',
                loadComponent: () => import('./paginas/prestamo/prestamo.component').then(m => m.PrestamoComponent)
            },
            {
                path: 'registrar',
                component: RegistrarComponent
            },
            {
                path: 'cuenta',
                component: CuentaComponent
            },
            {
                path: 'mis-reservas',
                component: MisReservasComponent
            },
            {
                path: 'faq',
                loadComponent: () => import('./paginas/faq/faq.component').then(m => m.FaqComponent)
            }
        ]
    },

    // dashboard (Administrador y Bibliotecario)
    {
        path: 'dashboard',
        component: DashboardNavbar,
        canActivate: [StaffGuard],
        children: [
            {
                path: '',
                component: Dashboard
            },
            {
                path: 'libros',
                component: Libros
            },
            {
                path: 'ejemplares',
                component: Ejemplares
            },
            {
                path: 'usuarios',
                component: Usuarios
            },
            {
                path: 'reservas',
                component: Reservas
            },
            {
                path: 'historial',
                component: Historial,
                canActivate: [AdminGuard] // Reportes: solo Administrador
            },
            {
                path: 'atrasadas',
                component: Atrasadas
            }
        ]
    }
];
