
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: unknown;
}

export interface CibilScoreRangeResponse {
  scoreRange: string;
  category: string;
  customerCount: number;
}

export interface ScoreCardWiseResponse {
  scoreCardId: number | null;
  customerId: number | null;
  customerName: string;
  appliedDate: string | null;
  cibilScore: number | null;
  riskCategory: string;
  eligibleLoanAmount: number;
  currentStatus: string;
  rejectionReason: string | null;
}

export interface ProductWiseResponse {
  loanType: string;
  totalLoans: number;
  totalLoanAmount: number;
}

export interface LoanPortfolioResponse {
  totalLoanAccounts: number;
  totalLoanAmount: number;
  totalOutstandingPrincipal: number;
  activeLoans: number;
  closedLoans: number;
  otherStatusLoans: number;
}

export interface EmiCollectionResponse {
  totalInstallments: number;
  totalScheduledAmount: number;
  totalCollectedAmount: number;
  paidInstallments: number;
  pendingInstallments: number;
  pendingAmount: number;
}

export interface OverdueReportResponse {
  totalOverdueInstallments: number;
  totalOverdueEmiAmount: number;
  totalPenaltyAmount: number;
  totalOverdueAmount: number;
  overdueLoanAccounts: number;
}

export interface DisbursementReportResponse {
  totalDisbursedLoans: number;
  totalDisbursedAmount: number;
  averageDisbursedAmount: number;
  latestDisbursementDate: string | null;
}

export interface PrepaymentReportResponse {
  totalPrepaidLoans: number;
  totalPrepaidAmount: number;
  averagePrepaidAmount: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportsService {
  private readonly http = inject(HttpClient);

  private readonly baseUrl =
    'http://localhost:8080/api/v1/officer/reports';

  getCibilScoreRange():
    Observable<ApiResponse<CibilScoreRangeResponse[]>> {
    return this.http.get<ApiResponse<CibilScoreRangeResponse[]>>(
      `${this.baseUrl}/cibil-score-range`
    );
  }

  getScoreCardWise():
    Observable<ApiResponse<ScoreCardWiseResponse[]>> {
    return this.http.get<ApiResponse<ScoreCardWiseResponse[]>>(
      `${this.baseUrl}/score-card-wise`
    );
  }

  getProductWise():
    Observable<ApiResponse<ProductWiseResponse[]>> {
    return this.http.get<ApiResponse<ProductWiseResponse[]>>(
      `${this.baseUrl}/product-wise`
    );
  }

  getLoanPortfolio():
    Observable<ApiResponse<LoanPortfolioResponse>> {
    return this.http.get<ApiResponse<LoanPortfolioResponse>>(
      `${this.baseUrl}/loan-portfolio`
    );
  }

  getEmiCollection():
    Observable<ApiResponse<EmiCollectionResponse>> {
    return this.http.get<ApiResponse<EmiCollectionResponse>>(
      `${this.baseUrl}/emi-collection`
    );
  }

  getOverdue():
    Observable<ApiResponse<OverdueReportResponse>> {
    return this.http.get<ApiResponse<OverdueReportResponse>>(
      `${this.baseUrl}/overdue`
    );
  }

  getDisbursement():
    Observable<ApiResponse<DisbursementReportResponse>> {
    return this.http.get<ApiResponse<DisbursementReportResponse>>(
      `${this.baseUrl}/disbursement`
    );
  }

  getPrepayment():
    Observable<ApiResponse<PrepaymentReportResponse>> {
    return this.http.get<ApiResponse<PrepaymentReportResponse>>(
      `${this.baseUrl}/prepayment`
    );
  }
}
