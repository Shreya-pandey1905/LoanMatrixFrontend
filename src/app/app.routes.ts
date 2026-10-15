
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
  path: 'kyc',
  loadComponent: () =>
    import('./features/customer/kyc/pages/kyc')
      .then(m => m.Kyc)
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
