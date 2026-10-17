import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoanAccountService } from '../../../../core/services/loan-account';
import { ForeclosureService } from '../../../../core/services/foreclosure';
import { LoanAccountSummaryDto } from '../../../../core/models/loan-account.model';
import { FullClosureResponseDto } from '../../../../core/models/foreclosure.model';

@Component({
  selector: 'app-full-closure',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './full-closure.html',
  styleUrls: ['./full-closure.css']
})
export class FullClosure implements OnInit {
  customerId: number = 1;
  accounts: LoanAccountSummaryDto[] = [];
  selectedAccount: LoanAccountSummaryDto | null = null;

  expectedClosureDate: string = '';
  reason: string = '';

  myRequests: FullClosureResponseDto[] = [];
  loading: boolean = false;
  submitting: boolean = false;
  processingPayment: boolean = false;

  constructor(
    private loanAccountService: LoanAccountService,
    private foreclosureService: ForeclosureService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const rawId = localStorage.getItem('customerId') || sessionStorage.getItem('customerId');
    this.customerId = rawId ? Number(rawId) : 1;

    const d = new Date();
    d.setDate(d.getDate() + 7);
    this.expectedClosureDate = d.toISOString().split('T')[0];

    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading = true;
    this.loanAccountService.getCustomerAccounts(this.customerId).subscribe({
      next: (res) => {
        this.loading = false;
        if (res && res.success && res.data && res.data.length > 0) {
          this.accounts = res.data;
          this.selectedAccount = this.accounts[0];
          this.loadRequests();
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onAccountChange(accNo: string): void {
    this.selectedAccount = this.accounts.find(a => a.loanAccountNo === accNo) || null;
    this.loadRequests();
  }

  loadRequests(): void {
    if (!this.selectedAccount) return;
    this.foreclosureService.getCustomerPayableFullRequests(this.selectedAccount.id).subscribe({
      next: (res) => {
        if (res && res.success) {
          this.myRequests = res.data || [];
        }
        this.cdr.detectChanges();
      }
    });
  }

  onTypeToggle(type: string): void {
    if (type === 'Partial') {
      this.router.navigate(['/customer/closure/partial']);
    }
  }

  submitRequest(): void {
    if (!this.selectedAccount) {
      alert('Please select an active loan account.');
      return;
    }

    this.submitting = true;

    this.foreclosureService.submitFullRequest({
      loanAccountId: this.selectedAccount.id,
      expectedClosureDate: this.expectedClosureDate,
      reason: this.reason || 'Full Foreclosure Settlement'
    }).subscribe({
      next: () => {
        this.submitting = false;
        alert('Full Foreclosure request submitted successfully! Awaiting officer review.');
        this.reason = '';
        this.loadRequests();
      },
      error: (err) => {
        this.submitting = false;
        alert(err.error?.message || 'Failed to submit full closure request.');
        this.cdr.detectChanges();
      }
    });
  }

  onPayClick(request: FullClosureResponseDto): void {
    const confirmPay = confirm(`Proceed to payment gateway to settle ₹ ${request.totalSettlementAmount} for Loan Account ${request.loanAccountNo}?`);
    if (!confirmPay) return;

    this.processingPayment = true;
    this.foreclosureService.processFullPayment(request.requestId).subscribe({
      next: () => {
        this.processingPayment = false;
        alert('Payment processed successfully! Loan Account is now fully CLOSED.');
        this.loadAccounts(); // Refreshes outstanding balance to 0 and status to CLOSED
      },
      error: (err) => {
        this.processingPayment = false;
        alert(err.error?.message || 'Payment processing failed.');
      }
    });
  }
}