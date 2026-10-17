import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { EmiScheduler } from './pages/emi-scheduler';
import { EmiSchedulerService } from './services/emi-scheduler';
import { AuthService } from '../../../core/auth/services/auth';

describe('EmiScheduler', () => {
  let component: EmiScheduler;
  let fixture: ComponentFixture<EmiScheduler>;

  const mockEmiService = {
    getLoanAccounts: () => of({ data: [] }),
    getEmiSchedule: () => of([])
  };

  const mockAuthService = {
    getCustomerId: () => 1
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmiScheduler],
      providers: [
        provideHttpClient(),
        { provide: EmiSchedulerService, useValue: mockEmiService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmiScheduler);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
