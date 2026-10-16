
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/services/auth';

@Component({
  selector: 'app-officer-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './officer-sidebar.html',
  styleUrl: './officer-sidebar.css'
})
export class OfficerSidebar {
  customerManagementOpen = true;
  loanProcessingOpen = false;
  closureRequestsOpen = false;


   constructor(
    private authService: AuthService,
    private router: Router
  ) {}
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
