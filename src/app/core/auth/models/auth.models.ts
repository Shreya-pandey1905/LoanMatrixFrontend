
// Login request
export interface LoginRequest {
  email: string;
  password: string;
}

// Customer registration request
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

// OTP verification request
export interface OtpVerificationRequest {
  email: string;
  otp: string;
}

// Login response
export interface LoginResponse {
  token: string;
}

// Customer registration response
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

// Common API response
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
}
