
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth';

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Allow guests to access login and registration.
  if (!authService.isLoggedIn()) {
    return true;
  }

  const role = authService.getRole()?.trim().toUpperCase();

  // Redirect already logged-in customers.
  if (role === 'CUSTOMER') {
    return router.createUrlTree(['/customer/dashboard']);
  }

  // Redirect already logged-in loan officers.
  if (role === 'LOAN_OFFICER' || role === 'LOAN OFFICER') {
    return router.createUrlTree(['/officer/dashboard']);
  }

  // Invalid or missing role.
  authService.logout();
  return true;
};
