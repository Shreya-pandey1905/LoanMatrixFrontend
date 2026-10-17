import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanDealService } from '../../../services/loan-deal';

@Component({
  selector: 'app-apply-loan',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './apply-loan.html',
  styleUrls: ['./apply-loan.css']
})
export class ApplyLoan implements OnInit {
  customerId: number | null = null;
  maxEligibleAmount: number | null = null;
  amountExceeded: boolean = false;

  selectedLoanType: string = '';
  loanAmount: number | null = null;
  tenureMonths: number | null = null;
  interestRate: number = 0;
  calculatedEmi: number = 0;

  bankName: string = '';
  bankAccountNumber: string = '';
  ifscCode: string = '';
  emiDay: number | null = null;

  submitting: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private loanService: LoanDealService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.resolveLoggedInUser();
    if (this.customerId) {
      this.fetchCustomerEligibilityLimit();
    } else {
      this.errorMessage = 'No active customer session found. Please log in first.';
    }
  }

  resolveLoggedInUser(): void {
    const directId = localStorage.getItem('customerId') || sessionStorage.getItem('customerId');
    const userJson = localStorage.getItem('user') || sessionStorage.getItem('user');

    if (directId) {
      this.customerId = Number(directId);
    } else if (userJson) {
      try {
        const parsed = JSON.parse(userJson);
        this.customerId = parsed.customerId || parsed.id || null;
      } catch (e) {
        this.customerId = null;
      }
    }
  }

  fetchCustomerEligibilityLimit(): void {
    if (!this.customerId) return;

    this.loanService.getCustomerEligibility(this.customerId).subscribe({
      next: (res) => {
        if (res.success && res.data && res.data.eligibleLoanAmount) {
          this.maxEligibleAmount = Number(res.data.eligibleLoanAmount);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.warn('Could not fetch eligibility limit:', err);
        this.cdr.detectChanges();
      }
    });
  }

  onLoanTypeChange(): void {
    if (this.selectedLoanType === 'HOME_LOAN') {
      this.interestRate = 8.50;
    } else if (this.selectedLoanType === 'CAR_LOAN') {
      this.interestRate = 10.50;
    } else {
      this.interestRate = 0;
    }
    this.recalculateEmi();
  }

  onAmountInput(): void {
    if (this.maxEligibleAmount !== null && this.loanAmount !== null) {
      this.amountExceeded = Number(this.loanAmount) > Number(this.maxEligibleAmount);
    } else {
      this.amountExceeded = false;
    }
    this.recalculateEmi();
    this.cdr.detectChanges();
  }

  onTenureInput(): void {
    this.recalculateEmi();
  }

  recalculateEmi(): void {
    if (!this.loanAmount || this.loanAmount <= 0 || !this.interestRate || !this.tenureMonths || this.tenureMonths <= 0) {
      this.calculatedEmi = 0;
      return;
    }

    const principal = this.loanAmount;
    const monthlyRate = (this.interestRate / 100) / 12;
    const totalMonths = this.tenureMonths;

    const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
                 (Math.pow(1 + monthlyRate, totalMonths) - 1);

    this.calculatedEmi = Math.round(emi * 100) / 100;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.customerId) {
      this.errorMessage = 'Cannot submit application: customer session is missing.';
      return;
    }

    if (!this.selectedLoanType) {
      this.errorMessage = 'Please select a Loan Type.';
      return;
    }

    if (!this.loanAmount || this.loanAmount <= 0) {
      this.errorMessage = 'Please enter a valid Loan Amount.';
      return;
    }

    if (this.amountExceeded) {
      this.errorMessage = `Entered amount exceeds your eligible limit of ₹${this.maxEligibleAmount?.toLocaleString('en-IN')}. Not allowed.`;
      return;
    }

    if (!this.tenureMonths || this.tenureMonths <= 0) {
      this.errorMessage = 'Please enter tenure in months.';
      return;
    }

    if (!this.bankName.trim() || !this.bankAccountNumber.trim() || !this.ifscCode.trim()) {
      this.errorMessage = 'Please fill all bank details.';
      return;
    }

    if (!this.emiDay || this.emiDay < 1 || this.emiDay > 28) {
      this.errorMessage = 'Please enter an EMI day between 1 and 28.';
      return;
    }

    this.submitting = true;
    this.cdr.detectChanges();

    const payload = {
      customerId: this.customerId,
      loanType: this.selectedLoanType,
      loanAmount: this.loanAmount,
      tenureMonths: this.tenureMonths,
      bankName: this.bankName.trim(),
      bankAccountNumber: this.bankAccountNumber.trim(),
      ifscCode: this.ifscCode.trim().toUpperCase(),
      emiDay: this.emiDay
    };

    this.loanService.applyLoan(payload).subscribe({
      next: (res) => {
        this.submitting = false;
        if (res.success && res.data) {
          this.successMessage = `Loan application submitted successfully! Application Deal ID: #${res.data.dealId}. Status: ${res.data.status}`;
          // Reset form fields
          this.selectedLoanType = '';
          this.loanAmount = null;
          this.tenureMonths = null;
          this.interestRate = 0;
          this.calculatedEmi = 0;
          this.bankName = '';
          this.bankAccountNumber = '';
          this.ifscCode = '';
          this.emiDay = null;
          this.amountExceeded = false;
        } else {
          this.errorMessage = res.message || 'Application failed.';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.submitting = false;
        this.errorMessage = err.error?.message || 'Failed to submit loan application.';
        this.cdr.detectChanges();
      }
    });
  }
}