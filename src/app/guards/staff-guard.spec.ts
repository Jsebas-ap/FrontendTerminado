import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { StaffGuard } from './staff-guard';
import { AuthService } from '@app/services/auth.service';

describe('StaffGuard', () => {
  let guard: StaffGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StaffGuard,
        { provide: AuthService, useValue: {} },
        { provide: Router, useValue: {} }
      ]
    });
    guard = TestBed.inject(StaffGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});