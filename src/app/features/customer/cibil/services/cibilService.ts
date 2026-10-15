
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CibilResponse {
  customerName: string;
  panCard: string;
  cibilScore?: number;
  checkDate?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class CibilService {

  private readonly apiUrl = 'http://localhost:8080/api/v1/cibil';

  // TEMPORARY: Replace with an existing customer ID from MySQL.
  private readonly customerId = 20;

  constructor(private http: HttpClient) {}

  getCibilDetails(): Observable<ApiResponse<CibilResponse>> {
    const params = new HttpParams()
      .set('customerId', this.customerId);

    return this.http.get<ApiResponse<CibilResponse>>(
      this.apiUrl,
      { params }
    );
  }

  generateCibilScore(): Observable<ApiResponse<CibilResponse>> {
    const params = new HttpParams()
      .set('customerId', this.customerId);

    return this.http.post<ApiResponse<CibilResponse>>(
      `${this.apiUrl}/generate`,
      null,
      { params }
    );
  }
}
