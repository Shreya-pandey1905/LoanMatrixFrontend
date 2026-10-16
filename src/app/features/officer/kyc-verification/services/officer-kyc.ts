import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PendingKycCustomer {
  customerId: number;
  customerName: string;
  email: string;
  mobileNo: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
export interface KycDocument {
  id: number;
  documentType: string;
  verificationStatus: string;
}


@Injectable({
  providedIn: 'root'
})
export class OfficerKyc {
  private apiUrl = 'http://localhost:8080/api/v1/kyc';

  constructor(private http: HttpClient) {}

  getPendingCustomers(): Observable<ApiResponse<PendingKycCustomer[]>> {
    return this.http.get<ApiResponse<PendingKycCustomer[]>>(
      `${this.apiUrl}/pending/customers`
    );
  }

  getCustomerDocuments(customerId: number): Observable<ApiResponse<KycDocument[]>> {
  return this.http.get<ApiResponse<KycDocument[]>>(
    `${this.apiUrl}/customer/${customerId}`
  );
}

approveDocument(documentId: number): Observable<any> {
  return this.http.put(
    `${this.apiUrl}/${documentId}/approve`,
    {}
  );
}

rejectDocument(documentId: number): Observable<any> {
  return this.http.put(
    `${this.apiUrl}/${documentId}/reject`,
    {}
  );
}

viewDocument(documentId: number): void {
  window.open(`${this.apiUrl}/document/${documentId}`, '_blank');
}
}
