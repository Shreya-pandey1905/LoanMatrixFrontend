
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
  }

  const role = authService.getRole()?.toUpperCase();
  const requiredRole = route.data['role'];

  if (role === requiredRole) {
    return true;
  }

  if (role === 'CUSTOMER') {
    return router.createUrlTree(['/customer/dashboard']);
  }

  if (role === 'LOAN_OFFICER') {
    return router.createUrlTree(['/officer/dashboard']);
  }

  authService.logout();
  return router.createUrlTree(['/login']);
};
