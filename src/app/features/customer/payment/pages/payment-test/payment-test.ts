import { CommonModule } from '@angular/common';
import { Component, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';

import { PaymentService } from '../../services/payment';
import {
  PaymentOrderResponse,
  VerifyPaymentRequest
} from '../../models/payment-model';

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
  selector: 'app-emi-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-test.html',
  styleUrl: './payment-test.css'
})
export class EmiPayment implements OnInit {
  loanAccountId: number | null = null;
  emiScheduleId: number | null = null;

  loading = false;
  message = '';
  errorMessage = '';
  order: PaymentOrderResponse | null = null;

  constructor(
  private paymentService: PaymentService,
  private zone: NgZone,
  private route: ActivatedRoute
) {}
  async startPayment(): Promise<void> {
    this.message = '';
    this.errorMessage = '';
    this.order = null;

    if (
      !this.loanAccountId ||
      !this.emiScheduleId ||
      this.loanAccountId <= 0 ||
      this.emiScheduleId <= 0
    ) {
      this.errorMessage =
        'Enter a valid loan account ID and EMI schedule ID.';
      return;
    }

    this.loading = true;

    try {
      const loaded = await this.loadRazorpayScript();

      if (!loaded || !window.Razorpay) {
        throw new Error(
          'Unable to load Razorpay Checkout. Check your internet connection.'
        );
      }

      this.paymentService.createEmiOrder({
        loanAccountId: this.loanAccountId,
        emiScheduleId: this.emiScheduleId
      }).subscribe({
        next: (order) => {
          this.zone.run(() => {
            this.order = order;
            this.openCheckout(order);
          });
        },
        error: (error) => {
          this.zone.run(() => {
            this.loading = false;
            this.errorMessage =
              error?.error?.message ||
              error?.error?.error ||
              error?.message ||
              'Could not create the EMI payment order.';
          });
        }
      });
    } catch (error) {
      this.loading = false;
      this.errorMessage =
        error instanceof Error
          ? error.message
          : 'Could not start Razorpay Checkout.';
    }
  }

  private openCheckout(order: PaymentOrderResponse): void {
    if (!window.Razorpay) {
      this.loading = false;
      this.errorMessage = 'Razorpay Checkout is not available.';
      return;
    }

    const options: RazorpayOptions = {
      key: order.razorpayKeyId,
      amount: Math.round(Number(order.amount) * 100),
      currency: order.currency,
      name: 'LoanMatrix',
      description: 'EMI Payment',
      order_id: order.razorpayOrderId,
      theme: {
        color: '#1746a2'
      },
      handler: (response) => {
        this.zone.run(() => this.verifyPayment(response));
      },
      modal: {
        ondismiss: () => {
          this.zone.run(() => {
            this.loading = false;
            this.message =
              'Checkout was closed. Payment has not been confirmed by LoanMatrix.';
          });
        }
      }
    };

    try {
      new window.Razorpay(options).open();
    } catch {
      this.loading = false;
      this.errorMessage = 'Could not open Razorpay Checkout.';
    }
  }

  private verifyPayment(response: RazorpaySuccessResponse): void {
    const request: VerifyPaymentRequest = {
      razorpayOrderId: response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature
    };

    this.paymentService.verifyEmiPayment(request).subscribe({
      next: () => {
        this.zone.run(() => {
          this.loading = false;
          this.message =
            'EMI payment verified successfully!';
          this.errorMessage = '';
        });
      },
      error: (error) => {
        this.zone.run(() => {
          this.loading = false;
          this.errorMessage =
            error?.error?.message ||
            error?.error?.error ||
            'EMI payment verification failed. Check the backend logs.';
        });
      }
    });
  }

  private loadRazorpayScript(): Promise<boolean> {
    if (window.Razorpay) {
      return Promise.resolve(true);
    }

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.head.appendChild(script);
    });
  }


  ngOnInit(): void {
  this.route.queryParamMap.subscribe(params => {
    const loanAccountId = Number(params.get('loanAccountId'));
    const emiScheduleId = Number(params.get('emiScheduleId'));

    this.loanAccountId =
      Number.isInteger(loanAccountId) && loanAccountId > 0
        ? loanAccountId
        : null;

    this.emiScheduleId =
      Number.isInteger(emiScheduleId) && emiScheduleId > 0
        ? emiScheduleId
        : null;
  });
}
}
