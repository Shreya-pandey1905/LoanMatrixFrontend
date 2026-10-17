import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-support',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './support.html',
  styleUrls: ['./support.css']
})
export class CustomerSupport {
  subject: string = '';
  category: string = 'Loan Account';
  message: string = '';
  submitted: boolean = false;

  faqs = [
    {
      q: 'How do I request Full or Partial Foreclosure?',
      a: 'Navigate to "Closure" in the sidebar, select Partial or Full Closure, choose your active loan account, and submit your request for officer verification.'
    },
    {
      q: 'When will funds be disbursed after sanction letter acceptance?',
      a: 'Once you accept the terms on your Sanction Letter, our loan officer verifies bank details and disburses funds within 24-48 business hours.'
    },
    {
      q: 'How can I view my EMI schedule and payment receipts?',
      a: 'Click on "EMI Schedule" from the sidebar menu to view all past and upcoming EMI installments and outstanding balance details.'
    },
    {
      q: 'What documents are required for KYC verification?',
      a: 'Government-issued ID (Aadhaar, Passport, or Voter ID), PAN card, and recent address proof or utility bill.'
    }
  ];

  submitTicket(): void {
    if (!this.subject.trim() || !this.message.trim()) return;
    this.submitted = true;
  }

  resetForm(): void {
    this.subject = '';
    this.category = 'Loan Account';
    this.message = '';
    this.submitted = false;
  }
}
