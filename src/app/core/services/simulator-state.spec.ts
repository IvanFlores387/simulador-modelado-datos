import { TestBed } from '@angular/core/testing';

import { SimulatorState } from './simulator-state';

describe('SimulatorState', () => {
  let service: SimulatorState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimulatorState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
