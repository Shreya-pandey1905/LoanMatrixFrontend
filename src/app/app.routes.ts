
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
  path: 'kyc',
  loadComponent: () =>
    import('./features/customer/kyc/pages/kyc')
      .then(m => m.Kyc)
},
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