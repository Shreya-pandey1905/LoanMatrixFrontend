
import { Routes } from '@angular/router';

import { CustomerLayout } from './layouts/customer-layout/customer-layout';
import { OfficerLayout } from './layouts/officer-layout/officer-layout';

import { authGuard } from './core/auth/guards/auth-guard';
import { guestGuard } from './core/auth/guards/guest-guard';

export const routes: Routes = [

  // Customer routes


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
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/customer/dashboard/pages/dashboard')
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
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Officer routes
  {
    path: 'officer',
    component: OfficerLayout,
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/officer/dashboard/pages/dashboard/dashboard')
            .then(m => m.Dashboard)
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/officer/reports/pages/reports/reports')
            .then(m => m.Reports)
      },
      {
        path: 'eligibility-check',
        loadComponent: () =>
          import('./features/officer/eligibility/pages/eligibility-check/eligibility-check')
            .then(m => m.EligibilityCheck)
      },
      {
        path: 'eligibility-result/:customerId',
        loadComponent: () =>
          import('./features/officer/eligibility/pages/eligibility-result/eligibility-result')
            .then(m => m.EligibilityResult)
      },

      // Officer scorecard customer list
      {
        path: 'scorecard',
        loadComponent: () =>
          import('./features/officer/scorecard/pages/scorecard-list/scorecard-list')
            .then(m => m.ScorecardList)
      },

      // Individual customer scorecard
      {
        path: 'scorecard/:customerId',
        loadComponent: () =>
          import('./features/officer/scorecard/pages/scorecard-details/scorecard-details')
            .then(m => m.ScorecardDetails)
      },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Default route
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Unknown routes
  {
    path: '**',
    redirectTo: 'login'
  }
];
