import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ForeclosureService } from '../../../services/foreclosure';
import { PartialClosureResponseDto } from '../../../models/foreclosure.model';

@Component({
  selector: 'app-officer-partial-closure',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './partial-closure.html',
  styleUrls: ['./partial-closure.css']
})
export class PartialClosure implements OnInit {
  requests: PartialClosureResponseDto[] = [];
  filteredRequests: PartialClosureResponseDto[] = [];
  searchQuery: string = '';
  loading: boolean = false;

  selectedRequest: PartialClosureResponseDto | null = null;
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
    this.foreclosureService.getPendingPartialRequests().subscribe({
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

  openDetails(req: PartialClosureResponseDto): void {
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

    this.foreclosureService.approvePartialRequest(this.selectedRequest.requestId, officerId).subscribe({
      next: () => {
        alert('Partial Prepayment request approved successfully!');
        this.closeModal();
        this.fetchRequests();
      },
      error: (err) => {
        alert(err.error?.message || 'Approval failed.');
      }
    });
  }
}