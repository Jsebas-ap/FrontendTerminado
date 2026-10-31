import { Component, OnInit } from '@angular/core';
import { ReservasService } from '@app/services/reservas.service';
import { AuthService } from '@app/services/auth.service';
import { CommonModule } from '@angular/common';
import { Reserva } from '@app/models/reserva.model';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-reservas',
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.component.html',
  styleUrl: './reservas.component.scss'
})
export class ReservasComponent implements OnInit {
  reservas: Reserva[] = [];
  codigo: string = '';
  constructor(private reservasService: ReservasService, public authService: AuthService) { }

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.reservasService.getReservasPendientes().subscribe({
      next: (data) => this.reservas = data,
      error: (err) => console.error('Error al cargar las reservas', err)
    });
  }

  buscarReserva(): void {
    if (this.codigo.trim()) {
      this.reservasService.getReservaPendientePorCodigo(this.codigo).subscribe({
        next: (data) => this.reservas = [data],
        error: (err) => {
          console.error('Error al buscar reserva', err);
          this.reservas = [];
        }
      });
    } else {
      this.cargarReservas();
    }
  }

  registrarDevolucion(reserva: Reserva): void {
    const confirmacion = confirm(`¿Deseas registrar la devolución del ejemplar de ${reserva.ejemplar.libro?.titulo} con código ${reserva.ejemplar.codigoEjemplar}?`);
    if (confirmacion) {
      const reservaActualizada: Reserva = {
        ...reserva,
        fechaRealDevolucion: new Date().toISOString()
      };

      this.reservasService.actualizarReserva(reservaActualizada).subscribe({
        next: () => {
          alert('Devolución registrada exitosamente');
          this.cargarReservas();
        },
        error: (err) => {
          console.error('Error al registrar la devolución', err);
        }
      });
    }
  }

}
