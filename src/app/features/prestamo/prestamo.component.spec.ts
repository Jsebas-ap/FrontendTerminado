import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { PrestamoComponent } from './prestamo.component';
import { AuthService } from '@app/services/auth.service';

describe('PrestamoComponent', () => {
  let component: PrestamoComponent;
  let fixture: ComponentFixture<PrestamoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrestamoComponent],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        { provide: AuthService, useValue: { user$: of({ id: 1, nombres: 'Usuario', apellidos: 'De Prueba', username: 'test@test.com' }) } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrestamoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
