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
      import('./features/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    canActivate: [guestGuard],
    loadComponent: () =>
      import('./features/auth/register/register').then(m => m.Register)
  },
  {
    path: 'verify-otp',
    loadComponent: () =>
      import('./features/auth/verify-otp/verify-otp').then(m => m.VerifyOtp)
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
          import('./features/customer/dashboard/pages/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'kyc',
        loadComponent: () =>
          import('./features/customer/kyc/pages/kyc').then(m => m.Kyc)
      },
      {
        path: 'cibil',
        loadComponent: () =>
          import('./features/customer/cibil/pages/cibil').then(m => m.Cibil)
      },
      {
        path: 'scorecard',
        loadComponent: () =>
          import('./features/customer/scorecard/pages/scorecard').then(m => m.Scorecard)
      },
      {
        path: 'emi-schedule',
        loadComponent: () =>
          import('./features/customer/emi-scheduler/pages/emi-scheduler').then(m => m.EmiScheduler)
      },
      {
        path: 'emis',
        redirectTo: 'emi-schedule',
        pathMatch: 'full'
      },
      {
        path: 'emi-scheduler',
        redirectTo: 'emi-schedule',
        pathMatch: 'full'
      },
      {
        path: 'loan-processing/apply',
        loadComponent: () =>
          import('./features/customer/loan-processing/apply-loan/apply-loan').then(m => m.ApplyLoan)
      },
      {
        path: 'loan-processing/sanction-letter',
        loadComponent: () =>
          import('./features/customer/loan-processing/sanction-letter/sanction-letter').then(m => m.CustomerSanctionLetter)
      },
      {
        path: 'loan-processing/disbursement',
        loadComponent: () =>
          import('./features/customer/loan-processing/disbursement/disbursement').then(m => m.Disbursement)
      },
      {
        path: 'disbursement',
        redirectTo: 'loan-processing/disbursement',
        pathMatch: 'full'
      },
      {
        path: 'loan-account',
        loadComponent: () =>
          import('./features/customer/my-loan-account/my-loan-account').then(m => m.MyLoanAccount)
      },
      {
        path: 'loan-accounts',
        redirectTo: 'loan-account',
        pathMatch: 'full'
      },
      {
        path: 'closure/full',
        loadComponent: () =>
          import('./features/customer/closure/full-closure/full-closure').then(m => m.FullClosure)
      },
      {
        path: 'closure/partial',
        loadComponent: () =>
          import('./features/customer/closure/partial-closure/partial-closure').then(m => m.PartialClosure)
      },
      {
        path: 'closure',
        redirectTo: 'closure/partial',
        pathMatch: 'full'
      },
      {
        path: 'track-status',
        loadComponent: () =>
          import('./features/customer/track-status/track-status').then(m => m.TrackStatus)
      },
      {
        path: 'support',
        loadComponent: () =>
          import('./features/customer/support/pages/support/support').then(m => m.Support)
      },
      {
        path: 'emi-payment',
        loadComponent: () =>
          import('./features/customer/payment/pages/payment-test/payment-test').then(m => m.EmiPayment)
      },
      {
        path: 'partial-closure-payment',
        loadComponent: () =>
          import('./features/customer/payment/pages/partial-closure-payment/partial-closure-payment').then(m => m.PartialClosurePayment)
      },
      {
        path: 'full-closure-payment',
        loadComponent: () =>
          import('./features/customer/payment/pages/full-closure-payment/full-closure-payment').then(m => m.FullClosurePayment)
      },
      {
        path: 'payment-history',
        loadComponent: () =>
          import('./features/customer/payment/pages/payment-history/payment-history').then(m => m.PaymentHistory)
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
          import('./features/officer/dashboard/pages/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'kyc-verification',
        loadComponent: () =>
          import('./features/officer/kyc-verification/pages/kyc-verification').then(m => m.KycVerification)
      },
      {
        path: 'kyc-verification/:customerId',
        loadComponent: () =>
          import('./features/officer/kyc-verification/pages/kyc-details/kyc-details').then(m => m.KycDetails)
      },
      {
        path: 'kyc-details/:customerId',
        redirectTo: 'kyc-verification/:customerId',
        pathMatch: 'full'
      },
      {
        path: 'reports',
        loadComponent: () =>
          import('./features/officer/reports/pages/reports/reports').then(m => m.Reports)
      },
      {
        path: 'eligibility-check',
        loadComponent: () =>
          import('./features/officer/eligibility/pages/eligibility-check/eligibility-check').then(m => m.EligibilityCheck)
      },
      {
        path: 'eligibility-result/:customerId',
        loadComponent: () =>
          import('./features/officer/eligibility/pages/eligibility-result/eligibility-result').then(m => m.EligibilityResult)
      },
      {
        path: 'support',
        loadComponent: () =>
          import('./features/officer/support/pages/support/support').then(m => m.Support)
      },
      {
        path: 'scorecard',
        loadComponent: () =>
          import('./features/officer/scorecard/pages/scorecard-list/scorecard-list').then(m => m.ScorecardList)
      },
      {
        path: 'scorecard/:customerId',
        loadComponent: () =>
          import('./features/officer/scorecard/pages/scorecard-details/scorecard-details').then(m => m.ScorecardDetails)
      },
      {
        path: 'emi-schedule',
        loadComponent: () =>
          import('./features/customer/emi-scheduler/pages/emi-scheduler').then(m => m.EmiScheduler)
      },
      {
        path: 'loan-processing/loan-applications',
        loadComponent: () =>
          import('./features/officer/loan-processing/loan-applications/loan-applications').then(m => m.LoanApplications)
      },
      {
        path: 'loan-applications',
        redirectTo: 'loan-processing/loan-applications',
        pathMatch: 'full'
      },
      {
        path: 'loan-processing/sanction-letters',
        loadComponent: () =>
          import('./features/officer/loan-processing/sanction-letters/sanction-letters').then(m => m.SanctionLetters)
      },
      {
        path: 'sanction-letters',
        redirectTo: 'loan-processing/sanction-letters',
        pathMatch: 'full'
      },
      {
        path: 'loan-processing/disbursements',
        loadComponent: () =>
          import('./features/officer/loan-processing/disbursements/disbursements').then(m => m.Disbursements)
      },
      {
        path: 'disbursements',
        redirectTo: 'loan-processing/disbursements',
        pathMatch: 'full'
      },
      {
        path: 'disbursement',
        redirectTo: 'loan-processing/disbursements',
        pathMatch: 'full'
      },
      {
        path: 'loan-processing/loan-accounts',
        loadComponent: () =>
          import('./features/officer/loan-processing/loan-accounts/loan-accounts').then(m => m.LoanAccounts)
      },
      {
        path: 'loan-accounts',
        redirectTo: 'loan-processing/loan-accounts',
        pathMatch: 'full'
      },
      {
        path: 'loan-account',
        redirectTo: 'loan-processing/loan-accounts',
        pathMatch: 'full'
      },
      {
        path: 'full-closure',
        loadComponent: () =>
          import('./features/officer/closure-requests/full-closure/full-closure').then(m => m.FullClosure)
      },
      {
        path: 'partial-closure',
        loadComponent: () =>
          import('./features/officer/closure-requests/partial-closure/partial-closure').then(m => m.PartialClosure)
      },
      {
        path: 'closure-requests/full-closure',
        redirectTo: 'full-closure',
        pathMatch: 'full'
      },
      {
        path: 'closure-requests/partial-closure',
        redirectTo: 'partial-closure',
        pathMatch: 'full'
      },
      {
        path: 'closure-requests',
        redirectTo: 'full-closure',
        pathMatch: 'full'
      },
      {
        path: 'closure',
        redirectTo: 'full-closure',
        pathMatch: 'full'
      },
      {
        path: 'support-ticket',
        loadComponent: () =>
          import('./features/officer/support-tickets/support-tickets').then(m => m.SupportTickets)
      },
      {
        path: 'support-tickets',
        redirectTo: 'support-ticket',
        pathMatch: 'full'
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
