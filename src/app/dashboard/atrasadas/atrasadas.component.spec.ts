import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { AtrasadasComponent } from './atrasadas.component';

describe('AtrasadasComponent', () => {
  let component: AtrasadasComponent;
  let fixture: ComponentFixture<AtrasadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AtrasadasComponent],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtrasadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
