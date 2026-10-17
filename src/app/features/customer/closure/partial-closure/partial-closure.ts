import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoanAccountService } from '../../../services/loan-account';
import { ForeclosureService } from '../../../services/foreclosure';
import { LoanAccountSummaryDto } from '../../../models/loan-account.model';
import { PartialClosureResponseDto } from '../../../models/foreclosure.model';

@Component({
  selector: 'app-partial-closure',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './partial-closure.html',
  styleUrls: ['./partial-closure.css']
})
export class PartialClosure implements OnInit {
  customerId: number = 1;
  accounts: LoanAccountSummaryDto[] = [];
  selectedAccount: LoanAccountSummaryDto | null = null;

  partialAmount: number | null = null;
  expectedClosureDate: string = '';
  reason: string = '';

  myRequests: PartialClosureResponseDto[] = [];
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
    this.foreclosureService.getPartialRequestsByAccount(this.selectedAccount.id).subscribe({
      next: (res) => {
        if (res && res.success) {
          this.myRequests = res.data || [];
        }
        this.cdr.detectChanges();
      }
    });
  }

  onTypeToggle(type: string): void {
    if (type === 'Full') {
      this.router.navigate(['/customer/closure/full']);
    }
  }

  submitRequest(): void {
    if (!this.selectedAccount) {
      alert('Please select an active loan account.');
      return;
    }

    if (!this.partialAmount || this.partialAmount <= 0) {
      alert('Please enter a valid partial foreclosure amount.');
      return;
    }

    if (this.partialAmount >= this.selectedAccount.outstandingPrincipal) {
      alert('Partial amount cannot equal or exceed total outstanding principal. Use Full Foreclosure instead.');
      return;
    }

    this.submitting = true;

    this.foreclosureService.submitPartialRequest({
      loanAccountId: this.selectedAccount.id,
      partialAmount: this.partialAmount,
      expectedClosureDate: this.expectedClosureDate,
      reason: this.reason || 'Partial Prepayment'
    }).subscribe({
      next: () => {
        this.submitting = false;
        alert('Partial closure request submitted successfully! Awaiting officer review.');
        this.partialAmount = null;
        this.reason = '';
        this.loadRequests();
      },
      error: (err) => {
        this.submitting = false;
        alert(err.error?.message || 'Failed to submit partial closure request.');
        this.cdr.detectChanges();
      }
    });
  }

  onPayClick(request: PartialClosureResponseDto): void {
    const confirmPay = confirm(`Proceed to payment gateway to make partial prepayment of ₹ ${request.partialAmount} for Loan Account ${request.loanAccountNo}?`);
    if (!confirmPay) return;

    this.processingPayment = true;
    this.foreclosureService.processPartialPayment(request.requestId).subscribe({
      next: () => {
        this.processingPayment = false;
        alert('Partial prepayment processed successfully! Outstanding principal updated.');
        this.loadAccounts(); // Refreshes reduced principal balance
      },
      error: (err) => {
        this.processingPayment = false;
        alert(err.error?.message || 'Payment processing failed.');
      }
    });
  }
}