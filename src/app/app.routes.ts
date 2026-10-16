
import { Routes } from '@angular/router';

import { CustomerLayout } from './layouts/customer-layout/customer-layout';
import { OfficerLayout } from './layouts/officer-layout/officer-layout';

import { authGuard } from './core/auth/guards/auth-guard';
import { guestGuard } from './core/auth/guards/guest-guard';

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
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/customer/dashboard/dashboard')
            .then(m => m.Dashboard)
      },
      {
        path: 'support',
        loadComponent: () =>
          import('./features/customer/support/pages/support/support')
            .then(m => m.Support)
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
        path: 'emi-payment',
        loadComponent: () =>
          import('./features/customer/payment/pages/payment-test/payment-test')
            .then(m => m.EmiPayment)
      },
      {
        path: 'partial-closure-payment',
        loadComponent: () =>
          import('./features/customer/payment/pages/partial-closure-payment/partial-closure-payment')
            .then(m => m.PartialClosurePayment)
      },
      {
        path: 'full-closure-payment',
        loadComponent: () =>
          import('./features/customer/payment/pages/full-closure-payment/full-closure-payment')
            .then(m => m.FullClosurePayment)
      },
      {
        path: 'payment-history',
        loadComponent: () =>
          import('./features/customer/payment/pages/payment-history/payment-history')
            .then(m => m.PaymentHistory)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },

  // Officer Module
  {
    path: 'officer',
    component: OfficerLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/officer/dashboard/dashboard')
            .then(m => m.OfficerDashboard)
      },
      {
        path: 'support',
        loadComponent: () =>
          import('./features/officer/support/pages/support/support')
            .then(m => m.Support)
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
