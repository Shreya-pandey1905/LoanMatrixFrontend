import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PartialClosure } from './partial-closure';

describe('PartialClosure', () => {
  let component: PartialClosure;
  let fixture: ComponentFixture<PartialClosure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartialClosure],
    }).compileComponents();

    fixture = TestBed.createComponent(PartialClosure);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
