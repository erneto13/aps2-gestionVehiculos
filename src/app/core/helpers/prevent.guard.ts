import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../services/auth.service';
import { inject } from '@angular/core';

export const PreventGuard: CanActivateFn = (route, state) =>{
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return router.navigate(['/panel']);
  } else {
    return true;
  }
}
