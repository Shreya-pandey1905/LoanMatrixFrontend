export interface DisbursementRequestDto {
  dealId: number;
  disbursementAmount?: number;
  bankPartner: string;
  disbursementDate: string;
}

export interface DisbursementResponseDto {
  disbursementId: number;
  dealId: number;
  loanAccountId?: number;
  loanAccountNo?: string;
  customerName: string;
  disburseAmount: number;
  bankPartner: string;
  disbursementDate: string;
  status: string;
}