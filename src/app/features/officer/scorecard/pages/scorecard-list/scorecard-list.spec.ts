import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScorecardList } from './scorecard-list';

describe('ScorecardList', () => {
  let component: ScorecardList;
  let fixture: ComponentFixture<ScorecardList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScorecardList],
    }).compileComponents();

    fixture = TestBed.createComponent(ScorecardList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
