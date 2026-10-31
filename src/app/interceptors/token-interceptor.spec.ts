import { TestBed } from '@angular/core/testing';

import { TokenInterceptor } from './token-interceptor';
import { AuthService } from '@app/services/auth.service';

describe('TokenInterceptor', () => {
  let interceptor: TokenInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TokenInterceptor,
        { provide: AuthService, useValue: { getToken: () => null } }
      ]
    });
    interceptor = TestBed.inject(TokenInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
