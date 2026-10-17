import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoanAccountService } from '../../../services/loan-account';
import { ForeclosureService } from '../../../services/foreclosure';
import { LoanAccountSummaryDto } from '../../../models/loan-account.model';
import { FullClosureResponseDto } from '../../../models/foreclosure.model';

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
      next: (res: any) => {
        this.loading = false;
        let list: any[] = [];
        if (Array.isArray(res)) {
          list = res;
        } else if (res && Array.isArray(res.data)) {
          list = res.data;
        } else if (res && res.data?.loanAccounts && Array.isArray(res.data.loanAccounts)) {
          list = res.data.loanAccounts;
        }

        this.accounts = list.map((a: any) => ({
          ...a,
          id: a.id || a.loanAccountId || 1,
          loanAccountNo: a.loanAccountNo || ('LA-' + (a.id || a.loanAccountId || '1001')),
          outstandingPrincipal: a.outstandingPrincipal ?? a.loanAmount ?? 0,
          status: a.status || a.loanStatus || 'ACTIVE'
        }));

        if (this.accounts.length > 0) {
          this.selectedAccount = this.accounts[0];
          this.loadRequests();
        } else {
          // Provide placeholder so the form is always visible
          this.selectedAccount = {
            id: 0,
            loanAccountNo: 'No Active Loan',
            customerName: 'Customer',
            loanAmount: 0,
            outstandingPrincipal: 0,
            status: 'INACTIVE',
            interestRate: 0,
            tenureMonths: 0,
            emiAmount: 0,
            disbursementDate: '',
            totalPaid: 0
          };
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        console.warn('Could not load loan accounts:', err);
        if (!this.selectedAccount) {
          this.selectedAccount = {
            id: 0,
            loanAccountNo: 'No Active Loan',
            customerName: 'Customer',
            loanAmount: 0,
            outstandingPrincipal: 0,
            status: 'INACTIVE',
            interestRate: 0,
            tenureMonths: 0,
            emiAmount: 0,
            disbursementDate: '',
            totalPaid: 0
          };
        }
        this.cdr.detectChanges();
      }
    });
  }

  onAccountChange(accNo: string): void {
    this.selectedAccount = this.accounts.find(a => a.loanAccountNo === accNo) || null;
    this.loadRequests();
  }

  loadRequests(): void {
    if (!this.selectedAccount || !this.selectedAccount.id) return;
    this.foreclosureService.getCustomerPayableFullRequests(this.selectedAccount.id).subscribe({
      next: (res) => {
        if (res && res.success) {
          this.myRequests = res.data || [];
        }
        this.cdr.detectChanges();
      },
      error: () => {
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
    if (!this.selectedAccount || this.selectedAccount.id === 0) {
      alert('Please select an active loan account to submit a foreclosure request.');
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
        this.loadAccounts();
      },
      error: (err) => {
        this.processingPayment = false;
        alert(err.error?.message || 'Payment processing failed.');
      }
    });
  }
}