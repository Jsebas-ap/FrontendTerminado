import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LibrosService } from '@app/services/libros.service';
import { AuthService } from '@app/services/auth.service';
declare var bootstrap: any;

@Component({
  selector: 'app-libros',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './libros.component.html',
  styleUrl: './libros.component.scss'
})
export class LibrosComponent implements OnInit {
  libros: any[] = [];
  editoriales: string[] = [];
  generos: string[] = [];
  filtroForm!: FormGroup;

  libroEditando: any = null;
  libro = {
    titulo: '',
    autor: '',
    isbn: '',
    editorial: '',
    genero: '',
    fechaPublicacion: '',
    descripcion: '',
    imagenUrl: ''
  };
  submittedEdit = false;

  constructor(
    private fb: FormBuilder,
    private librosService: LibrosService,
    public authService: AuthService
  ) { }

  ngOnInit(): void {
    this.filtroForm = this.fb.group({
      titulo: [''],
      editorial: [''],
      genero: [''],
      orden: ['asc']
    });

    this.cargarFiltros();
    this.cargarLibros();
  }

  cargarFiltros(): void {
    this.librosService.getEditoriales().subscribe({
      next: (data) => this.editoriales = data,
      error: (err) => console.error('Error cargando editoriales', err)
    });

    this.librosService.getGeneros().subscribe({
      next: (data) => this.generos = data,
      error: (err) => console.error('Error cargando géneros', err)
    });
  }

  cargarLibros(): void {
    this.librosService.getLibros().subscribe({
      next: (data) => this.libros = data,
      error: (err) => console.error('Error al cargar libros', err)
    });
  }

  filtrar(): void {
    const { titulo, editorial, genero, orden } = this.filtroForm.value;

    this.librosService.getLibrosFiltrados(titulo, editorial, genero, orden).subscribe({
      next: (data) => this.libros = data,
      error: (err) => console.error('Error al filtrar libros', err)
    });
  }

  limpiarFiltros(): void {
    this.filtroForm.reset({
      titulo: '',
      editorial: '',
      genero: '',
      orden: 'asc'
    });
    this.cargarLibros();
  }

  buscarLibros(): void {
    this.filtrar();
  }

  recargarDatos(): void {
    const { titulo, editorial, genero, orden } = this.filtroForm?.value || {};
    if (titulo || editorial || genero || (orden && orden !== 'asc')) {
      this.filtrar();
    } else {
      this.cargarLibros();
    }
    this.cargarFiltros();
  }

  guardarLibro(): void {
    this.librosService.crearLibro(this.libro).subscribe({
      next: () => {
        this.recargarDatos();
        this.resetFormulario();
        const modalElement = document.getElementById('agregarLibro');
        if (modalElement) {
          const modal = bootstrap.Modal.getInstance(modalElement);
          modal?.hide();
        }
      },
      error: (err) => console.error('Error al guardar libro', err)
    });
  }

  resetFormulario(): void {
    this.libro = {
      titulo: '',
      autor: '',
      isbn: '',
      editorial: '',
      genero: '',
      fechaPublicacion: '',
      descripcion: '',
      imagenUrl: ''
    };
  }

  confirmarEliminacion(libroId: number, titulo: string): void {
    if (confirm(`¿Está seguro de que desea eliminar el libro "${titulo}"?`)) {
      this.eliminarLibro(libroId);
    }
  }

  eliminarLibro(id: number): void {
    this.librosService.eliminarLibro(id).subscribe({
      next: () => {
        this.recargarDatos();
      },
      error: (err) => {
        console.error('Error al eliminar libro', err);
        alert('No se pudo eliminar el libro');
      }
    });
  }

  abrirModalEditar(libroId: number): void {
    this.submittedEdit = false; // Resetear estado de envío
    this.librosService.getLibro(libroId).subscribe({
      next: (libro) => {
        this.libroEditando = { ...libro };
        // Convertir fecha al formato correcto para el input date
        if (this.libroEditando.fechaPublicacion) {
          this.libroEditando.fechaPublicacion = this.libroEditando.fechaPublicacion.split('T')[0];
        }
        setTimeout(() => {
          const modalElement = document.getElementById(`modalEditar__${libroId}`);
          if (modalElement) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
          }
        });
      },
      error: (err) => console.error('Error al cargar libro', err)
    });
  }

  actualizarLibro(formEditar: NgForm): void {
    this.submittedEdit = true;

    if (formEditar.invalid) {
      return;
    }

    if (!this.libroEditando) return;

    this.librosService.actualizarLibro(this.libroEditando).subscribe({
      next: () => {
        this.recargarDatos();
        this.cerrarModalEditar(this.libroEditando.id);
        this.submittedEdit = false;
      },
      error: (err) => {
        console.error('Error al actualizar libro', err);
        this.submittedEdit = false;
      }
    });
  }

  cerrarModalEditar(libroId: number): void {
    const modalElement = document.getElementById(`modalEditar__${libroId}`);
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
    this.libroEditando = null;
  }

}
