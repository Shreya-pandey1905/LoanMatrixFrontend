import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface SupportTicket {
  id: string;
  customerName: string;
  category: string;
  subject: string;
  message: string;
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED';
  date: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

@Component({
  selector: 'app-support-tickets',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support-tickets.html',
  styleUrls: ['./support-tickets.css']
})
export class SupportTickets implements OnInit {
  tickets: SupportTicket[] = [
    {
      id: 'LM-10421',
      customerName: 'Rahul Sharma',
      category: 'Disbursement',
      subject: 'Query on pending disbursement status after sanction acceptance',
      message: 'I accepted the sanction letter terms yesterday, please confirm when disbursement will credit to HDFC.',
      status: 'OPEN',
      date: '2026-10-17',
      priority: 'HIGH'
    },
    {
      id: 'LM-10398',
      customerName: 'Priya Patel',
      category: 'Foreclosure',
      subject: 'Request assistance with partial foreclosure payment settlement',
      message: 'Need help calculating remaining principal after ₹50,000 partial foreclosure.',
      status: 'IN_PROGRESS',
      date: '2026-10-16',
      priority: 'MEDIUM'
    },
    {
      id: 'LM-10350',
      customerName: 'Amit Verma',
      category: 'Loan Account',
      subject: 'EMI schedule download clarification',
      message: 'Could you please confirm if EMI auto-debit starts on the 5th of next month?',
      status: 'RESOLVED',
      date: '2026-10-15',
      priority: 'LOW'
    }
  ];

  selectedTicket: SupportTicket | null = null;
  filterStatus: string = 'ALL';
  replyText: string = '';

  ngOnInit(): void {}

  get filteredTickets(): SupportTicket[] {
    if (this.filterStatus === 'ALL') return this.tickets;
    return this.tickets.filter(t => t.status === this.filterStatus);
  }

  selectTicket(ticket: SupportTicket): void {
    this.selectedTicket = ticket;
    this.replyText = '';
  }

  updateStatus(status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'): void {
    if (this.selectedTicket) {
      this.selectedTicket.status = status;
    }
  }

  sendReply(): void {
    if (!this.replyText.trim() || !this.selectedTicket) return;
    alert(`Reply sent to customer ${this.selectedTicket.customerName} successfully!`);
    this.selectedTicket.status = 'RESOLVED';
    this.replyText = '';
  }
}
