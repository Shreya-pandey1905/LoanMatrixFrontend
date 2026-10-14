import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

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

  toggleLoanProcessing(): void {
    this.loanProcessingOpen = !this.loanProcessingOpen;
  }

  toggleClosure(): void {
    this.closureOpen = !this.closureOpen;
  }

  logout(): void {
  // TODO: Connect to your authentication logout flow.
  console.log('Customer logout clicked');
}
}
