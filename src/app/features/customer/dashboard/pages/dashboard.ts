
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

import { AuthService } from '../../../../core/auth/services/auth';

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

  private readonly authService =
    inject(AuthService);

  private readonly cdr =
    inject(ChangeDetectorRef);

  private readonly router =
    inject(Router);

  customerId: number | null = null;

  dashboard: CustomerDashboardData | null = null;
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    console.log('Customer dashboard component loaded.');

    this.customerId = this.authService.getCustomerId();

    if (this.customerId === null) {
      this.errorMessage =
        'Customer information is missing. Please log in again.';
      return;
    }

    this.loadDashboard();
  }

  loadDashboard(): void {
    if (this.customerId === null) {
      this.errorMessage =
        'Customer information is missing. Please log in again.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.dashboardService
      .getDashboard(this.customerId)
      .subscribe({
        next: (response) => {
          console.log('Dashboard API response:', response);

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
        },

        error: (error) => {
          console.error('Dashboard API error:', error);

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
        document.verificationStatus?.toUpperCase() === 'VERIFIED'
    ).length ?? 0;
  }

  get totalDocuments(): number {
    return this.dashboard?.documents?.length ?? 0;
  }
}
