import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { DisbursementService } from '../../../services/disbursement';
import { DisbursementResponseDto } from '../../../models/disbursement.model';

@Component({
  selector: 'app-officer-disbursements',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './disbursements.html',
  styleUrls: ['./disbursements.css']
})
export class Disbursements implements OnInit {
  disbursements: DisbursementResponseDto[] = [];
  filteredDisbursements: DisbursementResponseDto[] = [];
  loading = false;
  errorMsg = '';
  searchQuery = '';
  selectedBank = 'ALL';

  constructor(
    private disbursementService: DisbursementService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadDisbursements();
  }

  loadDisbursements(): void {
    this.loading = true;
    this.errorMsg = '';
    this.cdr.detectChanges();

    this.disbursementService.getAllDisbursements().subscribe({
      next: (res) => {
        this.loading = false;
        if (res && res.success && res.data) {
          this.disbursements = res.data;
          this.applyFilters();
        } else {
          this.disbursements = [];
          this.filteredDisbursements = [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        console.error('Failed to load disbursements for officer:', err);
        this.errorMsg = err.error?.message || 'Failed to fetch disbursement records.';
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters(): void {
    let list = [...this.disbursements];

    if (this.selectedBank && this.selectedBank !== 'ALL') {
      list = list.filter(d => d.bankPartner?.toUpperCase() === this.selectedBank.toUpperCase());
    }

    if (this.searchQuery && this.searchQuery.trim() !== '') {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(d =>
        (d.loanAccountNo && d.loanAccountNo.toLowerCase().includes(q)) ||
        (d.customerName && d.customerName.toLowerCase().includes(q)) ||
        (d.dealId && d.dealId.toString().includes(q)) ||
        (d.bankPartner && d.bankPartner.toLowerCase().includes(q))
      );
    }

    this.filteredDisbursements = list;
    this.cdr.detectChanges();
  }

  get totalDisbursedAmount(): number {
    return this.disbursements.reduce((sum, d) => sum + (d.disburseAmount || 0), 0);
  }

  get totalCount(): number {
    return this.disbursements.length;
  }

  get uniquePartners(): string[] {
    const set = new Set<string>();
    this.disbursements.forEach(d => {
      if (d.bankPartner) set.add(d.bankPartner);
    });
    return Array.from(set);
  }
}
