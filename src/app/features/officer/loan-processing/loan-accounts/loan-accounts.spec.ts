import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoanAccounts } from './loan-accounts';

describe('LoanAccounts', () => {
  let component: LoanAccounts;
  let fixture: ComponentFixture<LoanAccounts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoanAccounts],
    }).compileComponents();

    fixture = TestBed.createComponent(LoanAccounts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
