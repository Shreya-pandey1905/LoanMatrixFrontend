
import { CommonModule } from '@angular/common';
import { Component, NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';

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
  selector: 'app-full-closure-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './full-closure-payment.html',
  styleUrl: './full-closure-payment.css'
})
export class FullClosurePayment {
  fullClosureRequestId: number | null = null;

  loading = false;
  message = '';
  errorMessage = '';
  order: PaymentOrderResponse | null = null;

  constructor(
    private paymentService: PaymentService,
    private zone: NgZone
  ) {}

  async startFullClosurePayment(): Promise<void> {
    this.message = '';
    this.errorMessage = '';
    this.order = null;

    const requestId = this.fullClosureRequestId;

    if (!requestId || requestId <= 0) {
      this.errorMessage = 'Enter a valid full closure request ID.';
      return;
    }

    this.loading = true;

    try {
      const loaded = await this.loadRazorpayScript();

      if (!loaded || !window.Razorpay) {
        throw new Error('Unable to load Razorpay Checkout.');
      }

      this.paymentService.createFullClosureOrder(requestId).subscribe({
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
              'Could not create the full closure payment order.';
          });
        }
      });
    } catch (error) {
      this.loading = false;
      this.errorMessage =
        error instanceof Error
          ? error.message
          : 'Could not start full closure payment.';
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
      description: 'Full Closure Payment',
      order_id: order.razorpayOrderId,
      theme: {
        color: '#1746a2'
      },
      handler: (response) => {
        this.zone.run(() =>
          this.verifyFullClosurePayment(response)
        );
      },
      modal: {
        ondismiss: () => {
          this.zone.run(() => {
            this.loading = false;
            this.message =
              'Checkout was closed. Check payment status before trying again.';
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

  private verifyFullClosurePayment(
    response: RazorpaySuccessResponse
  ): void {
    const request: VerifyPaymentRequest = {
      razorpayOrderId: response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature
    };

    this.paymentService.verifyFullClosurePayment(request).subscribe({
      next: () => {
        this.zone.run(() => {
          this.loading = false;
          this.message = 'Full closure payment verified successfully!';
          this.errorMessage = '';
        });
      },
      error: (error) => {
        this.zone.run(() => {
          this.loading = false;
          this.errorMessage =
            error?.error?.message ||
            error?.error?.error ||
            'Full closure payment verification failed.';
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
}
