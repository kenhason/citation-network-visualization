import { TestBed, inject } from '@angular/core/testing';

import { StylingService } from './styling.service';

describe('StylingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StylingService]
    });
  });

  it('should ...', inject([StylingService], (service: StylingService) => {
    expect(service).toBeTruthy();
  }));
});
