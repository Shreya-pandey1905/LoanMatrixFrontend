
import { Routes } from '@angular/router';
import { CustomerLayout } from './layouts/customer-layout/customer-layout';

export const routes: Routes = [
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
//       {
//   path: 'admin/support',
//   loadComponent: () =>
//     import('./features/admin/support-admin/support-admin')
//       .then(m => m.SupportAdmin)
// },

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'customer/dashboard',
    pathMatch: 'full'
  }
];