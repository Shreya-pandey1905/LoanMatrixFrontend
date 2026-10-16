import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PendingCustomer {
  customerId: number;
  customerName: string;
}

export interface EligibilityData {
  customerId: number;
  customerName: string;
  cibilScore: number;
  cibilRange: string;
  eligibleLoanAmount: number | null;
  eligible: boolean;
  autoApproved: boolean;
  officerActionRequired: boolean;
  panCard: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class EligibilityService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    'http://localhost:8080/api/v1/officer/eligibility';

  getPendingCustomers(): Observable<ApiResponse<PendingCustomer[]>> {
    return this.http.get<ApiResponse<PendingCustomer[]>>(
      `${this.apiUrl}/pending-customers`
    );
  }

  checkEligibility(
    customerId: number
  ): Observable<ApiResponse<EligibilityData>> {
    const params = new HttpParams()
      .set('customerId', customerId);

    return this.http.post<ApiResponse<EligibilityData>>(
      `${this.apiUrl}/check`,
      null,
      { params }
    );
  }

  approveEligibility(customerId: number): Observable<ApiResponse<null>> {
    const params = new HttpParams()
      .set('customerId', customerId);

    return this.http.post<ApiResponse<null>>(
      `${this.apiUrl}/approve`,
      null,
      { params }
    );
  }

  rejectEligibility(customerId: number): Observable<ApiResponse<null>> {
    const params = new HttpParams()
      .set('customerId', customerId);

    return this.http.post<ApiResponse<null>>(
      `${this.apiUrl}/reject`,
      null,
      { params }
    );
  }
}
