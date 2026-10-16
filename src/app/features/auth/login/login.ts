
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
    private authService: AuthService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.loadGoogleScript();
  }

  ngOnDestroy(): void {
    // No cleanup required for the Google Identity Services script.
  }

  private loadGoogleScript(): void {
    if (document.getElementById('google-identity-script')) {
      this.initializeGoogle();
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
      google.accounts.id.renderButton(button, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        width: 300
      });
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
        if (response.success && response.data?.token) {
          this.authService.saveToken(response.data.token);

          alert(response.message || 'Google login successful.');

          this.router.navigate(['/customer/dashboard']);
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
        if (response.success && response.data?.token) {
          this.authService.saveToken(response.data.token);

          alert(response.message || 'Login successful.');

          this.router.navigate(['/customer/dashboard']);
        } else {
          alert(response.message || 'Login failed.');
        }

        this.loading = false;
      },
      error: (error) => {
        console.error('Login failed:', error);

        const message =
          error.error?.message || 'Invalid email or password.';

        alert(message);
        this.loading = false;
      }
    });
  }
}
