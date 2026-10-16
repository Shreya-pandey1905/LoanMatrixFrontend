
// Common wrapper used by most backend APIs
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// GET /api/v1/user/tracking-status
export interface TrackingStatusResponse {
  profile: CustomerProfile;
  totalApplications: number;
  applicationProgress: LoanProgress[];
  emiSummary: EmiSummary;
  recentActivities: ActivityTimeline[];
}

export interface CustomerProfile {
  customerId: number;
  customerCode: string;
  fullName: string;
  email: string;
  kycVerified: boolean;
}

export interface LoanProgress {
  dealId: number;
  applicationId: string;
  overallStatus: string;
  currentStepIndex: number;
  bannerMessage: string;
  steps: ProgressStep[];
}

export interface ProgressStep {
  stepNumber: number;
  stepName: string;
  status: string;
  completedDate: string | null;
}

export interface EmiSummary {
  totalEmis: number;
  paidEmis: number;
  paidAmount: number;
  upcomingEmis: number;
  upcomingAmount: number;
  remainingEmis: number;
  remainingAmount: number;
}

export interface ActivityTimeline {
  title: string;
  description: string;
  timestamp: string;
}

// GET /api/v1/user/dashboard
export interface CustomerDashboardResponse {
  totalActiveLoanAccounts: number;
  loanAccounts: LoanAccount[];
  totalLoanAmount: number;
  totalOutstandingPrincipal: number;
  totalAmountPaid: number;
  emisPaid: number;
  emisPending: number;
  upcomingEmiAmount: number | null;
  upcomingEmiDueDate: string | null;
  recentPayments: Payment[];
  documents: CustomerDocument[];
}

export interface LoanAccount {
  loanAccountId: number;
  loanAccountNo: string;
  loanAmount: number;
  outstandingPrincipal: number;
  interestRate: number;
  tenureMonths: number;
  emiAmount: number;
  totalPaidAmount: number;
  loanStatus: string;
  disbursementDate: string | null;
}

export interface Payment {
  paymentId: number;
  loanAccountNo: string;
  paymentName: string;
  paymentAmount: number;
  paymentDate: string;
  paymentStatus: string;
}

export interface CustomerDocument {
  documentId: number;
  documentType: string;
  verificationStatus: string;
}
