
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import {
  ApiResponse,
  CreatePaymentRequest,
  PaymentHistoryResponse,
  PaymentOrderResponse,
  VerifyPaymentRequest
} from '../models/payment-model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly baseUrl =
    'http://localhost:8080/api/v1/payment';

  constructor(private http: HttpClient) {}

  // =========================
  // EMI PAYMENT
  // =========================

  createEmiOrder(
    request: CreatePaymentRequest
  ): Observable<PaymentOrderResponse> {
    return this.http
      .post<ApiResponse<PaymentOrderResponse>>(
        `${this.baseUrl}/create-order`,
        request
      )
      .pipe(map(res => res.data));
  }

  verifyEmiPayment(
    request: VerifyPaymentRequest
  ): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.baseUrl}/verify-payment`,
      request
    );
  }

  // =========================
  // PARTIAL CLOSURE PAYMENT
  // =========================

  createPartialClosureOrder(
    requestId: number
  ): Observable<PaymentOrderResponse> {
    return this.http
      .post<ApiResponse<PaymentOrderResponse>>(
        `${this.baseUrl}/partial-closure/create-order/${requestId}`,
        {}
      )
      .pipe(map(res => res.data));
  }

  verifyPartialClosurePayment(
    request: VerifyPaymentRequest
  ): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.baseUrl}/partial-closure/verify-payment`,
      request
    );
  }

  // =========================
  // FULL CLOSURE PAYMENT
  // =========================

  createFullClosureOrder(
    requestId: number
  ): Observable<PaymentOrderResponse> {
    return this.http.post<PaymentOrderResponse>(
      `${this.baseUrl}/full-closure/create-order/${requestId}`,
      {}
    );
  }

  verifyFullClosurePayment(
    request: VerifyPaymentRequest
  ): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/full-closure/verify-payment`,
      request,
      { responseType: 'text' }
    );
  }

  // =========================
  // PAYMENT HISTORY
  // =========================

  getPaymentHistory(
    loanAccountId: number
  ): Observable<ApiResponse<PaymentHistoryResponse[]>> {
    return this.http.get<ApiResponse<PaymentHistoryResponse[]>>(
      `${this.baseUrl}/history/${loanAccountId}`
    );
  }
}



