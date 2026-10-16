import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../services/payment';
import { PaymentHistoryResponse, ApiResponse } from '../../models/payment-model';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-history.html',
  styleUrl: './payment-history.css'
})
export class PaymentHistory {
  loanAccountId: number | null = null;
  payments: PaymentHistoryResponse[] = [];
  loading = false;
  errorMessage = '';

  constructor(private paymentService: PaymentService) {}

 loadPaymentHistory(): void {
  this.errorMessage = '';

  if (!this.loanAccountId || this.loanAccountId <= 0) {
    this.errorMessage = 'Enter a valid loan account ID.';
    return;
  }

  this.loading = true;

  this.paymentService.getPaymentHistory(this.loanAccountId).subscribe({
    next: (response) => {
      console.log('Full response:', response);
      console.log('Payment records:', response.data);

      this.payments = response.data ?? [];

      console.log('Payments assigned:', this.payments);
      console.log('Payment count:', this.payments.length);

      this.loading = false;
    },
    error: (error) => {
      console.error('Payment History API Error:', error);

      this.errorMessage =
        error?.error?.message || 'Unable to load payment history.';

      this.payments = [];
      this.loading = false;
    }
  });
}
}