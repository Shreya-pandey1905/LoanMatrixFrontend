import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisbursementService } from '../../../../core/services/disbursement';
import { DisbursementResponseDto } from '../../../../core/models/disbursement.model';

@Component({
  selector: 'app-disbursement',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './disbursement.html',
  styleUrls: ['./disbursement.css']
})
export class Disbursement implements OnInit {
  customerId: number | null = null;
  disbursements: DisbursementResponseDto[] = [];
  loading: boolean = false;
  errorMsg: string = '';

  constructor(
    private disbursementService: DisbursementService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const storedId = localStorage.getItem('customerId') || sessionStorage.getItem('customerId');
    if (storedId) {
      this.customerId = Number(storedId);
      this.fetchDisbursements();
    } else {
      this.errorMsg = 'Customer ID not found. Please log in.';
    }
  }

  fetchDisbursements(): void {
    if (!this.customerId) return;
    this.loading = true;
    this.cdr.detectChanges();

    this.disbursementService.getDisbursementsByCustomerId(this.customerId).subscribe({
      next: (res) => {
        this.loading = false;
        if (res && res.success && res.data) {
          this.disbursements = res.data;
        } else {
          this.disbursements = [];
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        console.error('Failed to load disbursements:', err);
        this.cdr.detectChanges();
      }
    });
  }
}