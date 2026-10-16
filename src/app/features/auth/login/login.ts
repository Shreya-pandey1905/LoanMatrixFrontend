
import {
  Component,
  AfterViewInit,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/auth/services/auth';
import { environment } from '../../../../environments/environment';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login implements AfterViewInit, OnDestroy {
  email = '';
  password = '';
  showPassword = false;
  loading = false;
  googleLoading = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  ngAfterViewInit(): void {
    this.loadGoogleScript();
  }

  ngOnDestroy(): void {
    // No cleanup required for the Google Identity Services script.
  }

  private loadGoogleScript(): void {
    const existingScript = document.getElementById(
      'google-identity-script'
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (typeof google !== 'undefined') {
        this.initializeGoogle();
      } else {
        existingScript.addEventListener(
          'load',
          () => this.initializeGoogle(),
          { once: true }
        );
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-identity-script';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;

    script.onload = () => this.initializeGoogle();

    script.onerror = () => {
      console.error('Unable to load Google Sign-In.');
    };

    document.head.appendChild(script);
  }

  private initializeGoogle(): void {
    if (typeof google === 'undefined') {
      console.error('Google Identity Services is unavailable.');
      return;
    }

    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (response: any) => {
        this.onGoogleLogin(response.credential);
      }
    });

    const button = document.getElementById('google-signin-button');

    if (button) {
      button.innerHTML = '';

      google.accounts.id.renderButton(button, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        width: 300
      });
    }
  }

  private redirectByRole(role: string): void {
    const normalizedRole = role.trim().toUpperCase();

    if (normalizedRole === 'CUSTOMER') {
      if (this.authService.getCustomerId() === null) {
        this.authService.logout();
        alert('Customer ID is missing from the login response. Please contact support.');
        this.router.navigate(['/login']);
        return;
      }

      this.router.navigate(['/customer/dashboard']);
    } else if (
      normalizedRole === 'LOAN_OFFICER' ||
      normalizedRole === 'LOAN OFFICER'
    ) {
      this.router.navigate(['/officer/dashboard']);
    } else {
      this.authService.logout();
      alert('Your account has an invalid or unsupported role.');
      this.router.navigate(['/login']);
    }
  }

  onGoogleLogin(idToken: string): void {
    if (!idToken) {
      alert('Google sign-in failed. Please try again.');
      return;
    }

    this.googleLoading = true;

    this.authService.googleLogin(idToken).subscribe({
      next: (response) => {
        if (
          response.success &&
          response.data?.token &&
          response.data?.role
        ) {
          // Clear details from any previous login.
          this.authService.logout();

          this.authService.saveToken(response.data.token);
          this.authService.saveRole(response.data.role);

          if (response.data.customerId != null) {
            this.authService.saveCustomerId(response.data.customerId);
          }

          alert(response.message || 'Google login successful.');
          this.redirectByRole(response.data.role);
        } else {
          alert(response.message || 'Google login failed.');
        }

        this.googleLoading = false;
      },
      error: (error) => {
        console.error('Google login failed:', error);

        alert(
          error.error?.message ||
          'Google login failed. Please try again.'
        );

        this.googleLoading = false;
      }
    });
  }

  onLogin(): void {
    if (!this.email.trim() || !this.password) {
      alert('Please enter email and password.');
      return;
    }

    this.loading = true;

    this.authService.login({
      email: this.email.trim(),
      password: this.password
    }).subscribe({
      next: (response) => {
        if (
          response.success &&
          response.data?.token &&
          response.data?.role
        ) {
          // Clear details from any previous login.
          this.authService.logout();

          this.authService.saveToken(response.data.token);
          this.authService.saveRole(response.data.role);

          if (response.data.customerId != null) {
            this.authService.saveCustomerId(response.data.customerId);
          }

          alert(response.message || 'Login successful.');
          this.redirectByRole(response.data.role);
        } else {
          alert(
            response.message ||
            'Login failed. The server did not return a token and role.'
          );
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Login failed:', error);

        alert(
          error.error?.message ||
          'Invalid email or password.'
        );

        this.loading = false;
      }
    });
  }
}
