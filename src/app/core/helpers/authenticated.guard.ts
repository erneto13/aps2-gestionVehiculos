import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Auth } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {

    constructor(private authService: Auth, private router: Router) { }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean {
        const userRole = this.authService.getUserRole();

        if (userRole === 'driver') {
            this.router.navigate(['/asuntos']);
            return false;
        }

        return true;
    }
}
