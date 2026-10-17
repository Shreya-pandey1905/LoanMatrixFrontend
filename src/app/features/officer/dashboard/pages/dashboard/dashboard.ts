
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthService } from '../../../../../core/auth/services/auth';

import {
  OfficerDashboardService,
  OfficerDashboardData
} from '../../services/officer-dashboard';

@Component({
  selector: 'app-officer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  private readonly dashboardService: OfficerDashboardService =
    inject(OfficerDashboardService);

  private readonly authService: AuthService =
    inject(AuthService);

  private readonly router: Router =
    inject(Router);

  private readonly cdr: ChangeDetectorRef =
    inject(ChangeDetectorRef);

  dashboard: OfficerDashboardData | null = null;

  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;
    this.errorMessage = '';

    this.dashboardService.getDashboard().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.dashboard = response.data;
        } else {
          this.dashboard = null;
          this.errorMessage =
            response.message ||
            'Unable to load officer dashboard.';
        }

        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error: any) => {
        console.error(
          'Officer dashboard API error:',
          error
        );

        this.dashboard = null;
        this.loading = false;

        this.errorMessage =
          error.status === 0
            ? 'Cannot connect to the backend. Check that Spring Boot is running.'
            : error.error?.message ||
              'Failed to load officer dashboard.';

        this.cdr.detectChanges();
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
