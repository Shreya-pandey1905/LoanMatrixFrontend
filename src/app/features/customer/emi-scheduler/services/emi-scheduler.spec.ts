import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { EmiSchedulerService } from './emi-scheduler';

describe('EmiSchedulerService', () => {
  let service: EmiSchedulerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EmiSchedulerService,
        provideHttpClient()
      ]
    });
    service = TestBed.inject(EmiSchedulerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
