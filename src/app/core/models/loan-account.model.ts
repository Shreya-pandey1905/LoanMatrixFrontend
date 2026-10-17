export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoanAccountSummaryDto {
  id: number;
  loanAccountNo: string;
  customerName: string;
  loanAmount: number;
  outstandingPrincipal: number;
  status: string;
  interestRate: number;
  tenureMonths: number;
  emiAmount: number;
  disbursementDate: string;
  totalPaid: number;
}

export interface LoanAccountProfileDto {
  id: number;
  loanAccountNo: string;
  customerName: string;
  loanAmount: number;
  outstandingPrincipal: number;
  loanStatus: string;
  interestRate: number;
  tenureMonths: number;
  emiAmount: number;
  totalPaidAmount: number;
  disbursementDate: string;
  createdAt: string;
}