import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { PrincipalNavbarComponent } from './principal-navbar.component';

describe('PrincipalNavbarComponent', () => {
  let component: PrincipalNavbarComponent;
  let fixture: ComponentFixture<PrincipalNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrincipalNavbarComponent],
      providers: [provideHttpClient(), provideRouter([])]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PrincipalNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
