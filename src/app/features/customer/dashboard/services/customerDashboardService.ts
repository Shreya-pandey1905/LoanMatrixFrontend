
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CustomerLoanAccount {
  loanAccountId: number;
  loanAccountNo: string;
  loanAmount: number;
  outstandingPrincipal: number;
  interestRate: number;
  tenureMonths: number;
  emiAmount: number;
  totalPaidAmount: number;
  loanStatus: string;
  disbursementDate: string | null;
}

export interface CustomerPayment {
  paymentId: number;
  loanAccountNo: string | null;
  paymentName: string;
  paymentAmount: number;
  paymentDate: string | null;
  paymentStatus: string;
}

export interface CustomerDocument {
  documentId: number;
  documentType: string;
  verificationStatus: string;
}

export interface CustomerDashboardData {
  totalActiveLoanAccounts: number;
  loanAccounts: CustomerLoanAccount[];
  totalLoanAmount: number;
  totalOutstandingPrincipal: number;
  totalAmountPaid: number;
  emisPaid: number;
  emisPending: number;
  upcomingEmiAmount: number | null;
  upcomingEmiDueDate: string | null;
  recentPayments: CustomerPayment[];
  documents: CustomerDocument[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerDashboardService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8080/api/v1/user/dashboard';

  getDashboard(
    customerId: number
  ): Observable<ApiResponse<CustomerDashboardData>> {
    return this.http.get<ApiResponse<CustomerDashboardData>>(
      this.apiUrl,
      {
        params: {
          customerId: customerId.toString()
        }
      }
    );
  }
}
