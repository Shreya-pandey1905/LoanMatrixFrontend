
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupportService } from '../../services/support-service';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support.html',
  styleUrl: './support.css'
})
export class Support implements OnInit {

  customerId: number | null = null;

  subject = '';
  description = '';
  loanAccountId: number | null = null;

  tickets: any[] = [];

  constructor(private supportService: SupportService) {}

  ngOnInit(): void {
    const storedCustomerId = localStorage.getItem('customerId');

    if (storedCustomerId) {
      this.customerId = Number(storedCustomerId);
      this.loadTickets();
    } else {
      alert('Customer information not found. Please log in again.');
    }
  }

  loadTickets(): void {
    if (this.customerId === null) {
      return;
    }

    this.supportService
      .getCustomerTickets(this.customerId)
      .subscribe({
        next: (response) => {
          this.tickets = response.data;
        },
        error: (error) => {
          console.error('Failed to load tickets', error);
          alert('Could not load support tickets.');
        }
      });
  }

  createTicket(): void {
    if (!this.subject.trim() || !this.description.trim()) {
      alert('Please enter subject and description.');
      return;
    }

    if (this.customerId === null) {
      alert('Please log in again.');
      return;
    }

    const ticket = {
      subject: this.subject,
      description: this.description,
      loanAccountId: this.loanAccountId
    };

    this.supportService
      .createTicket(this.customerId, ticket)
      .subscribe({
        next: () => {
          alert('Ticket created successfully.');

          this.subject = '';
          this.description = '';
          this.loanAccountId = null;

          this.loadTickets();
        },
        error: (error) => {
          console.error('Failed to create ticket', error);
          alert('Failed to create ticket.');
        }
      });
  }
}
