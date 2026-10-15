
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

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

  toggleCustomerManagement(): void {
    this.customerManagementOpen = !this.customerManagementOpen;
  }

  toggleLoanProcessing(): void {
    this.loanProcessingOpen = !this.loanProcessingOpen;
  }

  toggleClosureRequests(): void {
    this.closureRequestsOpen = !this.closureRequestsOpen;
  }
}
