
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupportService } from '../../customer/support/services/support-service';

@Component({
  selector: 'app-support-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support-admin.html',
  styleUrl: './support-admin.css'
})
export class SupportAdmin implements OnInit {

  tickets: any[] = [];

  statuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

  constructor(private supportService: SupportService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.supportService.getAllTickets().subscribe({
      next: (response) => {
        this.tickets = response.data;
      },
      error: (error) => {
        console.error('Failed to load tickets', error);
        alert('Could not load support tickets.');
      }
    });
  }

  updateStatus(ticket: any): void {
    this.supportService
      .updateTicketStatus(ticket.id, ticket.status)
      .subscribe({
        next: () => {
          alert('Ticket status updated successfully.');
          this.loadTickets();
        },
        error: (error) => {
          console.error('Failed to update status', error);
          alert('Failed to update ticket status.');
        }
      });
  }
}
