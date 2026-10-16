
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  ScorecardService,
  ScoreCard
} from '../../services/scorecard';

@Component({
  selector: 'app-scorecard-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './scorecard-details.html',
  styleUrl: './scorecard-details.css'
})
export class ScorecardDetails implements OnInit {

  scoreCard: ScoreCard | null = null;
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private scorecardService: ScorecardService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const customerId = Number(
      this.route.snapshot.paramMap.get('customerId')
    );

    if (!customerId || Number.isNaN(customerId)) {
      this.loading = false;
      this.errorMessage = 'Invalid customer ID.';
      return;
    }

    this.loadScoreCard(customerId);
  }

  loadScoreCard(customerId: number): void {
    this.loading = true;
    this.errorMessage = '';
    this.scoreCard = null;

    this.scorecardService.getScoreCard(customerId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.scoreCard = response.data;
        } else {
          this.errorMessage =
            response.message || 'Scorecard not found.';
        }

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to load scorecard:', error);

        this.errorMessage =
          error.status === 404
            ? 'Scorecard not found for this customer.'
            : 'Unable to load scorecard. Please try again.';

        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/officer/scorecard']);
  }
}
