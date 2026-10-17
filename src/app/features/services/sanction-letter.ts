import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  SanctionLetterResponseDto,
  SanctionLetterDetailDto,
  GenerateSanctionRequestDto,
  ApiResponse
} from '../models/sanction-letter.model';

@Injectable({
  providedIn: 'root'
})
export class SanctionLetterService {
  private readonly baseUrl = 'http://localhost:8080/api/sanction-letters';
  private readonly loansUrl = 'http://localhost:8080/api/loans';

  constructor(private http: HttpClient) {}

  // 1. Officer: Fetch all sanction letters for table
  getAllSanctionLetters(): Observable<ApiResponse<SanctionLetterResponseDto[]>> {
    return this.http.get<ApiResponse<SanctionLetterResponseDto[]>>(`${this.baseUrl}/all`);
  }

  // 2. Officer: Fetch all deals to find approved customers for dropdown
 // Fetch APPROVED deals for the modal dropdown
  getAllDeals(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.loansUrl}/approved`);
  }

  // 3. Officer: Generate sanction letter record
  generateSanctionLetter(request: GenerateSanctionRequestDto): Observable<ApiResponse<SanctionLetterResponseDto>> {
    return this.http.post<ApiResponse<SanctionLetterResponseDto>>(`${this.baseUrl}/generate`, request);
  }

  // 4. Officer & Customer: Fetch printable formal letter document by dealId
  getDocumentByDealId(dealId: number): Observable<ApiResponse<SanctionLetterDetailDto>> {
    return this.http.get<ApiResponse<SanctionLetterDetailDto>>(`${this.baseUrl}/document/deal/${dealId}`);
  }

  // 5. Customer: Fetch letters belonging to the logged-in customer
  getLettersByCustomerId(customerId: number): Observable<ApiResponse<SanctionLetterResponseDto[]>> {
    return this.http.get<ApiResponse<SanctionLetterResponseDto[]>>(`${this.baseUrl}/customer/${customerId}`);
  }
}