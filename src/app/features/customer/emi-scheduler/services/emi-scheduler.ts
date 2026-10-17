import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface LoanAccount {
  id: number;
  loanAccountNo: string;
  customerName: string;
  loanAmount: number;
  outstandingPrincipal: number;
  status: string;
  emiAmount: number;
  tenureMonths: number;
}

export interface EmiSchedule {
  id: number;
  installmentNo: number;
  dueDate: string;
  principalAmount: number;
  interestAmount: number;
  openingBalance: number;
  closingBalance: number;
  emi: number;
  paymentStatus: string;
  paidDate: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class EmiSchedulerService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getLoanAccounts(customerId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/api/loans/accounts/customer/${customerId}`
    );
  }

  getEmiSchedule(loanAccountId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/api/v1/emi/schedule/${loanAccountId}`
    );
  }
}
