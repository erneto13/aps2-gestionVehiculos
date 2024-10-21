import { Routes } from '@angular/router';
import { LoginComponent } from './business/auth/login/login.component';
//import { AuthGuard } from '././core/helpers/auth.guard';
import { PreventGuard } from '././core/helpers/prevent.guard';
import LayoutComponent from './shared/components/layout/layout.component';
import { AuthGuard } from './core/helpers/auth.guard';


export const routes: Routes = [
    // Auth Paths
    { path: 'login', component: LoginComponent, canActivate: [PreventGuard] },  // Login route

    // Dashboard Paths
    { path: 'sidebar', component: LayoutComponent },
    {
        path: '',
        loadComponent: () => import('./shared/components/layout/layout.component'),
        canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./business/dashboard/dashboard.component')
            },
            {
                path: 'vehiculos',
                loadComponent: () => import('./business/vehicles/vehicles.component')
            },            {
                path: 'asuntos',
                loadComponent: () => import('./business/issues/issues.component')
            },
            {
                path: 'recordatorios',
                loadComponent: () => import('./business/reminders/reminders.component')
            },            {
                path: 'contactos',
                loadComponent: () => import('./business/contacts/contacts.component')
            },
            {
                path: 'rutas',
                loadComponent: () => import('./business/routes/routes.component')
            },
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            }
        ]
    },

    // Otherwise redirect to dashboard
    {
        path: '**',
        redirectTo: 'dashboard'
    }
]

export class AppRoutingModule { }
