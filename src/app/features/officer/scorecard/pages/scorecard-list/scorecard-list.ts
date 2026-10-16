
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  ScorecardService,
  ScoreCard
} from '../../services/scorecard';

@Component({
  selector: 'app-scorecard-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scorecard-list.html',
  styleUrl: './scorecard-list.css'
})
export class ScorecardList implements OnInit {

  customers: ScoreCard[] = [];
  loading = true;
  errorMessage = '';
  currentPage = 0;
  totalPages = 0;

  constructor(
    private scorecardService: ScorecardService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.scorecardService.getCustomers(this.currentPage).subscribe({
      next: (response) => {
        this.customers = response.data?.content ?? [];
        this.totalPages = response.data?.totalPages ?? 0;
        this.loading = false;

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load scorecard customers:', error);

        this.customers = [];
        this.errorMessage = 'Unable to load customers. Please try again.';
        this.loading = false;

        this.cdr.detectChanges();
      }
    });
  }

  viewScoreCard(customerId: number): void {
    this.router.navigate(['/officer/scorecard', customerId]);
  }

  previousPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadCustomers();
    }
  }

  nextPage(): void {
    if (this.currentPage + 1 < this.totalPages) {
      this.currentPage++;
      this.loadCustomers();
    }
  }
}
