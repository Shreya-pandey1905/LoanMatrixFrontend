import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LoanDealService } from '../../../services/loan-deal';
import { ApplyLoanResponse } from '../../../models/loan-deal.model';

export type ApplyLoanResponseDto = ApplyLoanResponse;

@Component({
  selector: 'app-loan-applications',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loan-applications.html',
  styleUrls: ['./loan-applications.css']
})
export class LoanApplications implements OnInit {
  deals: ApplyLoanResponseDto[] = [];
  filteredDeals: ApplyLoanResponseDto[] = [];
  paginatedDeals: ApplyLoanResponseDto[] = [];

  loading: boolean = false;

  // Filter Bar state
  selectedLoanType: string = 'All Loan Types';
  minAmount: number | null = null;
  maxAmount: number | null = null;
  dateFilterPreset: string = 'All Dates';
  fromDate: string = '';
  toDate: string = '';

  // Pagination & Search
  searchTerm: string = '';
  entriesPerPage: number = 10;
  currentPage: number = 1;
  totalPages: number = 1;

  // Available loan types for dropdown
  loanTypeOptions: string[] = ['All Loan Types', 'Home Loan', 'Car Loan', 'Personal Loan', 'Education Loan'];

  private readonly fallbackApiUrl = 'http://localhost:8081/api/deals';

  constructor(
    private loanDealService: LoanDealService,
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchPendingDeals();
  }

  fetchPendingDeals(): void {
    this.loading = true;
    this.cdr.detectChanges();

    // 1. Fetch from primary service endpoint /api/loans/pending
    this.loanDealService.getPendingDeals().subscribe({
      next: (res: any) => {
        this.loading = false;
        let list: ApplyLoanResponseDto[] = [];
        if (Array.isArray(res)) {
          list = res;
        } else if (res && Array.isArray(res.data)) {
          list = res.data;
        }
        this.deals = list;
        this.applyAllFilters();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.warn('Primary /api/loans/pending failed, trying fallback:', err);
        // 2. Fallback to /api/deals/pending if used by another backend configuration
        this.http.get<any>(`${this.fallbackApiUrl}/pending`).subscribe({
          next: (res) => {
            this.loading = false;
            let list: ApplyLoanResponseDto[] = [];
            if (Array.isArray(res)) {
              list = res;
            } else if (res && Array.isArray(res.data)) {
              list = res.data;
            }
            this.deals = list;
            this.applyAllFilters();
            this.cdr.detectChanges();
          },
          error: (err2) => {
            this.loading = false;
            console.error('Failed to fetch pending deals from both endpoints:', err, err2);
            this.deals = [];
            this.applyAllFilters();
            this.cdr.detectChanges();
          }
        });
      }
    });
  }

  // Unified filter handler
  applyAllFilters(): void {
    let result = Array.isArray(this.deals) ? [...this.deals] : [];

    // 1. Search Query
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      const q = this.searchTerm.toLowerCase().trim();
      result = result.filter(d =>
        (d.customerName && d.customerName.toLowerCase().includes(q)) ||
        (d.dealId && d.dealId.toString().includes(q)) ||
        (d.loanType && d.loanType.toLowerCase().includes(q))
      );
    }

    // 2. Loan Type Filter
    if (this.selectedLoanType && this.selectedLoanType !== 'All Loan Types') {
      const targetType = this.selectedLoanType.replace(/\s+/g, '_').toUpperCase();
      result = result.filter(d => {
        const itemType = (d.loanType || '').replace(/\s+/g, '_').toUpperCase();
        return itemType === targetType || itemType.includes(targetType);
      });
    }

    // 3. Min Amount
    if (this.minAmount !== null && this.minAmount > 0) {
      result = result.filter(d => d.loanAmount >= (this.minAmount as number));
    }

    // 4. Max Amount
    if (this.maxAmount !== null && this.maxAmount > 0) {
      result = result.filter(d => d.loanAmount <= (this.maxAmount as number));
    }

    // 5. From Date
    if (this.fromDate) {
      result = result.filter(d => {
        if (!d.appliedDate) return true;
        const dDate = new Date(d.appliedDate).toISOString().split('T')[0];
        return dDate >= this.fromDate;
      });
    }

    // 6. To Date
    if (this.toDate) {
      result = result.filter(d => {
        if (!d.appliedDate) return true;
        const dDate = new Date(d.appliedDate).toISOString().split('T')[0];
        return dDate <= this.toDate;
      });
    }

    this.filteredDeals = result;
    this.currentPage = 1;
    this.updatePagination();
  }

  onDatePresetChange(): void {
    const today = new Date();

    if (this.dateFilterPreset === 'Today') {
      const iso = today.toISOString().split('T')[0];
      this.fromDate = iso;
      this.toDate = iso;
    } else if (this.dateFilterPreset === 'This Week') {
      const day = today.getDay();
      const diff = today.getDate() - day + (day === 0 ? -6 : 1);
      const startOfWeek = new Date(today.setDate(diff));
      this.fromDate = startOfWeek.toISOString().split('T')[0];
      this.toDate = new Date().toISOString().split('T')[0];
    } else if (this.dateFilterPreset === 'This Month') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      this.fromDate = startOfMonth.toISOString().split('T')[0];
      this.toDate = new Date().toISOString().split('T')[0];
    } else {
      this.fromDate = '';
      this.toDate = '';
    }
    this.applyAllFilters();
  }

  updatePagination(): void {
    const total = this.filteredDeals.length;
    this.totalPages = Math.max(1, Math.ceil(total / this.entriesPerPage));
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
    const start = (this.currentPage - 1) * this.entriesPerPage;
    const end = start + Number(this.entriesPerPage);
    this.paginatedDeals = this.filteredDeals.slice(start, end);
    this.cdr.detectChanges();
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getStartIndex(): number {
    if (this.filteredDeals.length === 0) return 0;
    return (this.currentPage - 1) * this.entriesPerPage + 1;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.entriesPerPage, this.filteredDeals.length);
  }

  formatLoanType(type: string): string {
    if (!type) return 'N/A';
    return type.replace(/_/g, ' ').toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  reviewDeal(dealId: number, status: 'APPROVED' | 'REJECTED'): void {
    const rawOfficerId = localStorage.getItem('officerId') || '1';
    const officerId = Number(rawOfficerId) || 1;

    // Call service PUT /api/loans/{dealId}/review with payload
    this.loanDealService.reviewDeal(dealId, { officerId, status }).subscribe({
      next: () => {
        alert(`Deal #${dealId} has been ${status.toLowerCase()} successfully!`);
        this.fetchPendingDeals();
      },
      error: () => {
        // Fallback to POST /api/deals/{dealId}/review
        this.http.post(`${this.fallbackApiUrl}/${dealId}/review?officerId=${officerId}&status=${status}`, {}).subscribe({
          next: () => {
            alert(`Deal #${dealId} has been ${status.toLowerCase()} successfully!`);
            this.fetchPendingDeals();
          },
          error: (err) => {
            console.error('Failed to review deal:', err);
            alert(err.error?.message || `Failed to ${status.toLowerCase()} deal.`);
          }
        });
      }
    });
  }
}