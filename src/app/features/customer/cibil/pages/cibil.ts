
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { AuthService } from '../../../../core/auth/services/auth';

import {
  CibilService,
  CibilResponse
} from '../services/cibilService';

@Component({
  selector: 'app-cibil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cibil.html',
  styleUrl: './cibil.css'
})
export class Cibil implements OnInit {

  private readonly authService = inject(AuthService);

  customerName = '';
  panCard = '';

  cibilScore: number | null = null;
  checkDate: string | null = null;
  checkTime = '';

  loading = false;
  generating = false;
  errorMessage = '';

  constructor(
    private cibilService: CibilService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCustomerDetails();
  }

  loadCustomerDetails(): void {
    const customerId = this.authService.getCustomerId();

    if (customerId === null) {
      this.errorMessage = 'Customer ID not found. Please log in again.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.cdr.detectChanges();

    this.cibilService.getCibilDetails(customerId).subscribe({
      next: (response) => {
        console.log('CIBIL API response:', response);

        this.customerName = response.data.customerName;
        this.panCard = this.maskPan(response.data.panCard);
        this.loading = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('CIBIL API error:', error);

        this.errorMessage =
          error.error?.message ??
          'Unable to load customer details. Please try again.';

        this.loading = false;

        this.cdr.detectChanges();
      }
    });
  }

  checkScore(): void {
    const customerId = this.authService.getCustomerId();

    if (customerId === null) {
      this.errorMessage = 'Customer ID not found. Please log in again.';
      return;
    }

    this.generating = true;
    this.errorMessage = '';

    this.cdr.detectChanges();

    this.cibilService.generateCibilScore(customerId).subscribe({
      next: (response) => {
        const data: CibilResponse = response.data;

        this.customerName = data.customerName;
        this.panCard = this.maskPan(data.panCard);
        this.cibilScore = data.cibilScore ?? null;
        this.checkDate = data.checkDate ?? null;

        this.checkTime = new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        });

        this.generating = false;

        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error('CIBIL score generation error:', error);

        this.errorMessage =
          error.error?.message ??
          'Unable to generate the CIBIL score. Please try again.';

        this.generating = false;

        this.cdr.detectChanges();
      }
    });
  }

  get needleAngle(): number {
    if (this.cibilScore === null) {
      return 0;
    }

    const normalized = Math.max(
      0,
      Math.min(1, (this.cibilScore - 500) / 400)
    );

    return -90 + normalized * 180;
  }

  private maskPan(pan: string): string {
    if (!pan) {
      return '';
    }

    if (pan.length <= 4) {
      return '*'.repeat(pan.length);
    }

    return '*'.repeat(pan.length - 4) + pan.slice(-4);
  }
}
