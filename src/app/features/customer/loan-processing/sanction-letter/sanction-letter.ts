import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SanctionLetterService } from '../../../../core/services/sanction-letter';
import {
  SanctionLetterResponseDto,
  SanctionLetterDetailDto
} from '../../../../core/models/sanction-letter.model';

@Component({
  selector: 'app-customer-sanction-letter',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sanction-letter.html',
  styleUrls: ['./sanction-letter.css']
})
export class CustomerSanctionLetter implements OnInit {
  customerId: number | null = null;
  myLetters: SanctionLetterResponseDto[] = [];
  loading: boolean = false;
  errorMsg: string = '';

  // Document modal
  showDocModal: boolean = false;
  docData: SanctionLetterDetailDto | null = null;
  loadingDoc: boolean = false;
  
  // Track accepted state by dealId
  acceptedMap: { [dealId: number]: boolean } = {};

  constructor(
    private sanctionService: SanctionLetterService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = localStorage.getItem('customerId') || sessionStorage.getItem('customerId');
    if (id) {
      this.customerId = Number(id);
      this.loadAcceptedStatus();
      this.fetchLetters();
    } else {
      this.errorMsg = 'Please log in to view your sanction letters.';
    }
  }

  loadAcceptedStatus(): void {
    const currentAccepted: number[] = JSON.parse(localStorage.getItem('accepted_deals') || '[]');
    this.acceptedMap = {};
    currentAccepted.forEach((id: number) => {
      this.acceptedMap[Number(id)] = true;
    });
  }

  isAccepted(dealId: number): boolean {
    return !!this.acceptedMap[Number(dealId)];
  }

  acceptSanction(dealId: number): void {
    const id = Number(dealId);
    if (this.acceptedMap[id]) return;

    this.acceptedMap[id] = true;

    // Persist to localStorage
    const currentAccepted: number[] = JSON.parse(localStorage.getItem('accepted_deals') || '[]');
    if (!currentAccepted.some(x => Number(x) === id)) {
      currentAccepted.push(id);
      localStorage.setItem('accepted_deals', JSON.stringify(currentAccepted));
    }

    this.cdr.detectChanges();
  }

  fetchLetters(): void {
    if (!this.customerId) return;
    this.loading = true;
    this.cdr.detectChanges();

    this.sanctionService.getLettersByCustomerId(this.customerId).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success && res.data) {
          this.myLetters = res.data;
          this.loadAcceptedStatus(); // Ensure map matches loaded letters
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        console.warn('Customer letters error:', err);
        this.cdr.detectChanges();
      }
    });
  }

  viewLetter(dealId: number): void {
    this.loadingDoc = true;
    this.showDocModal = true;
    this.docData = null;
    this.cdr.detectChanges();

    this.sanctionService.getDocumentByDealId(Number(dealId)).subscribe({
      next: (res) => {
        this.loadingDoc = false;
        if (res.success) {
          this.docData = res.data;
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingDoc = false;
        this.cdr.detectChanges();
      }
    });
  }

  closeDocModal(): void {
    this.showDocModal = false;
    this.docData = null;
  }

  printLetter(): void {
    window.print();
  }
}