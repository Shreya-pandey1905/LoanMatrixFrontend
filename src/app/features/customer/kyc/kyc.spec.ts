import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { Kyc } from './pages/kyc';
import { KycService } from './services/kycService';

describe('Kyc', () => {
  let component: Kyc;
  let fixture: ComponentFixture<Kyc>;

  const mockKycService = {
    getDocuments: () => of({ data: [] }),
    uploadDocument: () => of({ success: true }),
    viewDocument: () => ''
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Kyc],
      providers: [
        provideHttpClient(),
        { provide: KycService, useValue: mockKycService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Kyc);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
