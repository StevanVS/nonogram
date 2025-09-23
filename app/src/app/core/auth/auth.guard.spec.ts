import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { isAuth } from './auth.guard';

describe('isAuth', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => isAuth(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
