import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoanDealService } from '../../services/loan-deal';
import { LoanAccountService } from '../../services/loan-account';
import { ApplyLoanResponse } from '../../models/loan-deal.model';

@Component({
  selector: 'app-track-status',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './track-status.html',
  styleUrls: ['./track-status.css']
})
export class TrackStatus implements OnInit {
  customerId: number = 1;
  loading: boolean = false;
  kycCompleted: boolean = false;
  hasApplication: boolean = false;
  hasSanction: boolean = false;
  hasDisbursement: boolean = false;
  hasActiveLoan: boolean = false;

  recentDealId: number | null = null;
  activeAccountNo: string | null = null;

  constructor(
    private loanAccountService: LoanAccountService,
    private loanDealService: LoanDealService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const rawId = localStorage.getItem('customerId') || sessionStorage.getItem('customerId');
    this.customerId = rawId ? Number(rawId) : 1;
    this.checkApplicationProgress();
  }

  checkApplicationProgress(): void {
    this.loading = true;
    this.cdr.detectChanges();

    // Check active loan accounts
    this.loanAccountService.getCustomerAccounts(this.customerId).subscribe({
      next: (res) => {
        if (res && res.success && res.data && res.data.length > 0) {
          this.hasActiveLoan = true;
          this.hasDisbursement = true;
          this.hasSanction = true;
          this.hasApplication = true;
          this.kycCompleted = true;
          this.activeAccountNo = res.data[0].loanAccountNo;
        }
        this.checkDeals();
      },
      error: () => {
        this.checkDeals();
      }
    });
  }

  private checkDeals(): void {
    this.loanDealService.getCustomerApplications(this.customerId).subscribe({
      next: (res) => {
        this.loading = false;
        if (res && res.success && res.data && res.data.length > 0) {
          const apps: ApplyLoanResponse[] = res.data;
          this.hasApplication = true;
          this.recentDealId = apps[0].dealId;
          if (apps.some(a => a.status?.toLowerCase().includes('approved') || a.status?.toLowerCase().includes('sanction'))) {
            this.hasSanction = true;
          }
          if (apps.some(a => a.status?.toLowerCase().includes('disburs'))) {
            this.hasDisbursement = true;
          }
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
