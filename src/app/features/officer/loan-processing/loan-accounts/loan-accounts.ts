import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoanAccountService } from '../../../services/loan-account';
import {
  LoanAccountSummaryDto,
  LoanAccountProfileDto
} from '../../../models/loan-account.model';

@Component({
  selector: 'app-loan-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './loan-accounts.html',
  styleUrls: ['./loan-accounts.css']
})
export class LoanAccounts implements OnInit {
  accounts: LoanAccountSummaryDto[] = [];
  filteredAccounts: LoanAccountSummaryDto[] = [];

  // Controls from Screenshot 3
  statusFilter: string = 'All Status';
  searchQuery: string = '';
  entriesPerPage: number = 10;
  loading: boolean = false;

  // View Details Modal from Screenshot 4
  showModal: boolean = false;
  selectedProfile: LoanAccountProfileDto | null = null;
  loadingProfile: boolean = false;
  modalError: string = '';

  constructor(
    private loanAccountService: LoanAccountService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchAccounts();
  }

  fetchAccounts(): void {
    this.loading = true;
    this.cdr.detectChanges();

    this.loanAccountService.getOfficerAccounts(this.statusFilter).subscribe({
      next: (res) => {
        this.loading = false;
        if (res && res.success && res.data) {
          this.accounts = res.data;
          this.applySearch();
        } else {
          this.accounts = [];
          this.filteredAccounts = [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        console.error('Failed to load accounts for officer:', err);
        this.cdr.detectChanges();
      }
    });
  }

  onStatusChange(): void {
    this.fetchAccounts();
  }

  applySearch(): void {
    let result = [...this.accounts];
    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(item =>
        (item.loanAccountNo && item.loanAccountNo.toLowerCase().includes(q)) ||
        (item.customerName && item.customerName.toLowerCase().includes(q))
      );
    }
    this.filteredAccounts = result;
    this.cdr.detectChanges();
  }

  viewDetails(accountNo: string): void {
    this.showModal = true;
    this.loadingProfile = true;
    this.selectedProfile = null;
    this.modalError = '';
    this.cdr.detectChanges();

    this.loanAccountService.getAccountDetailsCard(accountNo).subscribe({
      next: (res) => {
        this.loadingProfile = false;
        if (res && res.success && res.data) {
          this.selectedProfile = res.data;
        } else {
          this.modalError = 'Details not found.';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loadingProfile = false;
        this.modalError = err.error?.message || 'Failed to retrieve account details.';
        this.cdr.detectChanges();
      }
    });
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedProfile = null;
    this.modalError = '';
  }
}