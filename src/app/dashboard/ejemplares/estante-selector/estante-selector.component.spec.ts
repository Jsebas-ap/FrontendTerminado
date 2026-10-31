import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstanteSelectorComponent } from './estante-selector.component';

describe('EstanteSelectorComponent', () => {
  let component: EstanteSelectorComponent;
  let fixture: ComponentFixture<EstanteSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstanteSelectorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstanteSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});