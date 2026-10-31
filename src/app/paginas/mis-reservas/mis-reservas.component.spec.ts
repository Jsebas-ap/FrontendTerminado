import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { MisReservasComponent } from './mis-reservas.component';

describe('MisReservasComponent', () => {
  let component: MisReservasComponent;
  let fixture: ComponentFixture<MisReservasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisReservasComponent],
      providers: [provideHttpClient(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisReservasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
