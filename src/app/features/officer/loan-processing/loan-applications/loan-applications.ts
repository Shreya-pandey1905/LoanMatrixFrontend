import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

export interface ApplyLoanResponseDto {
  dealId: number;
  customerId: number;
  customerName: string;
  loanType: string;
  loanAmount: number;
  approvedAmount?: number;
  interestRate: number;
  tenureMonths: number;
  emiAmount: number;
  status: string;
  appliedDate?: string;
  rejectionReason?: string;
}

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

  private readonly apiUrl = 'http://localhost:8081/api/deals';

  constructor(
    private http: HttpClient,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchPendingDeals();
  }

  fetchPendingDeals(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.http.get<ApplyLoanResponseDto[]>(`${this.apiUrl}/pending`).subscribe({
      next: (data) => {
        this.loading = false;
        this.deals = data || [];
        this.applyAllFilters();
      },
      error: (err) => {
        this.loading = false;
        console.error('Failed to fetch pending deals:', err);
        this.deals = [];
        this.applyAllFilters();
      }
    });
  }

  // Unified filter handler
  applyAllFilters(): void {
    let result = [...this.deals];

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
        return itemType.includes(targetType) || targetType.includes(itemType);
      });
    }

    // 3. Min Amount
    if (this.minAmount !== null && this.minAmount > 0) {
      result = result.filter(d => d.loanAmount >= this.minAmount!);
    }

    // 4. Max Amount
    if (this.maxAmount !== null && this.maxAmount > 0) {
      result = result.filter(d => d.loanAmount <= this.maxAmount!);
    }

    // 5. Date Range Pickers
    if (this.fromDate) {
      const from = new Date(this.fromDate).getTime();
      result = result.filter(d => {
        const itemDate = d.appliedDate ? new Date(d.appliedDate).getTime() : 0;
        return itemDate >= from;
      });
    }
    if (this.toDate) {
      const to = new Date(this.toDate).getTime() + (24 * 60 * 60 * 1000 - 1);
      result = result.filter(d => {
        const itemDate = d.appliedDate ? new Date(d.appliedDate).getTime() : 0;
        return itemDate <= to;
      });
    }

    this.filteredDeals = result;
    this.currentPage = 1;
    this.updatePagination();
  }

  onDatePresetChange(): void {
    const now = new Date();
    if (this.dateFilterPreset === 'Today') {
      const str = now.toISOString().split('T')[0];
      this.fromDate = str;
      this.toDate = str;
    } else if (this.dateFilterPreset === 'This Week') {
      const day = now.getDay();
      const firstDay = new Date(now.setDate(now.getDate() - day));
      this.fromDate = firstDay.toISOString().split('T')[0];
      this.toDate = new Date().toISOString().split('T')[0];
    } else if (this.dateFilterPreset === 'This Month') {
      const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
      this.fromDate = firstDay.toISOString().split('T')[0];
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
    const officerId = localStorage.getItem('officerId') || 1;
    this.http.post(`${this.apiUrl}/${dealId}/review?officerId=${officerId}&status=${status}`, {}).subscribe({
      next: () => {
        this.fetchPendingDeals();
      },
      error: (err) => {
        console.error('Failed to review deal:', err);
      }
    });
  }
}