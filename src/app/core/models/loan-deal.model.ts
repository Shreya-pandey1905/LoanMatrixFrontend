export interface LoanTypeOption {
  typeKey: string;
  label: string;
  interestRate: number;
}

export interface ApplyLoanRequest {
  customerId: number;
  loanType: string;
  loanAmount: number;
  tenureMonths: number;
  bankName: string;
  bankAccountNumber: string;
  ifscCode: string;
  emiDay: number;
}

export interface ReviewDealRequest {
  officerId: number;
  status: 'APPROVED' | 'REJECTED';
}

export interface ApplyLoanResponse {
  dealId: number;
  customerId: number;
  customerName: string;
  loanType: string;
  loanAmount: number;
  approvedAmount: number;
  interestRate: number;
  tenureMonths: number;
  emiAmount: number;
  bankName: string;
  bankAccountNumber: string;
  ifscCode: string;
  emiDay: number;
  status: string;
  appliedDate: string;
  rejectionReason?: string | null;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: any;
}