
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  EligibilityService,
  PendingCustomer
} from '../../services/eligibility';

@Component({
  selector: 'app-eligibility-check',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './eligibility-check.html',
  styleUrl: './eligibility-check.css'
})
export class EligibilityCheck implements OnInit {

  private readonly eligibilityService = inject(EligibilityService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  customers: PendingCustomer[] = [];
  selectedCustomerId = '';

  loading = false;
  checking = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadPendingCustomers();
  }

  loadPendingCustomers(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.eligibilityService.getPendingCustomers().subscribe({
      next: (response) => {
        if (response.success && Array.isArray(response.data)) {
          this.customers = response.data;
        } else {
          this.customers = [];
          this.errorMessage =
            response.message || 'Unable to load pending customers.';
        }

        this.loading = false;
        this.cdr.detectChanges();

        console.log('Pending customers:', this.customers);
      },

      error: (error) => {
        console.error('Pending customers API error:', error);

        this.customers = [];
        this.loading = false;
        this.errorMessage =
          error.error?.message ||
          'Unable to load customers. Please check the backend.';

        this.cdr.detectChanges();
      }
    });
  }

  onCustomerChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCustomerId = select.value;
  }

  checkEligibility(): void {
    if (!this.selectedCustomerId || this.checking) {
      return;
    }

    const customerId = Number(this.selectedCustomerId);

    if (!Number.isInteger(customerId) || customerId <= 0) {
      this.errorMessage = 'Please select a valid customer.';
      return;
    }

    this.checking = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.eligibilityService.checkEligibility(customerId).subscribe({
      next: (response) => {
        this.checking = false;

        if (response.success && response.data) {
          this.router.navigate(
            ['/officer/eligibility-result', customerId],
            {
              state: { eligibility: response.data }
            }
          );
        } else {
          this.errorMessage =
            response.message || 'Eligibility check failed.';
          this.cdr.detectChanges();
        }
      },

      error: (error) => {
        console.error('Eligibility check API error:', error);

        this.checking = false;
        this.errorMessage =
          error.error?.message || 'Unable to check eligibility.';

        this.cdr.detectChanges();
      }
    });
  }
}
