
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

  // Customer login
  login(
    request: LoginRequest
  ): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.apiUrl}/login`,
      request
    );
  }

  // Google login
  googleLogin(idToken: string): Observable<ApiResponse<LoginResponse>> {
    return this.http.post<ApiResponse<LoginResponse>>(
      `${this.apiUrl}/google`,
      { idToken }
    );
  }

  // Save JWT after successful login
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Get saved JWT
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Remove JWT during logout
  logout(): void {
    localStorage.removeItem('token');
  }

  // Check whether a token exists
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
