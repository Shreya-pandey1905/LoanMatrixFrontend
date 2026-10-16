
import {
  Component,
  OnInit,
  inject,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  CustomerDashboardService,
  CustomerDashboardData
} from '../services/customerDashboardService';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private readonly dashboardService =
    inject(CustomerDashboardService);

  private readonly cdr =
    inject(ChangeDetectorRef);

  private readonly router =
    inject(Router);

  readonly customerId = 2;

  dashboard: CustomerDashboardData | null = null;
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    console.log('PAGES DASHBOARD COMPONENT LOADED');
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    console.log(
      '1. Request started. Loading:',
      this.loading
    );

    this.dashboardService
      .getDashboard(this.customerId)
      .subscribe({
        next: (response) => {
          console.log('2. API SUCCESS:', response);

          if (response.success && response.data) {
            this.dashboard = response.data;
          } else {
            this.dashboard = null;
            this.errorMessage =
              response.message ||
              'Unable to load dashboard data.';
          }

          this.loading = false;

          this.cdr.detectChanges();

          console.log('3. State updated:', {
            loading: this.loading,
            dashboard: this.dashboard,
            errorMessage: this.errorMessage
          });
        },

        error: (error) => {
          console.error('API ERROR:', error);

          this.loading = false;

          this.errorMessage =
            error.status === 0
              ? 'Cannot connect to the backend. Check that Spring Boot is running.'
              : error.error?.message ||
                'Failed to load dashboard data.';

          this.cdr.detectChanges();
        }
      });
  }

  navigateTo(path: string): void {
    this.router.navigateByUrl(path);
  }

  get kycVerifiedCount(): number {
    return this.dashboard?.documents?.filter(
      document =>
        document.verificationStatus?.toUpperCase() ===
        'VERIFIED'
    ).length ?? 0;
  }

  get totalDocuments(): number {
    return this.dashboard?.documents?.length ?? 0;
  }
}
