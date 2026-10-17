import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScorecardDetails } from './scorecard-details';

describe('ScorecardDetails', () => {
  let component: ScorecardDetails;
  let fixture: ComponentFixture<ScorecardDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScorecardDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(ScorecardDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
