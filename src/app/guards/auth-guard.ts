import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.hasAccess()) {
    return true;
  }
  return router.createUrlTree(['/login']);
};

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If the user is logged in, redirect them away from the login page
  if (authService.isLoggedIn()) {
    return router.parseUrl('/home');
     // router.parseUrl('/home');
     //return router.navigateByUrl('home')
  }

  // Allow access to the login page if not logged in
  return true;
};
