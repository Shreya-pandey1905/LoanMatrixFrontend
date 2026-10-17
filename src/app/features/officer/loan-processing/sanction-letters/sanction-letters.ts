import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SanctionLetterService } from '../../../services/sanction-letter';
import { DisbursementService } from '../../../services/disbursement';
import {
  SanctionLetterResponseDto,
  SanctionLetterDetailDto
} from '../../../models/sanction-letter.model';

@Component({
  selector: 'app-officer-sanction-letters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sanction-letters.html',
  styleUrls: ['./sanction-letters.css']
})
export class SanctionLetters implements OnInit {
  sanctionLetters: SanctionLetterResponseDto[] = [];
  filteredLetters: SanctionLetterResponseDto[] = [];

  // Filter toolbar bindings
  searchCustomer: string = '';
  fromDate: string = '';
  toDate: string = '';
  selectedFilter: string = '';
  selectedSort: string = 'DEFAULT';

  // Generate modal state
  showGenerateModal: boolean = false;
  approvedDeals: any[] = [];
  selectedDeal: any = null;
  generating: boolean = false;
  generateError: string = '';

  // Document modal state
  showDocModal: boolean = false;
  docData: SanctionLetterDetailDto | null = null;
  loadingDoc: boolean = false;
  docErrorMessage: string = '';

  // Disbursement state
  disbursedDealIds: Set<number> = new Set<number>();
  showDisburseModal: boolean = false;
  selectedDisburseRow: SanctionLetterResponseDto | null = null;
  bankPartner: string = 'HDFC Bank';
  processingDisburse: boolean = false;
  disburseError: string = '';

  constructor(
    private sanctionService: SanctionLetterService,
    private disbursementService: DisbursementService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    // 1. Fetch backend disbursements
    this.disbursementService.getAllDisbursements().subscribe({
      next: (res) => {
        this.disbursedDealIds.clear();
        if (res && res.success && Array.isArray(res.data)) {
          res.data.forEach((d: any) => {
            const id = Number(d.dealId);
            if (!isNaN(id) && id > 0) {
              this.disbursedDealIds.add(id);
            }
          });
        }
        this.loadSanctionLetters();
      },
      error: () => {
        this.loadSanctionLetters();
      }
    });
  }

  loadSanctionLetters(): void {
    this.sanctionService.getAllSanctionLetters().subscribe({
      next: (res) => {
        if (res && res.success && res.data) {
          this.sanctionLetters = res.data;
          this.applyFilters();
        } else {
          this.sanctionLetters = [];
          this.filteredLetters = [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load sanction letters:', err);
        this.cdr.detectChanges();
      }
    });
  }

  // Safely extract numeric Deal ID
  getDealId(row: any): number {
    const val = row?.dealId ?? row?.id;
    const num = Number(val);
    return isNaN(num) ? 0 : num;
  }

  // 1. Is it already disbursed? (Strict check against valid deal ID in DB)
  isDealDisbursed(row: any): boolean {
    const dealId = this.getDealId(row);
    if (!dealId || dealId <= 0) return false;
    return this.disbursedDealIds.has(dealId);
  }

  // 2. Has the customer accepted terms?
  isCustomerAccepted(row: any): boolean {
    const dealId = this.getDealId(row);
    if (!dealId || dealId <= 0) return false;

    // If it's already disbursed, acceptance has already passed
    if (this.isDealDisbursed(row)) return true;

    // Check localStorage saved when customer clicks "Accept Terms"
    const acceptedDeals: any[] = JSON.parse(localStorage.getItem('accepted_deals') || '[]');
    return acceptedDeals.some(id => Number(id) === dealId);
  }

  // Open modal when Officer clicks yellow Disburse button
  openDisburseModal(row: SanctionLetterResponseDto): void {
    this.selectedDisburseRow = row;
    this.bankPartner = 'HDFC Bank';
    this.disburseError = '';
    this.showDisburseModal = true;
  }

  closeDisburseModal(): void {
    this.showDisburseModal = false;
    this.selectedDisburseRow = null;
  }

  confirmDisbursement(): void {
    if (!this.selectedDisburseRow) return;

    const dealId = this.getDealId(this.selectedDisburseRow);
    if (!dealId) {
      this.disburseError = 'Invalid Deal ID.';
      return;
    }

    this.processingDisburse = true;
    this.disburseError = '';

    const today = new Date().toISOString().split('T')[0];
    const payload = {
      dealId: dealId,
      disbursementAmount: this.selectedDisburseRow.loanAmount,
      bankPartner: this.bankPartner,
      disbursementDate: today
    };

    this.disbursementService.processDisbursement(payload).subscribe({
      next: (res) => {
        this.processingDisburse = false;
        if (res && res.success) {
          // Immediately mark this deal as disbursed
          this.disbursedDealIds.add(dealId);
          this.closeDisburseModal();
          this.loadSanctionLetters();
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.processingDisburse = false;
        this.disburseError = err.error?.message || 'Failed to complete disbursement.';
        this.cdr.detectChanges();
      }
    });
  }

  // Generate modal logic
  openGenerateModal(): void {
    this.showGenerateModal = true;
    this.selectedDeal = null;
    this.generateError = '';

    this.sanctionService.getAllDeals().subscribe({
      next: (res) => {
        if (res.success && res.data) {
          const generatedDealIds = new Set(this.sanctionLetters.map(l => this.getDealId(l)));
          this.approvedDeals = res.data.filter((deal: any) => {
            const id = this.getDealId(deal);
            return !generatedDealIds.has(id);
          });
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.generateError = 'Unable to fetch approved deals.';
        this.cdr.detectChanges();
      }
    });
  }

  closeGenerateModal(): void {
    this.showGenerateModal = false;
    this.selectedDeal = null;
  }

  onCustomerSelect(event: any): void {
    const dealId = Number(event.target.value);
    this.selectedDeal = this.approvedDeals.find((d: any) => this.getDealId(d) === dealId) || null;
  }

  submitGenerate(): void {
    if (!this.selectedDeal) return;
    this.generating = true;

    const dealId = this.getDealId(this.selectedDeal);
    const payload = {
      dealId: dealId,
      loanAmount: this.selectedDeal.approvedAmount || this.selectedDeal.loanAmount,
      interestRate: this.selectedDeal.interestRate,
      tenureMonths: this.selectedDeal.tenureMonths,
      emiAmount: this.selectedDeal.emiAmount
    };

    this.sanctionService.generateSanctionLetter(payload).subscribe({
      next: (res) => {
        this.generating = false;
        if (res.success) {
          this.closeGenerateModal();
          this.resetFilters();
          this.loadData();
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.generating = false;
        this.generateError = err.error?.message || 'Failed to generate sanction letter.';
        this.cdr.detectChanges();
      }
    });
  }

  // Document Preview
  openDocumentView(dealId: number | undefined): void {
    if (!dealId) {
      this.docErrorMessage = 'Invalid Deal ID.';
      this.showDocModal = true;
      this.loadingDoc = false;
      this.docData = null;
      this.cdr.detectChanges();
      return;
    }

    this.loadingDoc = true;
    this.showDocModal = true;
    this.docData = null;
    this.docErrorMessage = '';
    this.cdr.detectChanges();

    this.sanctionService.getDocumentByDealId(dealId).subscribe({
      next: (res) => {
        this.loadingDoc = false;
        if (res && res.success && res.data) {
          this.docData = res.data;
        } else {
          this.docErrorMessage = 'Sanction letter document not found.';
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loadingDoc = false;
        this.docErrorMessage = err.error?.message || 'Unable to retrieve document from server.';
        this.cdr.detectChanges();
      }
    });
  }

  closeDocModal(): void {
    this.showDocModal = false;
    this.docData = null;
  }

  printDocument(): void {
    window.print();
  }

  // Filtering
  applyFilters(): void {
    let result = [...this.sanctionLetters];

    if (this.searchCustomer && this.searchCustomer.trim() !== '') {
      const q = this.searchCustomer.trim().toLowerCase();
      result = result.filter(item =>
        (item.customerName && item.customerName.toLowerCase().includes(q)) ||
        (item.customerId && item.customerId.toString().includes(q))
      );
    }

    if (this.selectedFilter && this.selectedFilter !== '') {
      const type = this.selectedFilter.trim().toLowerCase();
      result = result.filter(item =>
        item.loanType && item.loanType.toLowerCase().includes(type)
      );
    }

    if (this.fromDate) {
      const from = new Date(this.fromDate);
      from.setHours(0, 0, 0, 0);
      result = result.filter(item => {
        if (!item.createdAt) return false;
        return new Date(item.createdAt) >= from;
      });
    }

    if (this.toDate) {
      const to = new Date(this.toDate);
      to.setHours(23, 59, 59, 999);
      result = result.filter(item => {
        if (!item.createdAt) return false;
        return new Date(item.createdAt) <= to;
      });
    }

    if (this.selectedSort === 'NAME_ASC') {
      result.sort((a, b) => (a.customerName || '').localeCompare(b.customerName || ''));
    } else if (this.selectedSort === 'NAME_DESC') {
      result.sort((a, b) => (b.customerName || '').localeCompare(a.customerName || ''));
    } else if (this.selectedSort === 'AMOUNT_ASC') {
      result.sort((a, b) => (a.loanAmount || 0) - (b.loanAmount || 0));
    } else if (this.selectedSort === 'AMOUNT_DESC') {
      result.sort((a, b) => (b.loanAmount || 0) - (a.loanAmount || 0));
    }

    this.filteredLetters = result;
    this.cdr.detectChanges();
  }

  resetFilters(): void {
    this.searchCustomer = '';
    this.fromDate = '';
    this.toDate = '';
    this.selectedFilter = '';
    this.selectedSort = 'DEFAULT';
    this.filteredLetters = [...this.sanctionLetters];
    this.cdr.detectChanges();
  }
}