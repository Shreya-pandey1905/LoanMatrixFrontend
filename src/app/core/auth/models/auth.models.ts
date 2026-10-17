
export interface LoginRequest {
  email: string;
  password: string;
}

export interface CustomerRegistrationRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  mobileNo: string;
  aadhaarNo: string;
  panCard: string;
  dateOfBirth: string;
  employmentType: string;
  monthlyIncome: number;
  monthlyInvestmentAmount: number;
}

export interface OtpVerificationRequest {
  email: string;
  otp: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  customerId: number | null;
}

export interface CustomerRegistrationResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  aadhaarNo: string;
  panCard: string;
  employmentType: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}
