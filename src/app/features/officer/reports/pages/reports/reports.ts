
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { finalize, Observable } from 'rxjs';

import {
  ReportsService,
  CibilScoreRangeResponse,
  ScoreCardWiseResponse,
  ProductWiseResponse,
  LoanPortfolioResponse,
  EmiCollectionResponse,
  OverdueReportResponse,
  DisbursementReportResponse,
  PrepaymentReportResponse,
  ApiResponse
} from '../../services/reports-service';

type ReportType =
  | 'cibil'
  | 'scorecard'
  | 'product'
  | 'portfolio'
  | 'emi'
  | 'overdue'
  | 'disbursement'
  | 'prepayment';

type ReportResponse =
  | ApiResponse<CibilScoreRangeResponse[]>
  | ApiResponse<ScoreCardWiseResponse[]>
  | ApiResponse<ProductWiseResponse[]>
  | ApiResponse<LoanPortfolioResponse>
  | ApiResponse<EmiCollectionResponse>
  | ApiResponse<OverdueReportResponse>
  | ApiResponse<DisbursementReportResponse>
  | ApiResponse<PrepaymentReportResponse>;

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css'
})
export class Reports implements OnInit {

  private readonly reportsService = inject(ReportsService);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly reportOptions: {
    key: ReportType;
    label: string;
    description: string;
  }[] = [
    {
      key: 'cibil',
      label: 'CIBIL Score Range',
      description: 'Customers grouped by credit score'
    },
    {
      key: 'scorecard',
      label: 'Score Card Wise',
      description: 'Customer eligibility and scorecard details'
    },
    {
      key: 'product',
      label: 'Product Wise',
      description: 'Loan totals grouped by loan type'
    },
    {
      key: 'portfolio',
      label: 'Loan Portfolio',
      description: 'Overview of loan accounts and balances'
    },
    {
      key: 'emi',
      label: 'EMI Collection',
      description: 'Scheduled, collected and pending EMIs'
    },
    {
      key: 'overdue',
      label: 'Overdue Report',
      description: 'Overdue installments and penalties'
    },
    {
      key: 'disbursement',
      label: 'Disbursement',
      description: 'Loan disbursement totals'
    },
    {
      key: 'prepayment',
      label: 'Prepayment',
      description: 'Loans paid before their scheduled end'
    }
  ];

  selectedReport: ReportType | null = null;

  loading = false;
  errorMessage = '';
  successMessage = '';

  cibilData: CibilScoreRangeResponse[] = [];
  scoreCardData: ScoreCardWiseResponse[] = [];
  productData: ProductWiseResponse[] = [];

  portfolioData: LoanPortfolioResponse | null = null;
  emiData: EmiCollectionResponse | null = null;
  overdueData: OverdueReportResponse | null = null;
  disbursementData: DisbursementReportResponse | null = null;
  prepaymentData: PrepaymentReportResponse | null = null;

  private requestId = 0;

  ngOnInit(): void {
    // Load the default report when the Reports page opens.
    this.selectReport('cibil');
  }

  get selectedReportLabel(): string {
    const selected = this.reportOptions.find(
      report => report.key === this.selectedReport
    );

    return selected?.label ?? 'Select a report';
  }

  selectReport(report: ReportType): void {
    this.selectedReport = report;
    this.loadReport(report);
  }

  private loadReport(report: ReportType): void {
    const currentRequestId = ++this.requestId;

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    console.log('Loading report:', report);

    let request: Observable<ReportResponse>;

    switch (report) {
      case 'cibil':
        request = this.reportsService.getCibilScoreRange();
        break;

      case 'scorecard':
        request = this.reportsService.getScoreCardWise();
        break;

      case 'product':
        request = this.reportsService.getProductWise();
        break;

      case 'portfolio':
        request = this.reportsService.getLoanPortfolio();
        break;

      case 'emi':
        request = this.reportsService.getEmiCollection();
        break;

      case 'overdue':
        request = this.reportsService.getOverdue();
        break;

      case 'disbursement':
        request = this.reportsService.getDisbursement();
        break;

      case 'prepayment':
        request = this.reportsService.getPrepayment();
        break;
    }

    request.pipe(
     finalize(() => {
  if (currentRequestId === this.requestId) {
    this.loading = false;
    console.log('Loading finished:', report);
    this.cdr.detectChanges();
  }
})
    ).subscribe({
      next: (response: ReportResponse) => {
        if (currentRequestId !== this.requestId) {
          return;
        }

        console.log(`${report} API response:`, response);

        if (!response || response.success !== true) {
          this.errorMessage =
            response?.message || 'Unable to load this report.';
          return;
        }

        switch (report) {
          case 'cibil':
            this.cibilData =
              response.data as CibilScoreRangeResponse[];
            break;

          case 'scorecard':
            this.scoreCardData =
              response.data as ScoreCardWiseResponse[];
            break;

          case 'product':
            this.productData =
              response.data as ProductWiseResponse[];
            break;

          case 'portfolio':
            this.portfolioData =
              response.data as LoanPortfolioResponse;
            break;

          case 'emi':
            this.emiData =
              response.data as EmiCollectionResponse;
            break;

          case 'overdue':
            this.overdueData =
              response.data as OverdueReportResponse;
            break;

          case 'disbursement':
            this.disbursementData =
              response.data as DisbursementReportResponse;
            break;

          case 'prepayment':
            this.prepaymentData =
              response.data as PrepaymentReportResponse;
            break;
        }

        this.successMessage =
          response.message || 'Report loaded successfully.';
          this.cdr.detectChanges();
      },

      error: (error: {
        status: number;
        error?: { message?: string };
        message?: string;
      }) => {
        if (currentRequestId !== this.requestId) {
          return;
        }

        console.error(`${report} report API error:`, error);

        this.errorMessage =
          error.status === 0
            ? 'Cannot connect to the backend. Check that Spring Boot is running.'
            : error.error?.message ||
              error.message ||
              `Failed to load the ${report} report.`;


this.cdr.detectChanges();
      }
    });
  }
}
