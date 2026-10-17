import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  LoanAccountSummaryDto,
  LoanAccountProfileDto,
  ApiResponse
} from '../models/loan-account.model';

@Injectable({
  providedIn: 'root'
})
export class LoanAccountService {
  private readonly baseUrl = 'http://localhost:8081/api/loans/accounts';

  constructor(private http: HttpClient) {}

  // 1. Officer: Fetch all accounts with optional status filter
  getOfficerAccounts(status?: string): Observable<ApiResponse<LoanAccountSummaryDto[]>> {
    let params = new HttpParams();
    if (status && status !== 'All Status' && status.trim() !== '') {
      params = params.set('status', status.trim());
    }
    return this.http.get<ApiResponse<LoanAccountSummaryDto[]>>(`${this.baseUrl}/officer/all`, { params });
  }

  // 2. Customer: Fetch all accounts for logged-in customer
  getCustomerAccounts(customerId: number): Observable<ApiResponse<LoanAccountSummaryDto[]>> {
    return this.http.get<ApiResponse<LoanAccountSummaryDto[]>>(`${this.baseUrl}/customer/${customerId}`);
  }

  // 3. Card Details: Fetch single account profile card by account number
  getAccountDetailsCard(loanAccountNo: string): Observable<ApiResponse<LoanAccountProfileDto>> {
    return this.http.get<ApiResponse<LoanAccountProfileDto>>(`${this.baseUrl}/details/${loanAccountNo}`);
  }
}