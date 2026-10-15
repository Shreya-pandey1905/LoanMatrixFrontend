
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CustomerEligibilityResponse {
  customerId: number;
  customerName: string;
  cibilScore: number | null;
  eligible: boolean | null;
  eligibleLoanAmount: number | null;
  rejectionReason: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class ScorecardService {

  private readonly apiUrl =
    'http://localhost:8080/api/v1/user/eligibility/result';

  // TEMPORARY: For frontend testing until Angular authentication is ready.
  private readonly customerId = 20;

  constructor(private http: HttpClient) {}

  getCustomerEligibility():
    Observable<ApiResponse<CustomerEligibilityResponse>> {

    const params = new HttpParams()
      .set('customerId', this.customerId);

    return this.http.get<ApiResponse<CustomerEligibilityResponse>>(
      this.apiUrl,
      { params }
    );
  }
}
