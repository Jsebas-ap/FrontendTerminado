import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { LibrosService } from './libros.service';

describe('LibrosService', () => {
  let service: LibrosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(LibrosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
