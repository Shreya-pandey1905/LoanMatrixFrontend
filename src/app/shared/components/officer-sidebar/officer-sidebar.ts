import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/auth/services/auth';

@Component({
  selector: 'app-officer-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './officer-sidebar.html',
  styleUrl: './officer-sidebar.css'
})
export class OfficerSidebar implements OnInit, OnDestroy {
  customerManagementOpen = true;
  loanProcessingOpen = false;
  closureRequestsOpen = false;

  private routerSub?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.syncAccordionsWithUrl(this.router.url);

    this.routerSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.syncAccordionsWithUrl(event.urlAfterRedirects || event.url);
      });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  private syncAccordionsWithUrl(url: string): void {
    if (!url) return;

    if (
      url.includes('/officer/loan-applications') ||
      url.includes('/officer/sanction-letters') ||
      url.includes('/officer/loan-processing') ||
      url.includes('/officer/loan-accounts') ||
      url.includes('/officer/disbursement')
    ) {
      this.loanProcessingOpen = true;
    }

    if (
      url.includes('/officer/full-closure') ||
      url.includes('/officer/partial-closure') ||
      url.includes('/officer/closure')
    ) {
      this.closureRequestsOpen = true;
    }

    if (
      url.includes('/officer/kyc') ||
      url.includes('/officer/eligibility') ||
      url.includes('/officer/scorecard')
    ) {
      this.customerManagementOpen = true;
    }
  }

  toggleCustomerManagement(): void {
    this.customerManagementOpen = !this.customerManagementOpen;
  }

  toggleLoanProcessing(): void {
    this.loanProcessingOpen = !this.loanProcessingOpen;
  }

  toggleClosureRequests(): void {
    this.closureRequestsOpen = !this.closureRequestsOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
