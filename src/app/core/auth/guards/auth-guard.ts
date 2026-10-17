import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // User must be logged in.
  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login']);
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

  const requiredRole = route.data['role'] as string | undefined;

  // If this route requires a specific role, check it.
  if (requiredRole) {
    const normalizedReq = requiredRole.trim().toUpperCase();
    if (normalizedReq === 'CUSTOMER' && !isCustomer) {
      if (isOfficer) {
        return router.createUrlTree(['/officer/dashboard']);
      }
      authService.logout();
      return router.createUrlTree(['/login']);
    }

    if (
      (normalizedReq === 'OFFICER' || normalizedReq === 'LOAN_OFFICER') &&
      !isOfficer
    ) {
      if (isCustomer) {
        return router.createUrlTree(['/customer/dashboard']);
      }
      authService.logout();
      return router.createUrlTree(['/login']);
    }
  }

  // Allow authenticated users when no specific role is required.
  if (isCustomer || isOfficer) {
    return true;
  }

  // Invalid or missing role.
  authService.logout();
  return router.createUrlTree(['/login']);
};
