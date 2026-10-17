
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SupportTicket {
  id: number;
  customerId: number;
  loanAccountId: number | null;
  subject: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class OfficerSupport {

  private readonly apiUrl = 'http://localhost:8080/api/v1/support/admin/tickets';

  constructor(private http: HttpClient) {}

  getAllTickets(): Observable<ApiResponse<SupportTicket[]>> {
    return this.http.get<ApiResponse<SupportTicket[]>>(this.apiUrl);
  }

  getTicket(ticketId: number): Observable<ApiResponse<SupportTicket>> {
    return this.http.get<ApiResponse<SupportTicket>>(
      `${this.apiUrl}/${ticketId}`
    );
  }

  updateTicketStatus(
    ticketId: number,
    status: string
  ): Observable<ApiResponse<SupportTicket>> {
    return this.http.patch<ApiResponse<SupportTicket>>(
      `${this.apiUrl}/${ticketId}/status`,
      { status }
    );
  }
}
