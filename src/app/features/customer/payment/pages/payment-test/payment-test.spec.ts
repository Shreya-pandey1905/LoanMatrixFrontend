import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaymentTest } from './payment-test';

describe('PaymentTest', () => {
  let component: PaymentTest;
  let fixture: ComponentFixture<PaymentTest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentTest],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentTest);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
