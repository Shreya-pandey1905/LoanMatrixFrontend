
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';
import {
  OfficerSupport,
  SupportTicket
} from '../../services/officer-support';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support.html',
  styleUrl: './support.css'
})
export class Support implements OnInit {

  tickets: SupportTicket[] = [];

  statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

  selectedTicket: SupportTicket | null = null;

  loading = false;
  detailsLoading = false;
  updatingTicketId: number | null = null;

  errorMessage = '';
  successMessage = '';

  constructor(private supportService: OfficerSupport) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.loading = true;
    this.errorMessage = '';

    this.supportService.getAllTickets()
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: (response) => {
          console.log('Officer tickets API response:', response);

          if (response?.success && Array.isArray(response.data)) {
            this.tickets = response.data;
          } else {
            this.tickets = [];
            this.errorMessage =
              response?.message || 'Unexpected response from server.';
          }

          console.log('Tickets loaded:', this.tickets.length);
        },
        error: (error) => {
          console.error('Unable to load officer tickets:', error);
          this.tickets = [];
          this.errorMessage =
            error.error?.message ||
            `Unable to load tickets. HTTP status: ${error.status || 'unknown'}.`;
        }
      });
  }

  countByStatus(status: string): number {
    return this.tickets.filter(ticket => ticket.status === status).length;
  }

  formatStatus(status: string): string {
    return status.replace(/_/g, ' ');
  }

  viewTicket(ticketId: number): void {
    this.detailsLoading = true;
    this.errorMessage = '';
    this.selectedTicket = null;

    this.supportService.getTicket(ticketId)
      .pipe(finalize(() => this.detailsLoading = false))
      .subscribe({
        next: (response) => {
          if (response?.success && response.data) {
            this.selectedTicket = response.data;
          } else {
            this.errorMessage = response?.message || 'Ticket details not found.';
          }
        },
        error: (error) => {
          console.error('Ticket details error:', error);
          this.errorMessage =
            error.error?.message || 'Unable to load ticket details.';
        }
      });
  }

  updateStatus(ticketId: number, status: string): void {
    const ticket = this.tickets.find(t => t.id === ticketId);

    if (!ticket || ticket.status === status) {
      return;
    }

    const previousStatus = ticket.status;

    this.updatingTicketId = ticketId;
    this.errorMessage = '';
    this.successMessage = '';

    this.supportService.updateTicketStatus(ticketId, status)
      .pipe(finalize(() => this.updatingTicketId = null))
      .subscribe({
        next: (response) => {
          if (!response?.success || !response.data) {
            this.errorMessage =
              response?.message || 'Unable to update ticket status.';
            this.loadTickets();
            return;
          }

          this.tickets = this.tickets.map(t =>
            t.id === ticketId ? response.data : t
          );

          if (this.selectedTicket?.id === ticketId) {
            this.selectedTicket = response.data;
          }

          this.successMessage = 'Ticket status updated successfully.';
        },
        error: (error) => {
          console.error('Status update error:', error);

          this.errorMessage =
            error.error?.message || 'Failed to update ticket status.';

          this.tickets = this.tickets.map(t =>
            t.id === ticketId ? { ...t, status: previousStatus } : t
          );
        }
      });
  }

  closeTicket(): void {
    this.selectedTicket = null;
  }
}
