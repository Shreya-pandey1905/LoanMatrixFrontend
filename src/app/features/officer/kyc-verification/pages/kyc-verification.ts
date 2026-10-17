import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OfficerKyc, PendingKycCustomer } from '../services/officer-kyc';

@Component({
  selector: 'app-kyc-verification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kyc-verification.html',
  styleUrl: './kyc-verification.css'
})
export class KycVerification implements OnInit {

  customers: PendingKycCustomer[] = [];
  loading = false;
  errorMessage = '';

 constructor(
  private officerKyc: OfficerKyc,
  private router: Router,
  private cdr: ChangeDetectorRef
) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

loadCustomers(): void {
  this.loading = true;
  this.errorMessage = '';

  this.officerKyc.getPendingCustomers().subscribe({
   next: (response) => {
  this.customers = response.data;
  this.loading = false;

  console.log('Customers:', this.customers);
  console.log('Loading:', this.loading);

  this.cdr.detectChanges();
},
    error: (error) => {
      console.error('KYC API error:', error);
      this.errorMessage = 'Unable to load customers. Please try again.';
      this.loading = false;
    }
  });
}

  viewKyc(customer: PendingKycCustomer): void {
    this.router.navigate(['/officer/kyc-verification', customer.customerId]);
  }
}
