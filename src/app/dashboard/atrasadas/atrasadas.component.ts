import { Component, OnInit } from '@angular/core';
import { ReservasService } from '@app/services/reservas.service';
import { CommonModule } from '@angular/common';
import { Reserva } from '@app/models/reserva.model';

@Component({
  selector: 'app-atrasadas',
  imports: [CommonModule],
  templateUrl: './atrasadas.component.html',
  styleUrl: './atrasadas.component.scss'
})
export class AtrasadasComponent implements OnInit {
  reservas: Reserva[] = [];

  constructor(private reservasService: ReservasService) { }

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.reservasService.getReservasAtrasadas().subscribe({
      next: (data) => this.reservas = data,
      error: (err) => console.error('Error al cargar las reservas', err)
    });
  }
}
