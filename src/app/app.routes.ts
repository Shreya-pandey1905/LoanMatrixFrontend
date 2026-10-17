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
        path: 'loan-processing/apply',
        loadComponent: () =>
          import('./features/customer/loan-processing/apply-loan/apply-loan')
            .then(m => m.ApplyLoan)
      },
      {
        path: 'loan-processing/sanction-letter',
        loadComponent: () =>
          import('./features/customer/loan-processing/sanction-letter/sanction-letter')
            .then(m => m.CustomerSanctionLetter)
      },
      {
        path: 'loan-processing/disbursement',
        loadComponent: () =>
          import('./features/customer/loan-processing/disbursement/disbursement')
            .then(m => m.Disbursement)
      },
      
 // Inside Customer Module children in app.routes.ts:
{
  path: 'loan-account',
  loadComponent: () =>
    import('./features/customer/my-loan-account/my-loan-account')
      .then(m => m.MyLoanAccount)
},

      {
  path: 'closure/full',
  loadComponent: () =>
    import('./features/customer/closure/full-closure/full-closure')
      .then(m => m.FullClosure)
},
{
  path: 'closure/partial',
  loadComponent: () =>
    import('./features/customer/closure/partial-closure/partial-closure')
      .then(m => m.PartialClosure)
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
        path: 'loan-applications',
        loadComponent: () =>
          import('./features/officer/loan-processing/loan-applications/loan-applications')
            .then(m => m.LoanApplications)
      },
      {
        path: 'loan-processing/loan-applications',
        loadComponent: () =>
          import('./features/officer/loan-processing/loan-applications/loan-applications')
            .then(m => m.LoanApplications)
      },
      {
        path: 'sanction-letters',
        loadComponent: () =>
          import('./features/officer/loan-processing/sanction-letters/sanction-letters')
            .then(m => m.SanctionLetters)
      },
      {
        path: 'loan-processing/sanction-letters',
        loadComponent: () =>
          import('./features/officer/loan-processing/sanction-letters/sanction-letters')
            .then(m => m.SanctionLetters)
      },
  {
    path: 'loan-accounts',
    loadComponent: () =>
      import('./features/officer/loan-processing/loan-accounts/loan-accounts')
        .then(m => m.LoanAccounts)
  },
  {
    path: 'loan-processing/loan-accounts',
    loadComponent: () =>
      import('./features/officer/loan-processing/loan-accounts/loan-accounts')
        .then(m => m.LoanAccounts)
  },

{
      path: 'full-closure',
      loadComponent: () =>
        import('./features/officer/closure-requests/full-closure/full-closure')
          .then(m => m.FullClosure)
    },
    {
      path: 'partial-closure',
      loadComponent: () =>
        import('./features/officer/closure-requests/partial-closure/partial-closure')
          .then(m => m.PartialClosure)
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
    redirectTo: 'customer/dashboard'
  }
];