import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface OfficerDashboardData {
  totalCustomers: number;
  loanCustomers: number;
  approvedKyc: number;
  totalLoanAmount: number;
  activeLoans: number;
  todaysCollection: number;
  pendingEmi: number;
  foreclosureRequests: number;
}

export interface OfficerDashboardApiResponse {
  success: boolean;
  message: string;
  data: OfficerDashboardData;
}

@Injectable({
  providedIn: 'root'
})
export class OfficerDashboardService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8080/api/v1/officer/dashboard';

  getDashboard(): Observable<OfficerDashboardApiResponse> {
    return this.http.get<OfficerDashboardApiResponse>(
      this.apiUrl
    );
  }
}