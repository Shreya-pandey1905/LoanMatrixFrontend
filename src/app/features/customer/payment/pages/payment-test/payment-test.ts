
// import { CommonModule } from '@angular/common';
// import { Component, NgZone } from '@angular/core';
// import { FormsModule } from '@angular/forms';

// import { PaymentService } from '../../services/payment';
// import {
//   PaymentOrderResponse,
//   VerifyPaymentRequest
// } from '../../models/payment-model';

// interface RazorpaySuccessResponse {
//   razorpay_order_id: string;
//   razorpay_payment_id: string;
//   razorpay_signature: string;
// }

// interface RazorpayOptions {
//   key: string;
//   amount: number;
//   currency: string;
//   name: string;
//   description: string;
//   order_id: string;
//   handler: (response: RazorpaySuccessResponse) => void;
//   modal?: {
//     ondismiss?: () => void;
//   };
//   theme?: {
//     color: string;
//   };
// }

// interface RazorpayInstance {
//   open(): void;
// }

// declare global {
//   interface Window {
//     Razorpay?: new (options: RazorpayOptions) => RazorpayInstance;
//   }
// }

// @Component({
//   selector: 'app-payment-test',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './payment-test.html',
//   styleUrl: './payment-test.css'
// })
// export class PaymentTest {
//   loanAccountId: number | null = null;
//   emiScheduleId: number | null = null;
//   partialClosureRequestId: number | null = null;
//   fullClosureRequestId: number | null = null;

//   loading = false;
//   message = '';
//   errorMessage = '';
//   order: PaymentOrderResponse | null = null;

//   constructor(
//     private paymentService: PaymentService,
//     private zone: NgZone
//   ) {}

//   async startPayment(): Promise<void> {
//     this.message = '';
//     this.errorMessage = '';
//     this.order = null;

//     if (
//       !this.loanAccountId ||
//       !this.emiScheduleId ||
//       this.loanAccountId <= 0 ||
//       this.emiScheduleId <= 0
//     ) {
//       this.errorMessage =
//         'Enter a valid loan account ID and EMI schedule ID.';
//       return;
//     }

//     this.loading = true;

//     try {
//       const loaded = await this.loadRazorpayScript();

//       if (!loaded || !window.Razorpay) {
//         throw new Error(
//           'Unable to load Razorpay Checkout. Check your internet connection and try again.'
//         );
//       }

//       this.paymentService.createEmiOrder({
//         loanAccountId: this.loanAccountId,
//         emiScheduleId: this.emiScheduleId
//       }).subscribe({
//         next: (order) => {
//           this.zone.run(() => {
//             this.order = order;
//             this.openCheckout(order);
//           });
//         },
//         error: (error) => {
//           this.zone.run(() => {
//             this.loading = false;
//             this.errorMessage =
//               error?.error?.message ||
//               error?.error?.error ||
//               error?.message ||
//               'Could not create the payment order. Check the backend logs.';
//           });
//         }
//       });
//     } catch (error) {
//       this.loading = false;
//       this.errorMessage =
//         error instanceof Error
//           ? error.message
//           : 'Could not start Razorpay Checkout.';
//     }
//   }

  
// private openCheckout(
//   order: PaymentOrderResponse,
//   paymentType: 'emi' | 'partial' | 'full' = 'emi'
// ): void {
//   if (!window.Razorpay) {
//     this.loading = false;
//     this.errorMessage = 'Razorpay Checkout is not available.';
//     return;
//   }

//   const options: RazorpayOptions = {
//     key: order.razorpayKeyId,
//     amount: Math.round(Number(order.amount) * 100),
//     currency: order.currency,
//     name: 'LoanMatrix',
//     description:
//       paymentType === 'partial'
//         ? 'Partial Closure Payment'
//         : 'EMI Payment',
//     order_id: order.razorpayOrderId,
//     theme: {
//       color: '#1746a2'
//     },
//     handler: (response) => {
//   this.zone.run(() => {
//     if (paymentType === 'partial') {
//       this.verifyPartialClosurePayment(response);
//     } else if (paymentType === 'full') {
//       this.verifyFullClosurePayment(response);
//     } else {
//       this.verifyPayment(response);
//     }
//   });
// },
//     modal: {
//       ondismiss: () => {
//         this.zone.run(() => {
//           this.loading = false;
//           this.message =
//             'Checkout was closed. Payment has not been confirmed by LoanMatrix.';
//         });
//       }
//     }
//   };

//   try {
//     const checkout = new window.Razorpay(options);
//     checkout.open();
//   } catch {
//     this.loading = false;
//     this.errorMessage = 'Could not open Razorpay Checkout.';
//   }
// }


//   private verifyPayment(
//     response: RazorpaySuccessResponse
//   ): void {
//     const request: VerifyPaymentRequest = {
//       razorpayOrderId: response.razorpay_order_id,
//       razorpayPaymentId: response.razorpay_payment_id,
//       razorpaySignature: response.razorpay_signature
//     };

//     this.paymentService.verifyEmiPayment(request).subscribe({
//       next: () => {
//         this.loading = false;
//         this.message =
//           'Payment verified successfully! The backend has updated the EMI payment status.';
//       },
//       error: (error) => {
//         this.loading = false;
//         this.errorMessage =
//           error?.error?.message ||
//           error?.error?.error ||
//           'Checkout returned payment details, but backend verification failed. Check the backend logs before retrying.';
//       }
//     });
//   }

//   private loadRazorpayScript(): Promise<boolean> {
//     if (window.Razorpay) {
//       return Promise.resolve(true);
//     }

//     return new Promise((resolve) => {
//       const script = document.createElement('script');
//       script.src = 'https://checkout.razorpay.com/v1/checkout.js';
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.head.appendChild(script);
//     });
//   }



//   async startPartialClosurePayment(requestId: number): Promise<void> {
//   this.message = '';
//   this.errorMessage = '';
//   this.order = null;

//   if (!requestId || requestId <= 0) {
//     this.errorMessage = 'Invalid partial closure request ID.';
//     return;
//   }

//   this.loading = true;

//   try {
//     const loaded = await this.loadRazorpayScript();

//     if (!loaded || !window.Razorpay) {
//       throw new Error('Unable to load Razorpay Checkout.');
//     }

//     this.paymentService
//       .createPartialClosureOrder(requestId)
//       .subscribe({
//         next: (order) => {
//           this.zone.run(() => {
//             this.order = order;
//             this.openCheckout(order, 'partial');
//           });
//         },
//         error: (error) => {
//           this.zone.run(() => {
//             this.loading = false;
//             this.errorMessage =
//               error?.error?.message ||
//               error?.error?.error ||
//               'Could not create the partial closure payment order.';
//           });
//         }
//       });
//   } catch (error) {
//     this.loading = false;
//     this.errorMessage =
//       error instanceof Error
//         ? error.message
//         : 'Could not start partial closure payment.';
//   }
// }



// private verifyPartialClosurePayment(
//   response: RazorpaySuccessResponse
// ): void {
//   const request: VerifyPaymentRequest = {
//     razorpayOrderId: response.razorpay_order_id,
//     razorpayPaymentId: response.razorpay_payment_id,
//     razorpaySignature: response.razorpay_signature
//   };

//   this.paymentService
//     .verifyPartialClosurePayment(request)
//     .subscribe({
//       next: () => {
//         this.zone.run(() => {
//           this.loading = false;
//           this.message =
//             'Partial closure payment verified successfully!';
//           this.errorMessage = '';
//         });
//       },
//       error: (error) => {
//         this.zone.run(() => {
//           this.loading = false;
//           this.errorMessage =
//             error?.error?.message ||
//             error?.error?.error ||
//             'Partial closure payment verification failed. Check the backend logs.';
//         });
//       }
//     });
// }


// async startFullClosurePayment(requestId: number): Promise<void> {
//   this.message = '';
//   this.errorMessage = '';
//   this.order = null;

//   if (!requestId || requestId <= 0) {
//     this.errorMessage = 'Please enter a valid full closure request ID.';
//     return;
//   }

//   this.loading = true;

//   const scriptLoaded = await this.loadRazorpayScript();

//   if (!scriptLoaded) {
//     this.loading = false;
//     this.errorMessage = 'Could not load Razorpay Checkout.';
//     return;
//   }

//   this.paymentService.createFullClosureOrder(requestId).subscribe({
//     next: (order) => {
//       this.zone.run(() => {
//         this.order = order;
//         this.openCheckout(order, 'full');
//       });
//     },
//     error: (error) => {
//       this.zone.run(() => {
//         this.loading = false;
//         this.errorMessage =
//           error?.error?.message ||
//           error?.error?.error ||
//           'Could not create the full closure payment order.';
//       });
//     }
//   });
// }


// private verifyFullClosurePayment(
//   response: RazorpaySuccessResponse
// ): void {
//   const request: VerifyPaymentRequest = {
//     razorpayOrderId: response.razorpay_order_id,
//     razorpayPaymentId: response.razorpay_payment_id,
//     razorpaySignature: response.razorpay_signature
//   };

//   this.paymentService.verifyFullClosurePayment(request).subscribe({
//     next: () => {
//       this.zone.run(() => {
//         this.loading = false;
//         this.message = 'Full closure payment verified successfully!';
//         this.errorMessage = '';
//       });
//     },
//     error: (error) => {
//       this.zone.run(() => {
//         this.loading = false;
//         this.errorMessage =
//           error?.error?.message ||
//           error?.error?.error ||
//           'Full closure payment verification failed.';
//       });
//     }
//   });
// }


// }



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
  selector: 'app-emi-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-test.html',
  styleUrl: './payment-test.css'
})
export class EmiPayment {
  loanAccountId: number | null = null;
  emiScheduleId: number | null = null;

  loading = false;
  message = '';
  errorMessage = '';
  order: PaymentOrderResponse | null = null;

  constructor(
    private paymentService: PaymentService,
    private zone: NgZone
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
}
