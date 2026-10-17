import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { OfficerKyc, KycDocument } from '../../services/officer-kyc';

@Component({
  selector: 'app-kyc-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './kyc-details.html',
  styleUrl: './kyc-details.css'
})
export class KycDetails implements OnInit {

  customerId = 0;
  documents: KycDocument[] = [];
  loading = false;
  errorMessage = '';
  message = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private officerKyc: OfficerKyc,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.customerId = Number(this.route.snapshot.paramMap.get('customerId'));
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.loading = true;
    this.errorMessage = '';

    this.officerKyc.getCustomerDocuments(this.customerId).subscribe({
      next: (response) => {
        this.documents = response.data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Unable to load KYC documents.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  viewDocument(documentId: number): void {
    this.officerKyc.viewDocument(documentId);
  }

  approveDocument(documentId: number): void {
    this.officerKyc.approveDocument(documentId).subscribe({
      next: () => {
        this.message = 'Document approved successfully.';
        this.loadDocuments();
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Unable to approve document.';
      }
    });
  }

  rejectDocument(documentId: number): void {
    this.officerKyc.rejectDocument(documentId).subscribe({
      next: () => {
        this.message = 'Document rejected successfully.';
        this.loadDocuments();
      },
      error: (error) => {
        console.error(error);
        this.errorMessage = 'Unable to reject document.';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/officer/kyc-verification']);
  }
}
