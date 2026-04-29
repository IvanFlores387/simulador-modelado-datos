import { TestBed } from '@angular/core/testing';

import { Narrative } from './narrative';

describe('Narrative', () => {
  let service: Narrative;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Narrative);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
