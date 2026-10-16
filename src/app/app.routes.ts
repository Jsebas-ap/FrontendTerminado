import { Routes } from '@angular/router';
import { Libros } from './views/dashboard/libros/libros';
import { Dashboard } from './views/dashboard/dashboard/dashboard';
import { Principal } from './views/paginas/principal/principal';
import { DashboardNavbar } from './views/dashboard/dashboard-navbar/dashboard-navbar';
import { PrincipalNavbarComponent } from './views/paginas/principal-navbar/principal-navbar';
import { Catalogo } from './views/paginas/catalogo/catalogo';
import { Detalle } from './views/paginas/detalle/detalle';
import { Prestamo } from './views/paginas/prestamo/prestamo';
import { Registrar } from './views/paginas/registrar/registrar';
import { CuentaComponent } from './views/paginas/cuenta/cuenta';
import { MisReservas } from './views/paginas/mis-reservas/mis-reservas';
import { Ejemplares } from './views/dashboard/ejemplares/ejemplares';
import { Usuarios } from './views/dashboard/usuarios/usuarios';
import { Reservas } from './views/dashboard/reservas/reservas';
import { Historial } from './views/dashboard/historial/historial';
import { Atrasadas } from './views/dashboard/atrasadas/atrasadas';
import { AdminGuard } from './shared/guards/admin-guard';
import { StaffGuard } from './shared/guards/staff-guard';

export const routes: Routes = [
    {
        path: '',
        component: PrincipalNavbarComponent,
        children: [
            {
                path: '',
                component: Principal
            },
            {
                path: 'catalogo',
                component: Catalogo
            },
            {
                path: 'detalle/:slug',
                loadComponent: () => import('./views/paginas/detalle/detalle').then(m => m.Detalle)
            },
            {
                path: 'prestamo/:slug',
                loadComponent: () => import('./views/paginas/prestamo/prestamo').then(m => m.Prestamo)
            },
            {
                path: 'registrar',
                component: Registrar
            },
            {
                path: 'cuenta',
                component: CuentaComponent
            },
            {
                path: 'mis-reservas',
                component: MisReservas
            },
            {
                path: 'faq',
                loadComponent: () => import('./views/paginas/faq/faq').then(m => m.FaqComponent)
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
