import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { EjemplaresComponent } from './ejemplares.component';

describe('EjemplaresComponent', () => {
  let component: EjemplaresComponent;
  let fixture: ComponentFixture<EjemplaresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjemplaresComponent],
      providers: [
        provideHttpClient(),
        { provide: NgbModal, useValue: { open: () => ({ componentInstance: {}, result: Promise.resolve('dismissed') }) } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EjemplaresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
