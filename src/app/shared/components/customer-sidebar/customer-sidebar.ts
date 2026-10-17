import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/auth/services/auth';

@Component({
  selector: 'app-customer-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './customer-sidebar.html',
  styleUrl: './customer-sidebar.css'
})
export class CustomerSidebar implements OnInit, OnDestroy {
  loanProcessingOpen = false;
  closureOpen = false;

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

    if (url.includes('/customer/loan-processing') || url.includes('/customer/disbursement')) {
      this.loanProcessingOpen = true;
    }

    if (url.includes('/customer/closure')) {
      this.closureOpen = true;
    }
  }

  toggleLoanProcessing(): void {
    this.loanProcessingOpen = !this.loanProcessingOpen;
  }

  toggleClosure(): void {
    this.closureOpen = !this.closureOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
