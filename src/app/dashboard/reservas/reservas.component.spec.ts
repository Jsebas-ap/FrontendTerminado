import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { ReservasComponent } from './reservas.component';

describe('ReservasComponent', () => {
  let component: ReservasComponent;
  let fixture: ComponentFixture<ReservasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservasComponent],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
