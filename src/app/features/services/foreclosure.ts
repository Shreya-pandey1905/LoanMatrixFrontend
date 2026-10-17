import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
  private readonly fullUrl8080 = 'http://localhost:8080/api/loans/closure/full';
  private readonly fullUrl8081 = 'http://localhost:8081/api/loans/closure/full';

  private readonly partialUrl8080 = 'http://localhost:8080/api/loans/closure/partial';
  private readonly partialUrl8081 = 'http://localhost:8081/api/loans/closure/partial';

  constructor(private http: HttpClient) {}

  // ================= FULL CLOSURE =================
  submitFullRequest(dto: FullClosureRequestDto): Observable<ApiResponse<FullClosureResponseDto>> {
    return this.http.post<ApiResponse<FullClosureResponseDto>>(`${this.fullUrl8080}/request`, dto).pipe(
      catchError(() => this.http.post<ApiResponse<FullClosureResponseDto>>(`${this.fullUrl8081}/request`, dto))
    );
  }

  approveFullRequest(requestId: number, officerId: number): Observable<ApiResponse<FullClosureResponseDto>> {
    return this.http.put<ApiResponse<FullClosureResponseDto>>(
      `${this.fullUrl8080}/approve/${requestId}?officerId=${officerId}`,
      {}
    ).pipe(
      catchError(() => this.http.put<ApiResponse<FullClosureResponseDto>>(
        `${this.fullUrl8081}/approve/${requestId}?officerId=${officerId}`,
        {}
      ))
    );
  }

  processFullPayment(requestId: number): Observable<ApiResponse<FullClosureResponseDto>> {
    return this.http.post<ApiResponse<FullClosureResponseDto>>(`${this.fullUrl8080}/pay/${requestId}`, {}).pipe(
      catchError(() => this.http.post<ApiResponse<FullClosureResponseDto>>(`${this.fullUrl8081}/pay/${requestId}`, {}))
    );
  }

  getPendingFullRequests(): Observable<ApiResponse<FullClosureResponseDto[]>> {
    return this.http.get<ApiResponse<FullClosureResponseDto[]>>(`${this.fullUrl8080}/pending`).pipe(
      catchError(() => this.http.get<ApiResponse<FullClosureResponseDto[]>>(`${this.fullUrl8081}/pending`))
    );
  }

  getCustomerPayableFullRequests(loanAccountId: number): Observable<ApiResponse<FullClosureResponseDto[]>> {
    return this.http.get<ApiResponse<FullClosureResponseDto[]>>(`${this.fullUrl8080}/customer-payable/${loanAccountId}`).pipe(
      catchError(() => this.http.get<ApiResponse<FullClosureResponseDto[]>>(`${this.fullUrl8081}/customer-payable/${loanAccountId}`))
    );
  }

  // ================= PARTIAL CLOSURE =================
  submitPartialRequest(dto: PartialClosureRequestDto): Observable<ApiResponse<PartialClosureResponseDto>> {
    return this.http.post<ApiResponse<PartialClosureResponseDto>>(`${this.partialUrl8080}/request`, dto).pipe(
      catchError(() => this.http.post<ApiResponse<PartialClosureResponseDto>>(`${this.partialUrl8081}/request`, dto))
    );
  }

  approvePartialRequest(requestId: number, officerId: number): Observable<ApiResponse<PartialClosureResponseDto>> {
    return this.http.put<ApiResponse<PartialClosureResponseDto>>(
      `${this.partialUrl8080}/approve/${requestId}?officerId=${officerId}`,
      {}
    ).pipe(
      catchError(() => this.http.put<ApiResponse<PartialClosureResponseDto>>(
        `${this.partialUrl8081}/approve/${requestId}?officerId=${officerId}`,
        {}
      ))
    );
  }

  processPartialPayment(requestId: number): Observable<ApiResponse<PartialClosureResponseDto>> {
    return this.http.post<ApiResponse<PartialClosureResponseDto>>(`${this.partialUrl8080}/pay/${requestId}`, {}).pipe(
      catchError(() => this.http.post<ApiResponse<PartialClosureResponseDto>>(`${this.partialUrl8081}/pay/${requestId}`, {}))
    );
  }

  getPendingPartialRequests(): Observable<ApiResponse<PartialClosureResponseDto[]>> {
    return this.http.get<ApiResponse<PartialClosureResponseDto[]>>(`${this.partialUrl8080}/pending`).pipe(
      catchError(() => this.http.get<ApiResponse<PartialClosureResponseDto[]>>(`${this.partialUrl8081}/pending`))
    );
  }

  getPartialRequestsByAccount(loanAccountId: number): Observable<ApiResponse<PartialClosureResponseDto[]>> {
    return this.http.get<ApiResponse<PartialClosureResponseDto[]>>(`${this.partialUrl8080}/account/${loanAccountId}`).pipe(
      catchError(() => this.http.get<ApiResponse<PartialClosureResponseDto[]>>(`${this.partialUrl8081}/account/${loanAccountId}`))
    );
  }
}