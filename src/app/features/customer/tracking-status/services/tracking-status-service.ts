
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../../../environments/environment';
import {
  ApiResponse,
  CustomerDashboardResponse,
  TrackingStatusResponse
} from '../models/trackingStatus.model';

@Injectable({
  providedIn: 'root'
})
export class TrackingStatusService {

  private apiUrl = `${environment.apiUrl}/api/v1/user`;

  constructor(private http: HttpClient) {}

  // Profile, application progress, EMI summary and recent activity
  getTrackingStatus(customerId: number): Observable<TrackingStatusResponse> {
    const params = new HttpParams().set('customerId', customerId);

    return this.http.get<TrackingStatusResponse>(
      `${this.apiUrl}/tracking-status`,
      { params }
    );
  }

  // Loan accounts, EMIs, payments and documents
  getDashboard(customerId: number): Observable<CustomerDashboardResponse> {
    const params = new HttpParams().set('customerId', customerId);

    return this.http
      .get<ApiResponse<CustomerDashboardResponse>>(
        `${this.apiUrl}/dashboard`,
        { params }
      )
      .pipe(map(response => response.data));
  }
}
