
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe, registerLocaleData } from '@angular/common';
import localeEnIn from '@angular/common/locales/en-IN';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AuthService } from '../../../../core/auth/services/auth';
import { TrackingStatusService } from '../services/tracking-status-service';
import {
  CustomerDashboardResponse,
  ProgressStep,
  TrackingStatusResponse
} from '../models/trackingStatus.model';

// Indian number format for amounts, e.g. ₹5,00,000 (used with the 'en-IN' pipe locale)
registerLocaleData(localeEnIn);

@Component({
  selector: 'app-tracking-status',
  standalone: true,
  imports: [CurrencyPipe, DatePipe, RouterLink],
  templateUrl: './tracking-status.html',
  styleUrl: './tracking-status.css'
})
export class TrackingStatus implements OnInit {

  private trackingStatusService = inject(TrackingStatusService);
  private authService = inject(AuthService);

  // Raw API data
  trackingData = signal<TrackingStatusResponse | null>(null);
  dashboardData = signal<CustomerDashboardResponse | null>(null);

  loading = signal(true);
  errorMessage = signal('');

  // Which loan application is shown in the progress card
  selectedApplicationIndex = signal(0);

  activeLoan = computed(() => this.dashboardData()?.loanAccounts[0] ?? null);

  selectedApplication = computed(() =>
    this.trackingData()?.applicationProgress[this.selectedApplicationIndex()] ?? null
  );

  // Percentage of EMIs already paid
  paidPercent = computed(() => {
    const summary = this.trackingData()?.emiSummary;

    if (!summary || summary.totalEmis === 0) {
      return 0;
    }

    return Math.round((summary.paidEmis / summary.totalEmis) * 100);
  });

  // Numbers for the EMI donut chart: paid / next EMI / rest
  emiChart = computed(() => {
    const summary = this.trackingData()?.emiSummary;
    const nextEmiAmount = this.dashboardData()?.upcomingEmiAmount ?? 0;

    if (!summary || summary.totalEmis === 0) {
      return null;
    }

    const next = nextEmiAmount > 0 ? 1 : 0;
    const paidDeg = (summary.paidEmis / summary.totalEmis) * 360;
    const nextDeg = paidDeg + (next / summary.totalEmis) * 360;

    return {
      total: summary.totalEmis,
      paid: summary.paidEmis,
      paidAmount: summary.paidAmount,
      next,
      nextAmount: nextEmiAmount,
      remaining: summary.remainingEmis - next,
      remainingAmount: summary.remainingAmount - nextEmiAmount,
      background: `conic-gradient(
        var(--green) 0deg ${paidDeg}deg,
        var(--blue) ${paidDeg}deg ${nextDeg}deg,
        var(--gray-200) ${nextDeg}deg 360deg)`
    };
  });

  ngOnInit(): void {
    this.loadTrackingStatus();
  }

  loadTrackingStatus(): void {
    const customerId = this.authService.getCustomerId();

    if (customerId === null) {
      this.errorMessage.set('Customer ID not found. Please log in again.');
      this.loading.set(false);
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    // Call both APIs in parallel and wait for both results
    forkJoin({
      tracking: this.trackingStatusService.getTrackingStatus(customerId),
      dashboard: this.trackingStatusService.getDashboard(customerId)
    }).subscribe({
      next: ({ tracking, dashboard }) => {
        this.trackingData.set(tracking);
        this.dashboardData.set(dashboard);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading tracking status:', error);
        this.errorMessage.set(
          error.error?.message ?? 'Unable to load tracking status. Please try again.'
        );
        this.loading.set(false);
      }
    });
  }

  selectApplication(index: number): void {
    this.selectedApplicationIndex.set(index);
  }

  // done = completed, current = latest completed step, pending = not reached
  stepState(step: ProgressStep, currentStepIndex: number): string {
    if (step.stepNumber === currentStepIndex) {
      return 'current';
    }

    return step.status === 'COMPLETED' ? 'done' : 'pending';
  }

  // "BANK_STATEMENT" -> "Bank Statement"
  formatLabel(value: string): string {
    return value
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
