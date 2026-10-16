
import { Routes } from '@angular/router';

import { CustomerLayout } from './layouts/customer-layout/customer-layout';
import { OfficerLayout } from './layouts/officer-layout/officer-layout';

export const routes: Routes = [
  // Customer Module
  {
    path: 'customer',
    component: CustomerLayout,
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

      // EMI Payment
      {
        path: 'emi-payment',
        loadComponent: () =>
          import('./features/customer/payment/pages/payment-test/payment-test')
            .then(m => m.EmiPayment)
      },

      // Partial Closure Payment
      {
        path: 'partial-closure-payment',
        loadComponent: () =>
          import('./features/customer/payment/pages/partial-closure-payment/partial-closure-payment')
            .then(m => m.PartialClosurePayment)
      },

      // Full Closure Payment
      {
        path: 'full-closure-payment',
        loadComponent: () =>
          import('./features/customer/payment/pages/full-closure-payment/full-closure-payment')
            .then(m => m.FullClosurePayment)
      },

      // Payment History
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
    redirectTo: 'customer/dashboard',
    pathMatch: 'full'
  },

  // Unknown Route
  {
    path: '**',
    redirectTo: 'officer/dashboard'
  }
];
