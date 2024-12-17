import { Routes } from '@angular/router';
import { LoginComponent } from './business/auth/login/login.component';
import { PreventGuard } from './core/helpers/prevent.guard';
import { AuthGuard } from './core/helpers/auth.guard';
import { AuthenticatedGuard } from './core/helpers/authenticated.guard';

export const routes: Routes = [
    { path: 'landing-page', loadComponent: () => import('./shared/components/landing-page/layout/layout.component') },
    { path: 'login', component: LoginComponent, canActivate: [PreventGuard] },
    {
        path: '',
        loadComponent: () => import('./shared/components/layout/layout.component'),
        canActivate: [AuthGuard],
        children: [
            {
                path: 'panel',
                loadComponent: () => import('./business/dashboard/dashboard.component'),
                data: { title: 'Panel' },
                canActivate: [AuthenticatedGuard]
            },
            {
                path: 'vehiculos',
                loadComponent: () => import('./business/vehicles/vehicles.component'),
                data: { title: 'Vehículos' },
                canActivate: [AuthenticatedGuard],
                children: [
                    {
                        path: '',
                        loadComponent: () => import('./business/vehicles/vehicles-grid-view.component'),
                    },
                    {
                        path: 'detalles/:licensePlate',
                        loadComponent: () => import('./business/vehicles/shared/vehicle-details/vehicle-details.component'),
                        data: { title: 'Detalles del Vehículo' },
                        children: [
                            {
                                path: 'informacion-basica',
                                loadComponent: () => import('./business/vehicles/shared/vehicle-details/header-options/basic-info/basic-info.component'),
                                data: { title: 'Detalles del Vehículo' }
                            },
                            {
                                path: 'reservas',
                                loadComponent: () => import('./business/vehicles/shared/vehicle-details/header-options/bookings/bookings.component'),
                                data: { title: 'Detalles del Vehículo' }
                            },
                            {
                                path: 'estadisticas',
                                loadComponent: () => import('./business/vehicles/shared/vehicle-details/header-options/statistics/statistics.component'),
                                data: { title: 'Detalles del Vehículo' }
                            },
                            {
                                path: '',
                                redirectTo: 'informacion-basica',
                                pathMatch: 'full'
                            }
                        ]
                    },
                ]
            },
            {
                path: 'asuntos',
                loadComponent: () => import('./business/issues/issues.component'),
                data: { title: 'Asuntos' },
                children: [
                    { path: ':issue_type', loadComponent: () => import('./business/issues/shared/issues-view/issues-view.component'), data: { title: 'Asuntos' } },
                    { path: '', redirectTo: 'vehiculos', pathMatch: 'full' }
                ]
            },
            {
                path: 'recordatorios',
                loadComponent: () => import('./business/reminders/reminders.component'),
                data: { title: 'Recordatorios' },
                canActivate: [AuthenticatedGuard]
            },
            {
                path: 'conductores',
                loadComponent: () => import('./business/drivers/drivers.component'),
                data: { title: 'Conductores' },
                canActivate: [AuthenticatedGuard]
            },
            {
                path: 'reservas',
                loadComponent: () => import('./business/bookings/bookings.component'),
                data: { title: 'Reservas' },
                canActivate: [AuthenticatedGuard]
            },
            {
                path: 'clientes',
                loadComponent: () => import('./business/contacts/contacts.component'),
                data: { title: 'Clientes' },
                canActivate: [AuthenticatedGuard]
            },
            {
                path: 'rutas',
                loadComponent: () => import('./business/routes/routes.component'),
                data: { title: 'Rutas' }
            },
            {
                path: 'ajustes',
                loadComponent: () => import('./business/settings/settings.component'),
                data: { title: 'Ajustes' },
                canActivate: [AuthenticatedGuard]
            },
            {
                path: '', redirectTo: 'panel', pathMatch: 'full'
            }
        ]
    },
    { path: '**', redirectTo: 'panel' },
];

export class AppRoutingModule { }
