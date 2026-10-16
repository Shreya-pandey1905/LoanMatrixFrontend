
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  ApiResponse,
  LoginRequest,
  LoginResponse,
  CustomerRegistrationRequest,
  CustomerRegistrationResponse,
  OtpVerificationRequest
} from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}/api/auth`;

  constructor(private http: HttpClient) {}

  // Customer registration
  register(
    request: CustomerRegistrationRequest
  ): Observable<ApiResponse<CustomerRegistrationResponse>> {
    return this.http.post<ApiResponse<CustomerRegistrationResponse>>(
      `${this.apiUrl}/register`,
      request
    );
  }

  // Verify email OTP
  verifyOtp(
    request: OtpVerificationRequest
  ): Observable<ApiResponse<string>> {
    return this.http.post<ApiResponse<string>>(
      `${this.apiUrl}/verify-otp`,
      request
    );
  }

  // Email and password login
  login(
    request: LoginRequest
  ): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.apiUrl}/login`,
      request
    );
  }

  // Google login
  googleLogin(
    idToken: string
  ): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.apiUrl}/google`,
      { idToken }
    );
  }

  // Save JWT
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Get JWT
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Save role
  saveRole(role: string): void {
    localStorage.setItem('role', role);
  }

  // Get role
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  // Save logged-in customer's ID (needed by customer APIs)
  saveCustomerId(customerId: number | null): void {
    if (customerId !== null) {
      localStorage.setItem('customerId', String(customerId));
    }
  }

  // Get logged-in customer's ID
  getCustomerId(): number | null {
    const customerId = localStorage.getItem('customerId');
    return customerId ? Number(customerId) : null;
  }

  // Remove authentication data
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('customerId');
  }

  // Check login status
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
