import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartialClosurePayment } from './partial-closure-payment';

describe('PartialClosurePayment', () => {
  let component: PartialClosurePayment;
  let fixture: ComponentFixture<PartialClosurePayment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartialClosurePayment],
    }).compileComponents();

    fixture = TestBed.createComponent(PartialClosurePayment);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
