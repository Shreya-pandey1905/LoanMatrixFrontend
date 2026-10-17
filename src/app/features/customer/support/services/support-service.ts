
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SupportService {

  private apiUrl = 'http://localhost:8080/api/v1/support';

  constructor(private http: HttpClient) {}

  createTicket(customerId: number, ticket: any): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}/createTicket?customerId=${customerId}`,
      ticket
    );
  }

  getCustomerTickets(customerId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/tickets?customerId=${customerId}`
    );
  }

  getTicket(ticketId: number, customerId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/tickets/${ticketId}?customerId=${customerId}`
    );
  }

  getAllTickets(): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/admin/tickets`
    );
  }

  getAdminTicket(ticketId: number): Observable<any> {
    return this.http.get<any>(
      `${this.apiUrl}/admin/tickets/${ticketId}`
    );
  }

  updateTicketStatus(ticketId: number, status: string): Observable<any> {
    return this.http.patch<any>(
      `${this.apiUrl}/admin/tickets/${ticketId}/status`,
      { status: status }
    );
  }
}
