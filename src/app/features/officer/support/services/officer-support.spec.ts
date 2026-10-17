import { TestBed } from '@angular/core/testing';
import { OfficerSupport } from './officer-support';

describe('OfficerSupport', () => {
  let service: OfficerSupport;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfficerSupport);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
