import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';


import { EjemplaresService } from './ejemplares.service';

describe('EjemplaresService', () => {
  let service: EjemplaresService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(EjemplaresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
