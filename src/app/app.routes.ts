
import { Routes } from '@angular/router';

import { CustomerLayout } from './layouts/customer-layout/customer-layout';
import { OfficerLayout } from './layouts/officer-layout/officer-layout';

import { authGuard } from './core/auth/guards/auth-guard';
import { guestGuard } from './core/auth/guards/guest-guard';
import { TrackingStatus } from './features/customer/tracking-status/pages/tracking-status';

export const routes: Routes = [

  // Authentication Module
  {
    path: 'login',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/login/login')
        .then(m => m.Login)
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/register/register')
        .then(m => m.Register)
  },
  {
    path: 'verify-otp',
    loadComponent: () =>
      import('./features/auth/verify-otp/verify-otp')
        .then(m => m.VerifyOtp)
  },

  // Customer Module
  {
    path: 'customer',
    component: CustomerLayout,
    canActivate: [authGuard],
    data: { role: 'CUSTOMER' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/customer/dashboard/dashboard')
            .then(m => m.Dashboard)
      },
      {
        path: 'cibil',
        loadComponent: () =>
          import('./features/customer/cibil/pages/cibil')
            .then(m => m.Cibil)
      },
      {
        path: 'scorecard',
        loadComponent: () =>
          import('./features/customer/scorecard/pages/scorecard')
            .then(m => m.Scorecard)
      },
      {
      path: 'track-status',
      component: TrackingStatus
    },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Loan Officer Module
  {
    path: 'officer',
    component: OfficerLayout,
    canActivate: [authGuard],
    data: { role: 'LOAN_OFFICER' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/officer/dashboard/dashboard')
            .then(m => m.OfficerDashboard)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Default Route
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },


  // Unknown Route
  {
    path: '**',
    redirectTo: 'login'
  }
];
