import { Usuario } from './usuario.model';
import { Ejemplar } from './ejemplar.model';

export interface Reserva {
    id: number;
    user: Usuario;
    ejemplar: Ejemplar;

    fechaReserva: string;
    fechaEstimadaDevolucion: string;
    fechaRealDevolucion: string | null;

    estado: EstadoReserva;
}

export enum EstadoReserva {
    PENDIENTE = 'PENDIENTE',
    ACTIVA = 'ACTIVA',
    CON_RETRASO = 'CON_RETRASO',
    DEVUELTA = 'DEVUELTA'
}
