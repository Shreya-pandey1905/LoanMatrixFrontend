import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForeclosureService } from '../../../../core/services/foreclosure';
import { FullClosureResponseDto } from '../../../../core/models/foreclosure.model';

@Component({
  selector: 'app-officer-full-closure',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './full-closure.html',
  styleUrls: ['./full-closure.css']
})
export class FullClosure implements OnInit {
  requests: FullClosureResponseDto[] = [];
  filteredRequests: FullClosureResponseDto[] = [];
  searchQuery: string = '';
  loading: boolean = false;

  selectedRequest: FullClosureResponseDto | null = null;
  showModal: boolean = false;

  constructor(
    private foreclosureService: ForeclosureService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchRequests();
  }

  fetchRequests(): void {
    this.loading = true;
    this.foreclosureService.getPendingFullRequests().subscribe({
      next: (res) => {
        this.loading = false;
        if (res && res.success) {
          this.requests = res.data || [];
          this.applyFilter();
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(): void {
    let list = [...this.requests];
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      list = list.filter(r =>
        r.loanAccountNo?.toLowerCase().includes(q) ||
        r.customerName?.toLowerCase().includes(q)
      );
    }
    this.filteredRequests = list;
    this.cdr.detectChanges();
  }

  openDetails(req: FullClosureResponseDto): void {
    this.selectedRequest = req;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.selectedRequest = null;
  }

  approveRequest(): void {
    if (!this.selectedRequest) return;
    const officerId = Number(localStorage.getItem('officerId')) || 1;

    this.foreclosureService.approveFullRequest(this.selectedRequest.requestId, officerId).subscribe({
      next: () => {
        alert('Full Foreclosure request approved successfully!');
        this.closeModal();
        this.fetchRequests();
      },
      error: (err) => {
        alert(err.error?.message || 'Approval failed.');
      }
    });
  }
}