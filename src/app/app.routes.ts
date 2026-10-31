import { Routes } from '@angular/router';
import { LibrosComponent } from './dashboard/libros/libros.component';
import { DashboardComponent } from './dashboard/dashboard/dashboard.component';
import { PrincipalComponent } from './paginas/principal/principal.component';
import { DashboardNavbarComponent } from './dashboard/dashboard-navbar/dashboard-navbar.component';
import { PrincipalNavbarComponent } from './paginas/principal-navbar/principal-navbar.component';
import { CatalogoComponent } from './paginas/catalogo/catalogo.component';
import { DetalleComponent } from './paginas/detalle/detalle.component';
import { PrestamoComponent } from './paginas/prestamo/prestamo.component';
import { RegistrarComponent } from './paginas/registrar/registrar.component';
import { CuentaComponent } from './paginas/cuenta/cuenta.component';
import { MisReservasComponent } from './paginas/mis-reservas/mis-reservas.component';
import { EjemplaresComponent } from './dashboard/ejemplares/ejemplares.component';
import { UsuariosComponent } from './dashboard/usuarios/usuarios.component';
import { ReservasComponent } from './dashboard/reservas/reservas.component';
import { HistorialComponent } from './dashboard/historial/historial.component';
import { AtrasadasComponent } from './dashboard/atrasadas/atrasadas.component';
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
        component: DashboardNavbarComponent,
        canActivate: [StaffGuard],
        children: [
            {
                path: '',
                component: DashboardComponent
            },
            {
                path: 'libros',
                component: LibrosComponent
            },
            {
                path: 'ejemplares',
                component: EjemplaresComponent
            },
            {
                path: 'usuarios',
                component: UsuariosComponent
            },
            {
                path: 'reservas',
                component: ReservasComponent
            },
            {
                path: 'historial',
                component: HistorialComponent,
                canActivate: [AdminGuard] // Reportes: solo Administrador
            },
            {
                path: 'atrasadas',
                component: AtrasadasComponent
            }
        ]
    }
];
