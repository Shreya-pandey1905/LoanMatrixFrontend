
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { KycService } from '../services/kycService';


interface KycDocument {
  id: number;
  documentType: string;
  verificationStatus: string;
}

@Component({
  selector: 'app-kyc',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule
  ],
  templateUrl: './kyc.html',
  styleUrl: './kyc.css'
})
export class Kyc implements OnInit {

  customerId = 1;

  documentType = 'PAN Card';
  selectedFile: File | null = null;

  documentTypes = ['Aadhaar Card', 'PAN Card', 'Salary Slip'];

  displayedColumns = ['name', 'view', 'status'];

  documents: KycDocument[] = [];

  constructor(private kycService: KycService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.kycService.getDocuments(this.customerId).subscribe({
      next: (response) => {
        this.documents = response.data;
      },
      error: (error) => {
        console.error('Failed to load KYC documents', error);
        alert('Could not load documents. Check the backend.');
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile = input.files?.[0] ?? null;
  }
isUploading = false;
uploadDocument(): void {
  if (!this.selectedFile) {
    alert('Please select a file first.');
    return;
  }

  if (this.isUploading) {
    return;
  }

  this.isUploading = true;

  this.kycService.uploadDocument(
    this.customerId,
    this.documentType,
    this.selectedFile
  ).subscribe({
    next: (response) => {
      this.isUploading = false;
      alert('Document uploaded successfully.');
      this.selectedFile = null;
      this.loadDocuments();
    },
    error: (error) => {
      this.isUploading = false;
      console.error('Upload failed', error);
      alert('Document upload failed.');
    }
  });
}

  viewDocument(document: KycDocument): void {
    window.open(
      this.kycService.viewDocument(document.id),
      '_blank'
    );
  }
}
