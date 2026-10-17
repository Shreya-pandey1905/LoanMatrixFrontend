import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyLoanAccount } from './my-loan-account';

describe('MyLoanAccount', () => {
  let component: MyLoanAccount;
  let fixture: ComponentFixture<MyLoanAccount>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyLoanAccount],
    }).compileComponents();

    fixture = TestBed.createComponent(MyLoanAccount);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
