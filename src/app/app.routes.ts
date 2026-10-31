import { Routes } from '@angular/router';
import { LibrosComponent } from '@app/dashboard/libros/libros.component';
import { DashboardComponent } from '@app/dashboard/dashboard/dashboard.component';
import { PrincipalComponent } from '@app/paginas/principal/principal.component';
import { DashboardNavbarComponent } from '@app/dashboard/dashboard-navbar/dashboard-navbar.component';
import { PrincipalNavbarComponent } from '@app/paginas/principal-navbar/principal-navbar.component';
import { CatalogoComponent } from '@app/paginas/catalogo/catalogo.component';
import { DetalleComponent } from '@app/paginas/detalle/detalle.component';
import { PrestamoComponent } from '@app/paginas/prestamo/prestamo.component';
import { RegistrarComponent } from '@app/paginas/registrar/registrar.component';
import { CuentaComponent } from '@app/paginas/cuenta/cuenta.component';
import { MisReservasComponent } from '@app/paginas/mis-reservas/mis-reservas.component';
import { EjemplaresComponent } from '@app/dashboard/ejemplares/ejemplares.component';
import { UsuariosComponent } from '@app/dashboard/usuarios/usuarios.component';
import { ReservasComponent } from '@app/dashboard/reservas/reservas.component';
import { HistorialComponent } from '@app/dashboard/historial/historial.component';
import { AtrasadasComponent } from '@app/dashboard/atrasadas/atrasadas.component';
import { AdminGuard } from '@app/guards/admin-guard';
import { StaffGuard } from '@app/guards/staff-guard';

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
                loadComponent: () => import('@app/paginas/detalle/detalle.component').then(m => m.DetalleComponent)
            },
            {
                path: 'prestamo/:slug',
                loadComponent: () => import('@app/paginas/prestamo/prestamo.component').then(m => m.PrestamoComponent)
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
                loadComponent: () => import('@app/paginas/faq/faq.component').then(m => m.FaqComponent)
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
