import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth';

@Component({
  selector: 'app-customer-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './customer-sidebar.html',
  styleUrl: './customer-sidebar.css'
})
export class CustomerSidebar {

  loanProcessingOpen = false;
  closureOpen = false;
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

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
