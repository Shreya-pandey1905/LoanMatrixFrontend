import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';

import {
  ScorecardService,
  CustomerEligibilityResponse
} from '../services/scorecardService';

@Component({
  selector: 'app-scorecard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scorecard.html',
  styleUrl: './scorecard.css'
})
export class Scorecard implements OnInit {

  result: CustomerEligibilityResponse | null = null;

  loading = false;
  errorMessage = '';

  constructor(
    private scorecardService: ScorecardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadScorecard();
  }

  loadScorecard(): void {
    this.loading = true;
    this.errorMessage = '';

    this.cdr.detectChanges();

    console.log('1. Loading scorecard started');

    this.scorecardService
      .getCustomerEligibility()
      .pipe(
        finalize(() => {
          this.loading = false;

          console.log('3. Request finalized');

          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response) => {
          console.log('2. API response received:', response);

          if (response.success && response.data) {
            this.result = response.data;

            console.log(
              '4. Scorecard result assigned:',
              this.result
            );
          } else {
            this.errorMessage =
              response.message ||
              'Unable to load your scorecard.';
          }

          this.cdr.detectChanges();
        },

        error: (error) => {
          console.error('Scorecard API error:', error);

          this.errorMessage =
            error.error?.message ||
            `Unable to load your scorecard. HTTP status: ${
              error.status || 'unknown'
            }.`;

          this.cdr.detectChanges();
        }
      });
  }

  get status():
    | 'Approved'
    | 'Rejected'
    | 'Pending'
    | 'Unavailable' {

    if (!this.result) {
      return 'Unavailable';
    }

    if (this.result.eligible === true) {
      return 'Approved';
    }

    if (this.result.rejectionReason?.trim()) {
      return 'Rejected';
    }

    return 'Pending';
  }

  get statusDescription(): string {
    switch (this.status) {
      case 'Approved':
        return 'Your eligibility result is approved.';

      case 'Rejected':
        return 'Your application was rejected.';

      case 'Pending':
        return 'Your application is awaiting an officer decision.';

      default:
        return '';
    }
  }
}
