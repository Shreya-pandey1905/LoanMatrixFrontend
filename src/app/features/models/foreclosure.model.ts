export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface FullClosureRequestDto {
  loanAccountId: number;
  expectedClosureDate?: string;
  reason?: string;
}

export interface FullClosureResponseDto {
  requestId: number;
  loanAccountId: number;
  loanAccountNo: string;
  customerName: string;
  foreClosureType: string;
  outstandingPrincipal: number;
  penaltyAmount: number;
  totalSettlementAmount: number;
  status: string;
  isPaid: boolean;
  requestedDate: string;
  approvedDate?: string;
  reason?: string;
}

export interface PartialClosureRequestDto {
  loanAccountId: number;
  partialAmount: number;
  expectedClosureDate?: string;
  reason?: string;
}

export interface PartialClosureResponseDto {
  requestId: number;
  loanAccountId: number;
  loanAccountNo: string;
  customerName: string;
  foreClosureType: string;
  partialAmount: number;
  remainingOutstandingPrincipal: number;
  totalPaidAmount: number;
  status: string;
  isPaid: boolean;
  requestedDate: string;
  approvedDate?: string;
  paidDate?: string;
  reason?: string;
}