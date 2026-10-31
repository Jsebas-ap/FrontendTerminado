import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { HistorialComponent } from './historial.component';

describe('HistorialComponent', () => {
  let component: HistorialComponent;
  let fixture: ComponentFixture<HistorialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialComponent],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
