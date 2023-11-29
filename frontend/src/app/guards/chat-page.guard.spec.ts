import { TestBed } from '@angular/core/testing';
import { CanDeactivateFn } from '@angular/router';

import { chatPageGuard } from './chat-page.guard';

describe('chatPageGuard', () => {
  const executeGuard: CanDeactivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => chatPageGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
