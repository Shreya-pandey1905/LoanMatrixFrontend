import { TestBed } from '@angular/core/testing';
import { OfficerKyc } from './officer-kyc';

describe('OfficerKyc', () => {
  let service: OfficerKyc;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfficerKyc);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
