import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanAccountService } from '../../services/loan-account';
import {
  LoanAccountSummaryDto,
  LoanAccountProfileDto
} from '../../models/loan-account.model';

@Component({
  selector: 'app-my-loan-account',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-loan-account.html',
  styleUrls: ['./my-loan-account.css']
})
export class MyLoanAccount implements OnInit {
  customerId: number = 1;
  accounts: LoanAccountSummaryDto[] = [];
  selectedAccount: LoanAccountSummaryDto | null = null;
  selectedProfile: LoanAccountProfileDto | null = null;
  loading: boolean = true;

  constructor(
    private loanAccountService: LoanAccountService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const rawId = localStorage.getItem('customerId') ||
                  sessionStorage.getItem('customerId') ||
                  localStorage.getItem('userId');

    this.customerId = rawId && !isNaN(Number(rawId)) ? Number(rawId) : 1;
    this.fetchAccounts();
  }

  fetchAccounts(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.loanAccountService.getCustomerAccounts(this.customerId).subscribe({
      next: (res) => {
        this.loading = false;
        let list: any[] = [];
        if (Array.isArray(res)) {
          list = res;
        } else if (res && Array.isArray(res.data)) {
          list = res.data;
        } else if (res && res.data?.loanAccounts && Array.isArray(res.data.loanAccounts)) {
          list = res.data.loanAccounts;
        }

        if (list.length > 0) {
          this.accounts = list.map(a => ({
            ...a,
            id: a.id || a.loanAccountId || 1,
            loanAccountNo: a.loanAccountNo || ('LA-' + (a.id || a.loanAccountId || '1001')),
            outstandingPrincipal: a.outstandingPrincipal ?? a.loanAmount ?? 0,
            status: a.status || a.loanStatus || 'ACTIVE'
          }));
          this.switchAccount(this.accounts[0]);
        } else {
          this.accounts = [];
          this.selectedAccount = null;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        console.error('Failed to load customer accounts:', err);
        this.cdr.detectChanges();
      }
    });
  }

  onSelectAccountNo(accNo: string): void {
    const target = this.accounts.find(a => a.loanAccountNo === accNo);
    if (target) {
      this.switchAccount(target);
    }
  }

  switchAccount(acc: LoanAccountSummaryDto): void {
    this.selectedAccount = acc;
    this.selectedProfile = null;
    this.cdr.detectChanges();

    this.loanAccountService.getAccountDetailsCard(acc.loanAccountNo).subscribe({
      next: (res) => {
        if (res && res.success && res.data) {
          this.selectedProfile = res.data;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to fetch account profile details:', err);
        this.cdr.detectChanges();
      }
    });
  }

  calculateRepaidPercent(loanAmount: number, totalPaid: number): number {
    if (!loanAmount || loanAmount <= 0) return 0;
    const paid = totalPaid || 0;
    return Math.min(100, Math.round((paid / loanAmount) * 100));
  }
}