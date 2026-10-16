
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    return true;
  }

  const role = authService.getRole()?.toUpperCase();

  if (role === 'CUSTOMER') {
    return router.createUrlTree(['/customer/dashboard']);
  }

  if (role === 'LOAN_OFFICER') {
    return router.createUrlTree(['/officer/dashboard']);
  }

  authService.logout();
  return true;
};
