
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth/services/auth';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './verify-otp.html',
  styleUrl: './verify-otp.css'
})
export class VerifyOtp {

  email = '';
  otp = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
  }

  verifyOtp(): void {

    if (!this.email.trim() || !this.otp.trim()) {
      alert('Please enter your email and OTP.');
      return;
    }

    if (!/^\d{6}$/.test(this.otp)) {
      alert('OTP must contain exactly 6 digits.');
      return;
    }

    this.loading = true;

    this.authService.verifyOtp({
      email: this.email.trim(),
      otp: this.otp.trim()
    }).subscribe({

      next: (response) => {

        if (response.success) {
          alert(response.message || 'Email verified successfully.');
          this.router.navigate(['/login']);
        } else {
          alert(response.message || 'OTP verification failed.');
        }

        this.loading = false;
      },

      error: (error) => {
        console.error('OTP verification failed', error);

        alert(
          error.error?.message ||
          'Invalid or expired OTP. Please try again.'
        );

        this.loading = false;
      }
    });
  }
}
