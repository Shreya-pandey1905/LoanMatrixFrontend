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

  const rawRole = authService.getRole()?.trim().toUpperCase() || '';
  const isOfficer =
    rawRole === 'OFFICER' ||
    rawRole === 'LOAN_OFFICER' ||
    rawRole === 'LOAN OFFICER' ||
    rawRole === 'ROLE_OFFICER' ||
    rawRole === 'ROLE_LOAN_OFFICER' ||
    rawRole.includes('OFFICER');

  const isCustomer =
    rawRole === 'CUSTOMER' ||
    rawRole === 'ROLE_CUSTOMER';

  // Redirect already logged-in customers.
  if (isCustomer) {
    return router.createUrlTree(['/customer/dashboard']);
  }

  // Redirect already logged-in loan officers.
  if (isOfficer) {
    return router.createUrlTree(['/officer/dashboard']);
  }

  // Invalid or missing role.
  authService.logout();
  return true;
};
