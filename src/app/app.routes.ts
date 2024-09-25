import { Routes } from '@angular/router';
import { LoginComponent } from './business/auth/login/login.component';
import { ContactsComponent } from './business/contacts/contacts.component';
import { AuthGuard } from '././core/helpers/auth.guard';
import { PreventGuard } from '././core/helpers/prevent.guard';

export const routes: Routes = [
    // Auth Paths
    { path: 'login', component: LoginComponent, canActivate: [PreventGuard] },  // Login route
    { path: 'dashboard', component: ContactsComponent, canActivate: [AuthGuard] }, // Login route

    // Dashboard Paths
]

export class AppRoutingModule { }
