
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth/services/auth';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  firstName = '';
  lastName = '';
  email = '';
  password = '';
  confirmPassword = '';
  mobileNo = '';
  aadhaarNo = '';
  panCard = '';
  dateOfBirth = '';
  employmentType = '';
  monthlyIncome: number | null = null;
  monthlyInvestmentAmount: number | null = 0;

  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  registerCustomer(): void {

    if (
      !this.firstName.trim() ||
      !this.lastName.trim() ||
      !this.email.trim() ||
      !this.password ||
      !this.mobileNo ||
      !this.aadhaarNo ||
      !this.panCard ||
      !this.dateOfBirth ||
      !this.employmentType ||
      this.monthlyIncome === null ||
      this.monthlyIncome <= 0
    ) {
      alert('Please fill all required fields correctly.');
      return;
    }

    if (this.password.length < 8) {
      alert('Password must contain at least 8 characters.');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    if (!/^[6-9][0-9]{9}$/.test(this.mobileNo)) {
      alert('Enter a valid 10-digit mobile number.');
      return;
    }

    if (!/^[0-9]{12}$/.test(this.aadhaarNo)) {
      alert('Aadhaar number must contain 12 digits.');
      return;
    }

    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(this.panCard.toUpperCase())) {
      alert('Enter a valid PAN number.');
      return;
    }

    const request = {
      firstName: this.firstName.trim(),
      lastName: this.lastName.trim(),
      email: this.email.trim(),
      password: this.password,
      mobileNo: this.mobileNo,
      aadhaarNo: this.aadhaarNo,
      panCard: this.panCard.toUpperCase(),
      dateOfBirth: this.dateOfBirth,
      employmentType: this.employmentType,
      monthlyIncome: this.monthlyIncome,
      monthlyInvestmentAmount: this.monthlyInvestmentAmount ?? 0
    };

    this.loading = true;

    this.authService.register(request).subscribe({
      next: (response) => {

        if (response.success) {
          alert(response.message || 'Registration successful. OTP sent to your email.');

          this.router.navigate(['/verify-otp'], {
            queryParams: { email: this.email.trim() }
          });
        } else {
          alert(response.message || 'Registration failed.');
        }

        this.loading = false;
      },

      error: (error) => {
        console.error('Registration failed', error);

        alert(
          error.error?.message ||
          'Registration failed. Please try again.'
        );

        this.loading = false;
      }
    });
  }
}