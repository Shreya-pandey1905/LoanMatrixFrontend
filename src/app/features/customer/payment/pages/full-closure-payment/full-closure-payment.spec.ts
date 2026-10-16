import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FullClosurePayment } from './full-closure-payment';

describe('FullClosurePayment', () => {
  let component: FullClosurePayment;
  let fixture: ComponentFixture<FullClosurePayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullClosurePayment],
    }).compileComponents();

    fixture = TestBed.createComponent(FullClosurePayment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
