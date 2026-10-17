import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/sanction-letter.model';
import {
  DisbursementRequestDto,
  DisbursementResponseDto
} from '../models/disbursement.model';

@Injectable({
  providedIn: 'root'
})
export class DisbursementService {
  private readonly baseUrl = 'http://localhost:8081/api/disbursements';

  constructor(private http: HttpClient) {}

  processDisbursement(payload: DisbursementRequestDto): Observable<ApiResponse<DisbursementResponseDto>> {
    return this.http.post<ApiResponse<DisbursementResponseDto>>(`${this.baseUrl}/process`, payload);
  }

  getAllDisbursements(): Observable<ApiResponse<DisbursementResponseDto[]>> {
    return this.http.get<ApiResponse<DisbursementResponseDto[]>>(`${this.baseUrl}/all`);
  }

  getDisbursementsByCustomerId(customerId: number): Observable<ApiResponse<DisbursementResponseDto[]>> {
    return this.http.get<ApiResponse<DisbursementResponseDto[]>>(`${this.baseUrl}/customer/${customerId}`);
  }

  getDisbursementByDealId(dealId: number): Observable<ApiResponse<DisbursementResponseDto>> {
    return this.http.get<ApiResponse<DisbursementResponseDto>>(`${this.baseUrl}/deal/${dealId}`);
  }
}