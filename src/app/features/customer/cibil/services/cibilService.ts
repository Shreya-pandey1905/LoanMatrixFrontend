
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

  constructor(private http: HttpClient) {}

  // Fetch CIBIL details for the selected customer
  getCibilDetails(
    customerId: number
  ): Observable<ApiResponse<CibilResponse>> {

    const params = new HttpParams()
      .set('customerId', customerId);

    return this.http.get<ApiResponse<CibilResponse>>(
      this.apiUrl,
      { params }
    );
  }

  // Generate CIBIL score for the selected customer
  generateCibilScore(
    customerId: number
  ): Observable<ApiResponse<CibilResponse>> {

    const params = new HttpParams()
      .set('customerId', customerId);

    return this.http.post<ApiResponse<CibilResponse>>(
      `${this.apiUrl}/generate`,
      null,
      { params }
    );
  }
}
