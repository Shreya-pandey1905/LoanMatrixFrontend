
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  EligibilityService,
  EligibilityData
} from '../../services/eligibility';

@Component({
  selector: 'app-eligibility-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eligibility-result.html',
  styleUrl: './eligibility-result.css'
})
export class EligibilityResult implements OnInit {

  private readonly eligibilityService = inject(EligibilityService);
  private readonly router = inject(Router);

  eligibility: EligibilityData | null = null;

  processing = false;
  decisionMade = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit(): void {
    const navigationState = history.state as {
      eligibility?: EligibilityData;
    };

    if (navigationState?.eligibility) {
      this.eligibility = navigationState.eligibility;

      // Hide decision buttons if the customer is not awaiting an officer.
      this.decisionMade =
        !navigationState.eligibility.officerActionRequired;
    } else {
      this.errorMessage =
        'Eligibility result not found. Please return and check eligibility again.';
    }
  }

  approve(): void {
    if (
      !this.eligibility ||
      this.processing ||
      this.decisionMade
    ) {
      return;
    }

    const customerId = this.eligibility.customerId;

    this.processing = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.eligibilityService.approveEligibility(customerId).subscribe({
      next: (response) => {
        this.processing = false;

        if (response.success) {
          this.eligibility = {
            ...this.eligibility!,
            eligible: true,
            autoApproved: false,
            officerActionRequired: false
          };

          this.decisionMade = true;
          this.successMessage =
            response.message || 'Customer approved successfully.';
        } else {
          this.errorMessage =
            response.message || 'Unable to approve eligibility.';
        }
      },

      error: (error) => {
        this.processing = false;
        this.errorMessage =
          error.error?.message || 'Unable to approve eligibility.';
      }
    });
  }

  reject(): void {
    if (
      !this.eligibility ||
      this.processing ||
      this.decisionMade
    ) {
      return;
    }

    const customerId = this.eligibility.customerId;

    this.processing = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.eligibilityService.rejectEligibility(customerId).subscribe({
      next: (response) => {
        this.processing = false;

        if (response.success) {
          this.eligibility = {
            ...this.eligibility!,
            eligible: false,
            autoApproved: false,
            officerActionRequired: false
          };

          this.decisionMade = true;
          this.successMessage =
            response.message || 'Customer rejected successfully.';
        } else {
          this.errorMessage =
            response.message || 'Unable to reject eligibility.';
        }
      },

      error: (error) => {
        this.processing = false;
        this.errorMessage =
          error.error?.message || 'Unable to reject eligibility.';
      }
    });
  }

  goBack(): void {
    if (!this.processing) {
      this.router.navigate(['/officer/eligibility-check']);
    }
  }
}
