import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EjemplaresComponent } from './ejemplares.component';

describe('EjemplaresComponent', () => {
  let component: EjemplaresComponent;
  let fixture: ComponentFixture<EjemplaresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EjemplaresComponent]
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
