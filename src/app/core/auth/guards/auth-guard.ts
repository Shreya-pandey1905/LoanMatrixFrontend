
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

  const role = authService.getRole()?.trim().toUpperCase();
  const requiredRole = route.data['role'] as string | undefined;

  // If this route requires a specific role, check it.
  if (requiredRole && role !== requiredRole.trim().toUpperCase()) {
    if (role === 'CUSTOMER') {
      return router.createUrlTree(['/customer/dashboard']);
    }

    if (role === 'LOAN_OFFICER' || role === 'LOAN OFFICER') {
      return router.createUrlTree(['/officer/dashboard']);
    }

    authService.logout();
    return router.createUrlTree(['/login']);
  }

  // Allow authenticated users when no specific role is required.
  if (role === 'CUSTOMER' || role === 'LOAN_OFFICER' || role === 'LOAN OFFICER') {
    return true;
  }

  // Invalid or missing role.
  authService.logout();
  return router.createUrlTree(['/login']);
};
