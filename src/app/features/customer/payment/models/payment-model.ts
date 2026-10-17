export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string | null;
}

export interface CreatePaymentRequest {
  loanAccountId: number;
  emiScheduleId: number;
}

export interface PaymentOrderResponse {
  razorpayOrderId: string;
  amount: number;
  currency: string;
  razorpayKeyId: string;
}

export interface VerifyPaymentRequest {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

export interface PaymentHistoryResponse {
  id: number;
  paymentAmount: number;
  paymentDate: string;
  paymentStatus: string;
  paymentName: string;
}
