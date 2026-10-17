import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  FullClosureRequestDto,
  FullClosureResponseDto,
  PartialClosureRequestDto,
  PartialClosureResponseDto
} from '../models/foreclosure.model';

@Injectable({
  providedIn: 'root'
})
export class ForeclosureService {
  private readonly fullUrl = 'http://localhost:8080/api/loans/closure/full';
  private readonly partialUrl = 'http://localhost:8080/api/loans/closure/partial';

  constructor(private http: HttpClient) {}

  // ================= FULL CLOSURE =================
  submitFullRequest(dto: FullClosureRequestDto): Observable<ApiResponse<FullClosureResponseDto>> {
    return this.http.post<ApiResponse<FullClosureResponseDto>>(`${this.fullUrl}/request`, dto);
  }

  approveFullRequest(requestId: number, officerId: number): Observable<ApiResponse<FullClosureResponseDto>> {
    return this.http.put<ApiResponse<FullClosureResponseDto>>(
      `${this.fullUrl}/approve/${requestId}?officerId=${officerId}`,
      {}
    );
  }

  processFullPayment(requestId: number): Observable<ApiResponse<FullClosureResponseDto>> {
    return this.http.post<ApiResponse<FullClosureResponseDto>>(`${this.fullUrl}/pay/${requestId}`, {});
  }

  getPendingFullRequests(): Observable<ApiResponse<FullClosureResponseDto[]>> {
    return this.http.get<ApiResponse<FullClosureResponseDto[]>>(`${this.fullUrl}/pending`);
  }

  getCustomerPayableFullRequests(loanAccountId: number): Observable<ApiResponse<FullClosureResponseDto[]>> {
    return this.http.get<ApiResponse<FullClosureResponseDto[]>>(`${this.fullUrl}/customer-payable/${loanAccountId}`);
  }

  // ================= PARTIAL CLOSURE =================
  submitPartialRequest(dto: PartialClosureRequestDto): Observable<ApiResponse<PartialClosureResponseDto>> {
    return this.http.post<ApiResponse<PartialClosureResponseDto>>(`${this.partialUrl}/request`, dto);
  }

  approvePartialRequest(requestId: number, officerId: number): Observable<ApiResponse<PartialClosureResponseDto>> {
    return this.http.put<ApiResponse<PartialClosureResponseDto>>(
      `${this.partialUrl}/approve/${requestId}?officerId=${officerId}`,
      {}
    );
  }

  processPartialPayment(requestId: number): Observable<ApiResponse<PartialClosureResponseDto>> {
    return this.http.post<ApiResponse<PartialClosureResponseDto>>(`${this.partialUrl}/pay/${requestId}`, {});
  }

  getPendingPartialRequests(): Observable<ApiResponse<PartialClosureResponseDto[]>> {
    return this.http.get<ApiResponse<PartialClosureResponseDto[]>>(`${this.partialUrl}/pending`);
  }

  getPartialRequestsByAccount(loanAccountId: number): Observable<ApiResponse<PartialClosureResponseDto[]>> {
    return this.http.get<ApiResponse<PartialClosureResponseDto[]>>(`${this.partialUrl}/account/${loanAccountId}`);
  }
}