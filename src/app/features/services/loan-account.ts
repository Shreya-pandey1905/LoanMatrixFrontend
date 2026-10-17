import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  LoanAccountSummaryDto,
  LoanAccountProfileDto,
  ApiResponse
} from '../models/loan-account.model';

@Injectable({
  providedIn: 'root'
})
export class LoanAccountService {
  private readonly baseUrl8080 = 'http://localhost:8080/api/loans/accounts';
  private readonly baseUrl8081 = 'http://localhost:8081/api/loans/accounts';

  constructor(private http: HttpClient) {}

  // 1. Officer: Fetch all accounts with optional status filter
  getOfficerAccounts(status?: string): Observable<ApiResponse<LoanAccountSummaryDto[]>> {
    let params = new HttpParams();
    if (status && status !== 'All Status' && status.trim() !== '') {
      params = params.set('status', status.trim());
    }
    return this.http.get<ApiResponse<LoanAccountSummaryDto[]>>(`${this.baseUrl8080}/officer/all`, { params }).pipe(
      catchError(() => this.http.get<ApiResponse<LoanAccountSummaryDto[]>>(`${this.baseUrl8081}/officer/all`, { params }))
    );
  }

  // 2. Customer: Fetch all accounts for logged-in customer (with dual-port fallback)
  getCustomerAccounts(customerId: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl8080}/customer/${customerId}`).pipe(
      catchError(() => this.http.get<any>(`${this.baseUrl8081}/customer/${customerId}`))
    );
  }

  // 3. Card Details: Fetch single account profile card by account number
  getAccountDetailsCard(loanAccountNo: string): Observable<ApiResponse<LoanAccountProfileDto>> {
    return this.http.get<ApiResponse<LoanAccountProfileDto>>(`${this.baseUrl8080}/details/${loanAccountNo}`).pipe(
      catchError(() => this.http.get<ApiResponse<LoanAccountProfileDto>>(`${this.baseUrl8081}/details/${loanAccountNo}`))
    );
  }
}