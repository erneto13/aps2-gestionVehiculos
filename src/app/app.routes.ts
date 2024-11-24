import { Routes } from '@angular/router';
import { LoginComponent } from './business/auth/login/login.component';
import { PreventGuard } from './core/helpers/prevent.guard';
import { AuthGuard } from './core/helpers/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [PreventGuard] },

    {
        path: '',
        loadComponent: () => import('./shared/components/layout/layout.component'),
        canActivate: [AuthGuard],
        children: [
            {
                path: 'panel',
                loadComponent: () => import('./business/dashboard/dashboard.component'),
                data: { title: 'Panel' }
            },
            {
                path: 'vehiculos',
                loadComponent: () => import('./business/vehicles/vehicles.component'),
                data: { title: 'Vehículos' },
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
                                data: { title: 'Información Básica' }
                            },
                            {
                                path: 'reservas',
                                loadComponent: () => import('./business/vehicles/shared/vehicle-details/header-options/bookings/bookings.component'),
                                data: { title: 'Reservas' }
                            },
                            {
                                path: 'estadisticas',
                                loadComponent: () => import('./business/vehicles/shared/vehicle-details/header-options/statistics/statistics.component'),
                                data: { title: 'Estadísticas' }
                            },
                            {
                                path: '',
                                redirectTo: 'informacion-basica',
                                pathMatch: 'full'
                            }
                        ]
                    },
                    {
                        path: 'documentacion',
                        loadComponent: () => import('./business/vehicles/documentation/documentation.component'),
                        data: { title: 'Documentación de Vehículos' }
                    },
                    {
                        path: 'mantenimiento',
                        loadComponent: () => import('./business/vehicles/maintenance/maintenance.component'),
                        data: { title: 'Mantenimiento de Vehículos' }
                    }
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
                data: { title: 'Recordatorios' }
            },
            {
                path: 'conductores',
                loadComponent: () => import('./business/drivers/drivers.component'),
                data: { title: 'Conductores' }
            },
            {
                path: 'reservas',
                loadComponent: () => import('./business/bookings/bookings.component'),
                data: { title: 'Reservas' }
            },
            {
                path: 'clientes',
                loadComponent: () => import('./business/contacts/contacts.component'),
                data: { title: 'Clientes' }
            },
            {
                path: 'rutas',
                loadComponent: () => import('./business/routes/routes.component'),
                data: { title: 'Rutas' }
            },
            {
                path: 'ajustes',
                loadComponent: () => import('./business/settings/settings.component'),
                data: { title: 'Ajustes' }
            },
            {
                path: '', redirectTo: 'panel', pathMatch: 'full'
            }
        ]
    },
    { path: '**', redirectTo: 'panel' },
];

export class AppRoutingModule { }
