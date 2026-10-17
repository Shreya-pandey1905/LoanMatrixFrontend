export interface SanctionLetterResponseDto {
  sanctionLetterId: number;
  dealId: number;
  customerId: number;
  customerName: string;
  mobileNumber: string;
  loanType: string;
  loanAmount: number;
  interestRate: number;
  tenureMonths: number;
  emiAmount: number;
  createdAt: string;
  disbursementStatus?: string;
}

export interface SanctionLetterDetailDto {
  headerTitle: string;
  letterDate: string;
  applicantName: string;
  applicationNo: string;
  sanctionDate: string;
  mobileNo: string;
  loanType: string;
  loanAmountSanctioned: number;
  referenceInterestRate: string;
  loanTenure: number;
  totalProcessingCharges: string;
  originationFee: number;
  sanctionLetterValidity: number;
  amountOfEmi: number;
  propertyAddress: string;
  bankName: string;
  authorizedSignatory: string;
  additionalConditions: string[];
}

export interface GenerateSanctionRequestDto {
  dealId: number;
  loanAmount?: number;
  interestRate?: number;
  tenureMonths?: number;
  emiAmount?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: any;
}