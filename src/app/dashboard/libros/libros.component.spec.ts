import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { LibrosComponent } from './libros.component';
import { LibrosService } from '@app/services/libros.service';

describe('LibrosComponent', () => {
  let component: LibrosComponent;
  let fixture: ComponentFixture<LibrosComponent>;
  let librosService: jasmine.SpyObj<LibrosService>;

  beforeEach(async () => {
    const librosServiceSpy = jasmine.createSpyObj('LibrosService', [
      'getLibros',
      'getEditoriales',
      'getGeneros',
      'getLibrosFiltrados',
      'crearLibro',
      'actualizarLibro',
      'eliminarLibro',
      'getLibro'
    ]);

    librosServiceSpy.getLibros.and.returnValue(of([]));
    librosServiceSpy.getEditoriales.and.returnValue(of(['Planeta', 'Alfaguara']));
    librosServiceSpy.getGeneros.and.returnValue(of(['Ficción', 'Historia']));
    librosServiceSpy.getLibrosFiltrados.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [LibrosComponent],
      providers: [
        provideHttpClient(),
        { provide: LibrosService, useValue: librosServiceSpy }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LibrosComponent);
    component = fixture.componentInstance;
    librosService = TestBed.inject(LibrosService) as jasmine.SpyObj<LibrosService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize filter form with default values', () => {
    expect(component.filtroForm).toBeDefined();
    expect(component.filtroForm.value).toEqual({
      titulo: '',
      editorial: '',
      genero: '',
      orden: 'asc'
    });
  });

  it('should load editoriales and generos on init', () => {
    expect(librosService.getEditoriales).toHaveBeenCalled();
    expect(librosService.getGeneros).toHaveBeenCalled();
    expect(component.editoriales).toEqual(['Planeta', 'Alfaguara']);
    expect(component.generos).toEqual(['Ficción', 'Historia']);
  });

  it('should call getLibrosFiltrados when filtrar() is executed', () => {
    component.filtroForm.setValue({
      titulo: 'Cien años',
      editorial: 'Alfaguara',
      genero: 'Ficción',
      orden: 'desc'
    });

    component.filtrar();

    expect(librosService.getLibrosFiltrados).toHaveBeenCalledWith(
      'Cien años',
      'Alfaguara',
      'Ficción',
      'desc'
    );
  });

  it('should reset filter form and reload all books when limpiarFiltros() is called', () => {
    component.filtroForm.setValue({
      titulo: 'Test',
      editorial: 'Planeta',
      genero: 'Historia',
      orden: 'desc'
    });

    component.limpiarFiltros();

    expect(component.filtroForm.value).toEqual({
      titulo: '',
      editorial: '',
      genero: '',
      orden: 'asc'
    });
    expect(librosService.getLibros).toHaveBeenCalled();
  });
});
