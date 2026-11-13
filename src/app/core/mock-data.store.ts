import { Injectable } from '@angular/core';
import ubicacionesJson from '@public/mocks/ubicaciones.json';
import rolesJson from '@public/mocks/roles.json';
import librosJson from '@public/mocks/libros.json';
import ejemplaresJson from '@public/mocks/ejemplares.json';
import usuariosJson from '@public/mocks/usuarios.json';
import reservasJson from '@public/mocks/reservas.json';

@Injectable({
  providedIn: 'root'
})
export class MockDataStore {
  private ubicaciones: any[] = JSON.parse(JSON.stringify(ubicacionesJson));
  private roles: any[] = JSON.parse(JSON.stringify(rolesJson));
  private libros: any[] = JSON.parse(JSON.stringify(librosJson));
  private ejemplares: any[] = JSON.parse(JSON.stringify(ejemplaresJson));
  private usuarios: any[] = JSON.parse(JSON.stringify(usuariosJson));
  private reservas: any[] = JSON.parse(JSON.stringify(reservasJson));

  constructor() {
    this.sincronizarRelaciones();
  }

  /**
   * Asegura que los objetos anidados (libro, ejemplares, reservas, usuario) estén
   * sincronizados en memoria.
   */
  private sincronizarRelaciones(): void {
    // Vincular ejemplares a cada libro
    for (const libro of this.libros) {
      libro.ejemplares = this.ejemplares.filter(e => {
        const lid = e.libroId ?? e.libro?.id;
        return lid === libro.id;
      });
    }

    // Asegurar que cada ejemplar tenga su objeto ubicacion y libro
    for (const ejemplar of this.ejemplares) {
      if (!ejemplar.ubicacion && ejemplar.ubicacionId) {
        ejemplar.ubicacion = this.ubicaciones.find(u => u.id === ejemplar.ubicacionId) || null;
      }
      if (!ejemplar.libro && ejemplar.libroId) {
        const lb = this.libros.find(l => l.id === ejemplar.libroId);
        if (lb) {
          ejemplar.libro = { ...lb };
          delete ejemplar.libro.ejemplares;
        }
      }
    }
  }

  // ──────────────────────────────────────────────
  // Libros
  // ──────────────────────────────────────────────

  getLibros(): any[] {
    return JSON.parse(JSON.stringify(this.libros));
  }

  getLibro(id: number): any | null {
    const libro = this.libros.find(l => l.id === id);
    return libro ? JSON.parse(JSON.stringify(libro)) : null;
  }

  getEjemplaresDisponibles(libroId: number): any[] {
    const ejemplares = this.ejemplares.filter(e => {
      const lid = e.libroId ?? e.libro?.id;
      return lid === libroId && e.estado === 'DISPONIBLE';
    });
    return JSON.parse(JSON.stringify(ejemplares));
  }

  buscarLibros(termino: string): any[] {
    const term = (termino || '').toLowerCase().trim();
    const resultados = this.libros.filter(l =>
      (l.titulo && l.titulo.toLowerCase().includes(term)) ||
      (l.autor && l.autor.toLowerCase().includes(term)) ||
      (l.editorial && l.editorial.toLowerCase().includes(term)) ||
      (l.isbn && l.isbn.includes(term))
    );
    return JSON.parse(JSON.stringify(resultados));
  }

  getEditoriales(): string[] {
    const editoriales = Array.from(new Set(this.libros.map(l => l.editorial).filter(Boolean)));
    return editoriales.sort();
  }

  getGeneros(): string[] {
    const generos = Array.from(new Set(this.libros.map(l => l.genero).filter(Boolean)));
    return generos.sort();
  }

  getDetallePorSlug(slug: string): { libro: any; ejemplaresDisponibles: any[] } | null {
    const libro = this.libros.find(l => l.slug === slug);
    if (!libro) return null;

    const disponibles = this.getEjemplaresDisponibles(libro.id);
    return {
      libro: JSON.parse(JSON.stringify(libro)),
      ejemplaresDisponibles: disponibles
    };
  }

  getLibrosFiltrados(titulo: string, editorial: string, genero: string, orden: string): any[] {
    let filtrados = [...this.libros];

    if (titulo) {
      const t = titulo.toLowerCase().trim();
      filtrados = filtrados.filter(l => l.titulo?.toLowerCase().includes(t));
    }
    if (editorial) {
      filtrados = filtrados.filter(l => l.editorial === editorial);
    }
    if (genero) {
      filtrados = filtrados.filter(l => l.genero === genero);
    }

    filtrados.sort((a, b) => {
      const cmp = (a.titulo || '').localeCompare(b.titulo || '');
      return orden === 'desc' ? -cmp : cmp;
    });

    return JSON.parse(JSON.stringify(filtrados));
  }

  crearLibro(libro: any): any {
    const maxId = this.libros.reduce((max, l) => Math.max(max, l.id || 0), 0);
    const slug = (libro.titulo || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const nuevoLibro = {
      ...libro,
      id: maxId + 1,
      slug: slug || `libro-${maxId + 1}`,
      ejemplares: []
    };

    this.libros.push(nuevoLibro);
    return JSON.parse(JSON.stringify(nuevoLibro));
  }

  actualizarLibro(libro: any): any {
    const index = this.libros.findIndex(l => l.id === libro.id);
    if (index !== -1) {
      this.libros[index] = {
        ...this.libros[index],
        ...libro,
        ejemplares: this.libros[index].ejemplares
      };
      this.sincronizarRelaciones();
      return JSON.parse(JSON.stringify(this.libros[index]));
    }
    return libro;
  }

  eliminarLibro(id: number): boolean {
    const index = this.libros.findIndex(l => l.id === id);
    if (index !== -1) {
      this.libros.splice(index, 1);
      // Eliminar ejemplares asociados
      this.ejemplares = this.ejemplares.filter(e => (e.libroId ?? e.libro?.id) !== id);
      return true;
    }
    return false;
  }

  // ──────────────────────────────────────────────
  // Ejemplares y Ubicaciones
  // ──────────────────────────────────────────────

  getEjemplares(): any[] {
    return JSON.parse(JSON.stringify(this.ejemplares));
  }

  getEjemplar(id: number): any | null {
    const ej = this.ejemplares.find(e => e.id === id);
    return ej ? JSON.parse(JSON.stringify(ej)) : null;
  }

  getUbicaciones(): any[] {
    return JSON.parse(JSON.stringify(this.ubicaciones));
  }

  crearEjemplar(payload: any): any {
    const maxId = this.ejemplares.reduce((max, e) => Math.max(max, e.id || 0), 0);
    const libroId = payload.libro?.id ?? payload.libroId;
    const ubicacionId = payload.ubicacion?.id ?? payload.ubicacionId;

    const libro = this.libros.find(l => l.id === libroId);
    const ubicacion = this.ubicaciones.find(u => u.id === ubicacionId) || null;

    const nuevoEjemplar = {
      id: maxId + 1,
      codigoEjemplar: payload.codigoEjemplar,
      estado: payload.estado || 'DISPONIBLE',
      libroId: libroId,
      libro: libro ? { ...libro, ejemplares: undefined } : null,
      ubicacionId: ubicacionId,
      ubicacion: ubicacion
    };

    this.ejemplares.push(nuevoEjemplar);
    this.sincronizarRelaciones();
    return JSON.parse(JSON.stringify(nuevoEjemplar));
  }

  actualizarEjemplar(payload: any): any {
    const index = this.ejemplares.findIndex(e => e.id === payload.id);
    if (index !== -1) {
      const libroId = payload.libro?.id ?? payload.libroId ?? this.ejemplares[index].libroId;
      const ubicacionId = payload.ubicacion?.id ?? payload.ubicacionId ?? this.ejemplares[index].ubicacionId;

      const libro = this.libros.find(l => l.id === libroId);
      const ubicacion = this.ubicaciones.find(u => u.id === ubicacionId) || null;

      this.ejemplares[index] = {
        ...this.ejemplares[index],
        codigoEjemplar: payload.codigoEjemplar,
        estado: payload.estado,
        libroId,
        libro: libro ? { ...libro, ejemplares: undefined } : null,
        ubicacionId,
        ubicacion
      };

      this.sincronizarRelaciones();
      return JSON.parse(JSON.stringify(this.ejemplares[index]));
    }
    return payload;
  }

  eliminarEjemplar(id: number): boolean {
    const index = this.ejemplares.findIndex(e => e.id === id);
    if (index !== -1) {
      this.ejemplares.splice(index, 1);
      this.sincronizarRelaciones();
      return true;
    }
    return false;
  }

  // ──────────────────────────────────────────────
  // Reservas
  // ──────────────────────────────────────────────

  getReservas(): any[] {
    return JSON.parse(JSON.stringify(this.reservas));
  }

  getReservasPendientes(): any[] {
    const pendientes = this.reservas.filter(r => r.estado === 'PENDIENTE' || r.fechaRealDevolucion === null);
    return JSON.parse(JSON.stringify(pendientes));
  }

  getReservasAtrasadas(): any[] {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const atrasadas = this.reservas.filter(r => {
      if (r.estado === 'CON_RETRASO') return true;
      if (r.fechaRealDevolucion !== null) return false;
      if (!r.fechaEstimadaDevolucion) return false;

      const est = new Date(r.fechaEstimadaDevolucion + 'T00:00:00');
      est.setHours(0, 0, 0, 0);
      return est.getTime() < hoy.getTime();
    });

    return JSON.parse(JSON.stringify(atrasadas));
  }

  getReservasRecientes(): any[] {
    const sorted = [...this.reservas].sort((a, b) => {
      const da = new Date(a.fechaReserva).getTime();
      const db = new Date(b.fechaReserva).getTime();
      return db - da;
    });
    return JSON.parse(JSON.stringify(sorted));
  }

  getReservaPendientePorCodigo(codigoEjemplar: string): any | null {
    const cleanCode = (codigoEjemplar || '').trim().toLowerCase();
    const reserva = this.reservas.find(r =>
      (r.estado === 'PENDIENTE' || r.fechaRealDevolucion === null) &&
      r.ejemplar?.codigoEjemplar?.toLowerCase() === cleanCode
    );
    return reserva ? JSON.parse(JSON.stringify(reserva)) : null;
  }

  crearReserva(usuarioId: number, ejemplarId: number, fechaRecojo: string): any {
    const maxId = this.reservas.reduce((max, r) => Math.max(max, r.id || 0), 0);
    const user = this.usuarios.find(u => u.id === usuarioId);
    const ejemplar = this.ejemplares.find(e => e.id === ejemplarId);

    // Calcular fecha estimada de devolución (+14 días)
    const fRecojo = new Date(fechaRecojo + 'T00:00:00');
    const fDevolucion = new Date(fRecojo);
    fDevolucion.setDate(fDevolucion.getDate() + 14);

    const formatYMD = (d: Date) => {
      const y = d.getFullYear();
      const m = (d.getMonth() + 1).toString().padStart(2, '0');
      const day = d.getDate().toString().padStart(2, '0');
      return `${y}-${m}-${day}`;
    };

    const nuevaReserva = {
      id: maxId + 1,
      estado: 'PENDIENTE',
      fechaReserva: fechaRecojo,
      fechaEstimadaDevolucion: formatYMD(fDevolucion),
      fechaRealDevolucion: null,
      user: user ? { ...user, reservas: undefined } : { id: usuarioId },
      ejemplar: ejemplar ? JSON.parse(JSON.stringify(ejemplar)) : { id: ejemplarId }
    };

    this.reservas.unshift(nuevaReserva);

    // Actualizar estado del ejemplar a RESERVADO
    if (ejemplar) {
      ejemplar.estado = 'RESERVADO';
      this.sincronizarRelaciones();
    }

    // Actualizar reservas del usuario
    if (user) {
      user.reservas = user.reservas || [];
      user.reservas.push({
        id: nuevaReserva.id,
        fechaReserva: nuevaReserva.fechaReserva,
        fechaEstimadaDevolucion: nuevaReserva.fechaEstimadaDevolucion,
        fechaRealDevolucion: null,
        estado: 'PENDIENTE',
        ejemplar: {
          id: ejemplar?.id,
          codigoEjemplar: ejemplar?.codigoEjemplar,
          libro: ejemplar?.libro ? { ...ejemplar.libro } : null
        }
      });
    }

    return JSON.parse(JSON.stringify(nuevaReserva));
  }

  actualizarReserva(reserva: any): any {
    const index = this.reservas.findIndex(r => r.id === reserva.id);
    if (index !== -1) {
      const esDevolucion = reserva.fechaRealDevolucion != null && this.reservas[index].fechaRealDevolucion == null;

      this.reservas[index] = {
        ...this.reservas[index],
        ...reserva,
        estado: esDevolucion ? 'DEVUELTO' : (reserva.estado || this.reservas[index].estado)
      };

      // Si fue devuelta, liberar el ejemplar
      if (esDevolucion) {
        const ejemplarId = this.reservas[index].ejemplar?.id;
        const ej = this.ejemplares.find(e => e.id === ejemplarId);
        if (ej) {
          ej.estado = 'DISPONIBLE';
          this.sincronizarRelaciones();
        }
      }

      return JSON.parse(JSON.stringify(this.reservas[index]));
    }
    return reserva;
  }

  // ──────────────────────────────────────────────
  // Usuarios
  // ──────────────────────────────────────────────

  getUsuarios(): any[] {
    return JSON.parse(JSON.stringify(this.usuarios));
  }

  getUsuario(id: number): any | null {
    const user = this.usuarios.find(u => u.id === id);
    return user ? JSON.parse(JSON.stringify(user)) : null;
  }

  buscarUsuarios(termino: string): any[] {
    const term = (termino || '').toLowerCase().trim();
    const resultados = this.usuarios.filter(u =>
      (u.nombres && u.nombres.toLowerCase().includes(term)) ||
      (u.apellidos && u.apellidos.toLowerCase().includes(term)) ||
      (u.username && u.username.toLowerCase().includes(term)) ||
      (u.dni && u.dni.includes(term))
    );
    return JSON.parse(JSON.stringify(resultados));
  }

  activarUsuario(id: number): boolean {
    const user = this.usuarios.find(u => u.id === id);
    if (user) {
      user.enabled = true;
      return true;
    }
    return false;
  }

  desactivarUsuario(id: number): boolean {
    const user = this.usuarios.find(u => u.id === id);
    if (user) {
      user.enabled = false;
      return true;
    }
    return false;
  }

  registrarUsuario(userData: any): any {
    const maxId = this.usuarios.reduce((max, u) => Math.max(max, u.id || 0), 0);
    const nuevoUsuario = {
      id: maxId + 1,
      username: userData.username,
      nombres: userData.nombres,
      apellidos: userData.apellidos,
      dni: userData.dni,
      telefono: userData.telefono,
      direccion: userData.direccion,
      genero: userData.genero,
      fechaNacimiento: userData.fechaNacimiento,
      enabled: true,
      roles: [{ id: 2, name: 'ROLE_USER' }],
      reservas: []
    };

    this.usuarios.push(nuevoUsuario);
    return JSON.parse(JSON.stringify(nuevoUsuario));
  }

  getMockUsersForAuth(): any[] {
    return JSON.parse(JSON.stringify(this.usuarios));
  }
}
