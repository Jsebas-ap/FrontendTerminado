import { Component, OnInit } from '@angular/core';
import { ReservasService } from '../../../services/reservas.service';
import { CommonModule } from '@angular/common';
import { Reserva } from '../../../models/reserva.model';

@Component({
  selector: 'app-atrasadas',
  imports: [CommonModule],
  templateUrl: './atrasadas.html',
  styleUrl: './atrasadas.scss'
})
export class Atrasadas implements OnInit {
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
