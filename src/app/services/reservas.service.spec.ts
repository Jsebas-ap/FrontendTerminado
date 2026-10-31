import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { ReservasService } from './reservas.service';

describe('ReservasService', () => {
  let service: ReservasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(ReservasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
