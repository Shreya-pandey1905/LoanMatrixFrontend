import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/auth/services/auth';
import {
  EmiSchedulerService,
  LoanAccount,
  EmiSchedule
} from '../services/emi-scheduler';

@Component({
  selector: 'app-emi-scheduler',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './emi-scheduler.html',
  styleUrl: './emi-scheduler.css'
})
export class EmiScheduler implements OnInit {
  private readonly emiService = inject(EmiSchedulerService);
  private readonly authService = inject(AuthService);
  private readonly cdr = inject(ChangeDetectorRef);

  customerId = 1;

  loanAccounts: LoanAccount[] = [];
  selectedLoanAccountId: number | null = null;
  selectedLoanAccount: LoanAccount | null = null;

  emiSchedules: EmiSchedule[] = [];

  paidEmis = 0;
  pendingEmis = 0;
  remainingBalance = 0;

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    const storedCustomerId = this.authService.getCustomerId();
    if (storedCustomerId) {
      this.customerId = storedCustomerId;
    }
    this.loadLoanAccounts();
  }

  loadLoanAccounts(): void {
    this.loading = true;
    this.errorMessage = '';
    this.emiService.getLoanAccounts(this.customerId).subscribe({
      next: (response) => {
        const accounts = Array.isArray(response)
          ? response
          : (Array.isArray(response?.data) ? response.data : []);

        this.loanAccounts = accounts;

        if (this.loanAccounts.length > 0) {
          this.selectedLoanAccountId = this.loanAccounts[0].id;
          this.onLoanAccountChange();
        } else {
          this.loading = false;
        }
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load loan accounts:', error);
        this.errorMessage = error.status === 0
          ? 'Cannot connect to backend server. Please verify it is running.'
          : error.error?.message || 'Unable to load loan accounts.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onLoanAccountChange(): void {
    if (this.selectedLoanAccountId === null) {
      return;
    }

    this.selectedLoanAccount =
      this.loanAccounts.find(
        account => account.id === Number(this.selectedLoanAccountId)
      ) || null;

    if (this.selectedLoanAccount) {
      this.remainingBalance =
        this.selectedLoanAccount.outstandingPrincipal ?? 0;
    }

    this.loadEmiSchedule();
  }

  loadEmiSchedule(): void {
    if (this.selectedLoanAccountId === null) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.emiService
      .getEmiSchedule(this.selectedLoanAccountId)
      .subscribe({
        next: (data) => {
          const schedules = Array.isArray(data)
            ? data
            : (Array.isArray(data?.data) ? data.data : []);

          this.emiSchedules = schedules;
          this.calculateSummary();
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Failed to load EMI schedule:', error);
          this.errorMessage = error.status === 0
            ? 'Cannot connect to backend server. Please verify it is running.'
            : error.error?.message || 'Unable to load EMI schedule.';
          this.emiSchedules = [];
          this.calculateSummary();
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
  }

  calculateSummary(): void {
    this.paidEmis = 0;
    this.pendingEmis = 0;

    for (let emi of this.emiSchedules) {
      const status = emi.paymentStatus?.toUpperCase();
      if (status === 'PAID') {
        this.paidEmis++;
      } else if (status === 'PENDING') {
        this.pendingEmis++;
      }
    }
  }

  payEmi(emi: EmiSchedule): void {
    const confirmed = confirm(`Proceed to pay EMI installment #${emi.installmentNo} for amount ₹ ${emi.emi}?`);
    if (confirmed) {
      alert('Payment gateway integration pending.');
    }
  }
}
