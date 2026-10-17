
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: unknown;
}

export interface ScoreCard {
  customerId: number;
  customerName: string;
  panCard: string;
  cibilScore: number;
  riskCategory: string;
  eligibleLoanAmount: number;
  eligible: boolean;
}

export interface ScoreCardPage {
  content: ScoreCard[];
  totalElements: number;
  totalPages: number;
  number: number;
  first: boolean;
  last: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ScorecardService {

  private readonly apiUrl =
    'http://localhost:8080/api/v1/officer/score-card';

  constructor(private http: HttpClient) {}

  getCustomers(page: number = 0): Observable<ApiResponse<ScoreCardPage>> {
    return this.http.get<ApiResponse<ScoreCardPage>>(
      `${this.apiUrl}/customers?page=${page}`
    );
  }

  getScoreCard(customerId: number): Observable<ApiResponse<ScoreCard>> {
    return this.http.get<ApiResponse<ScoreCard>>(
      `${this.apiUrl}/${customerId}`
    );
  }
}
