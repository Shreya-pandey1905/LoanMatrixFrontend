import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FullClosure } from './full-closure';

describe('FullClosure', () => {
  let component: FullClosure;
  let fixture: ComponentFixture<FullClosure>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullClosure],
    }).compileComponents();

    fixture = TestBed.createComponent(FullClosure);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
