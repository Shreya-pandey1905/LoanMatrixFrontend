
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { LoanAccountService } from '../../../services/loan-account';
import { ForeclosureService } from '../../../services/foreclosure';
import { PaymentService } from '../../payment/services/payment';

import { LoanAccountSummaryDto } from '../../../models/loan-account.model';
import { PartialClosureResponseDto } from '../../../models/foreclosure.model';
import {
  PaymentOrderResponse,
  VerifyPaymentRequest
} from '../../payment/models/payment-model';

interface RazorpaySuccessResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
  theme?: {
    color: string;
  };
}

interface RazorpayInstance {
  open(): void;
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

@Component({
  selector: 'app-partial-closure',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './partial-closure.html',
  styleUrls: ['./partial-closure.css']
})
export class PartialClosure implements OnInit {
  customerId = 1;

  accounts: LoanAccountSummaryDto[] = [];
  selectedAccount: LoanAccountSummaryDto | null = null;

  partialAmount: number | null = null;
  expectedClosureDate = '';
  reason = '';

  myRequests: PartialClosureResponseDto[] = [];

  loading = false;
  submitting = false;
  processingPayment = false;

  private activePaymentRequestId: number | null = null;

  constructor(
    private loanAccountService: LoanAccountService,
    private foreclosureService: ForeclosureService,
    private paymentService: PaymentService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {}

  ngOnInit(): void {
    const rawId =
      localStorage.getItem('customerId') ||
      sessionStorage.getItem('customerId');

    this.customerId = rawId ? Number(rawId) : 1;

    const date = new Date();
    date.setDate(date.getDate() + 7);

    // Format the date using local time, avoiding UTC date shifts.
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    this.expectedClosureDate = `${year}-${month}-${day}`;

    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading = true;

    this.loanAccountService
      .getCustomerAccounts(this.customerId)
      .subscribe({
        next: (res: any) => {
          this.loading = false;

          let list: any[] = [];

          if (Array.isArray(res)) {
            list = res;
          } else if (res && Array.isArray(res.data)) {
            list = res.data;
          } else if (
            res?.data?.loanAccounts &&
            Array.isArray(res.data.loanAccounts)
          ) {
            list = res.data.loanAccounts;
          }

          this.accounts = list.map((account: any) => ({
            ...account,
            id: account.id ?? account.loanAccountId,
            loanAccountNo:
              account.loanAccountNo ??
              `LA-${account.id ?? account.loanAccountId ?? ''}`,
            outstandingPrincipal:
              account.outstandingPrincipal ?? account.loanAmount ?? 0,
            status: account.status ?? account.loanStatus ?? 'ACTIVE'
          }));

          // Keep the selected account when refreshing after payment.
          if (this.accounts.length > 0) {
            const previousAccountNo =
              this.selectedAccount?.loanAccountNo;

            this.selectedAccount =
              this.accounts.find(
                account =>
                  account.loanAccountNo === previousAccountNo
              ) ?? this.accounts[0];

            this.loadRequests();
          } else {
            this.selectedAccount = {
              id: 0,
              loanAccountNo: 'No Active Loan',
              customerName: 'Customer',
              loanAmount: 0,
              outstandingPrincipal: 0,
              status: 'INACTIVE',
              interestRate: 0,
              tenureMonths: 0,
              emiAmount: 0,
              disbursementDate: '',
              totalPaid: 0
            };

            this.myRequests = [];
          }

          this.cdr.detectChanges();
        },
        error: error => {
          this.loading = false;

          console.warn(
            'Could not load loan accounts for partial closure:',
            error
          );

          this.cdr.detectChanges();
        }
      });
  }

  onAccountChange(accountNo: string): void {
    this.selectedAccount =
      this.accounts.find(
        account => account.loanAccountNo === accountNo
      ) ?? null;

    this.myRequests = [];
    this.loadRequests();
  }

  loadRequests(): void {
    if (!this.selectedAccount || !this.selectedAccount.id) {
      this.myRequests = [];
      return;
    }

    this.foreclosureService
      .getPartialRequestsByAccount(this.selectedAccount.id)
      .subscribe({
        next: res => {
          if (res?.success) {
            this.myRequests = res.data ?? [];
          }

          this.cdr.detectChanges();
        },
        error: error => {
          console.error(
            'Could not load partial foreclosure requests:',
            error
          );

          this.cdr.detectChanges();
        }
      });
  }

  onTypeToggle(type: string): void {
    if (type === 'Full') {
      this.router.navigate(['/customer/closure/full']);
    }
  }

  submitRequest(): void {
    if (
      !this.selectedAccount ||
      !this.selectedAccount.id ||
      this.selectedAccount.status !== 'ACTIVE'
    ) {
      alert('Please select an active loan account.');
      return;
    }

    if (
      this.partialAmount === null ||
      !Number.isFinite(this.partialAmount) ||
      this.partialAmount <= 0
    ) {
      alert('Please enter a valid partial foreclosure amount.');
      return;
    }

    if (
      this.partialAmount >=
      this.selectedAccount.outstandingPrincipal
    ) {
      alert(
        'Partial amount cannot equal or exceed the outstanding principal. Use Full Foreclosure instead.'
      );
      return;
    }

    if (!this.expectedClosureDate) {
      alert('Please select an expected closure date.');
      return;
    }

    this.submitting = true;

    this.foreclosureService
      .submitPartialRequest({
        loanAccountId: this.selectedAccount.id,
        partialAmount: this.partialAmount,
        expectedClosureDate: this.expectedClosureDate,
        reason: this.reason || 'Partial Prepayment'
      })
      .subscribe({
        next: () => {
          this.submitting = false;

          alert(
            'Partial closure request submitted successfully! Awaiting officer review.'
          );

          this.partialAmount = null;
          this.reason = '';

          this.loadRequests();
          this.cdr.detectChanges();
        },
        error: error => {
          this.submitting = false;

          alert(
            error?.error?.message ??
            'Failed to submit partial closure request.'
          );

          this.cdr.detectChanges();
        }
      });
  }

  /**
   * Starts Razorpay checkout for an approved, unpaid request.
   */
  async onPayClick(
    request: PartialClosureResponseDto
  ): Promise<void> {
    if (this.processingPayment) {
      return;
    }

    if (
      request.status !== 'Approved' ||
      request.isPaid ||
      !request.requestId
    ) {
      alert('Only approved and unpaid requests can be paid.');
      return;
    }

    const confirmed = confirm(
      `Proceed to Razorpay to pay ₹${request.partialAmount} for loan account ${request.loanAccountNo}?`
    );

    if (!confirmed) {
      return;
    }

    this.processingPayment = true;
    this.activePaymentRequestId = request.requestId;

    try {
      const scriptLoaded = await this.loadRazorpayScript();

      if (!scriptLoaded || !window.Razorpay) {
        throw new Error('Unable to load Razorpay Checkout.');
      }

      this.paymentService
        .createPartialClosureOrder(request.requestId)
        .subscribe({
          next: (order: PaymentOrderResponse) => {
            this.zone.run(() => {
              if (!order?.razorpayOrderId || !order.razorpayKeyId) {
                this.processingPayment = false;
                alert('The backend returned an invalid Razorpay order.');
                return;
              }

              this.openPartialClosureCheckout(order);
            });
          },
          error: error => {
            this.zone.run(() => {
              this.processingPayment = false;
              this.activePaymentRequestId = null;

              alert(
                error?.error?.message ??
                error?.error?.error ??
                'Could not create the partial closure payment order.'
              );

              this.cdr.detectChanges();
            });
          }
        });
    } catch (error) {
      this.processingPayment = false;
      this.activePaymentRequestId = null;

      alert(
        error instanceof Error
          ? error.message
          : 'Could not start partial closure payment.'
      );

      this.cdr.detectChanges();
    }
  }

  /**
   * Opens the official Razorpay Checkout UI using the backend order.
   */
  private openPartialClosureCheckout(
    order: PaymentOrderResponse
  ): void {
    if (!window.Razorpay) {
      this.processingPayment = false;
      this.activePaymentRequestId = null;

      alert('Razorpay Checkout is not available.');
      return;
    }

    const options: RazorpayOptions = {
      key: order.razorpayKeyId,
      amount: Math.round(Number(order.amount) * 100),
      currency: order.currency,
      name: 'LoanMatrix',
      description: 'Partial Closure Payment',
      order_id: order.razorpayOrderId,

      theme: {
        color: '#1746a2'
      },

      handler: (response: RazorpaySuccessResponse) => {
        this.zone.run(() => {
          this.verifyPartialClosurePayment(response);
        });
      },

      modal: {
        ondismiss: () => {
          this.zone.run(() => {
            this.processingPayment = false;
            this.activePaymentRequestId = null;
            this.cdr.detectChanges();
          });
        }
      }
    };

    try {
      new window.Razorpay(options).open();
    } catch {
      this.processingPayment = false;
      this.activePaymentRequestId = null;

      alert('Could not open Razorpay Checkout.');
      this.cdr.detectChanges();
    }
  }

  /**
   * Verifies the Razorpay payment on the backend.
   * Do not mark the request paid from the frontend alone.
   */
  private verifyPartialClosurePayment(
    response: RazorpaySuccessResponse
  ): void {
    const request: VerifyPaymentRequest = {
      razorpayOrderId: response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature
    };

    this.paymentService
      .verifyPartialClosurePayment(request)
      .subscribe({
        next: () => {
          this.zone.run(() => {
            this.processingPayment = false;
            this.activePaymentRequestId = null;

            alert(
              'Partial closure payment verified successfully!'
            );

            // Reload account balances and the request status.
            this.loadAccounts();

            this.cdr.detectChanges();
          });
        },
        error: error => {
          this.zone.run(() => {
            this.processingPayment = false;

            alert(
              error?.error?.message ??
              error?.error?.error ??
              'Partial closure payment verification failed. Check payment status before retrying.'
            );

            this.activePaymentRequestId = null;
            this.loadRequests();
            this.cdr.detectChanges();
          });
        }
      });
  }

  /**
   * Loads Razorpay Checkout only when it is not already available.
   */
  private loadRazorpayScript(): Promise<boolean> {
    if (window.Razorpay) {
      return Promise.resolve(true);
    }

    return new Promise(resolve => {
      const script = document.createElement('script');

      script.src =
        'https://checkout.razorpay.com/v1/checkout.js';

      script.onload = () => resolve(!!window.Razorpay);
      script.onerror = () => resolve(false);

      document.head.appendChild(script);
    });
  }
}
