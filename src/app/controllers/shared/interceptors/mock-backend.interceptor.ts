import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { USE_MOCK_DATA } from '../mock-config';
import { MockDataStore } from '../mock-data.store';

/**
 * Interceptor HTTP que captura las peticiones dirigidas a la API del backend
 * y devuelve los datos mock en memoria basados en bd_v2.sql cuando USE_MOCK_DATA es true.
 *
 * Si USE_MOCK_DATA es false, la petición continúa sin alteración hacia el servidor real.
 */
export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  if (!USE_MOCK_DATA) {
    return next(req);
  }

  // Filtrar solo las llamadas hacia la API de backend
  if (!req.url.includes('api.utpbiblio.dpdns.org') && !req.url.startsWith('/api/')) {
    return next(req);
  }

  const store = inject(MockDataStore);
  const url = req.url;
  const method = req.method;

  // Extraer la ruta relativa después de /api/ o /api
  const apiMatch = url.match(/\/api\/(.*)/);
  if (!apiMatch) {
    return next(req);
  }

  // Descartar query params de la ruta base
  const path = apiMatch[1].split('?')[0];
  const segments = path.split('/').filter(Boolean);

  const ok = (body: any) => of(new HttpResponse({ status: 200, body })).pipe(delay(50));
  const notFound = (message = 'Recurso no encontrado') => throwError(() => ({ status: 404, message })).pipe(delay(50));

  // ──────────────────────────────────────────────
  // RUTAS DE LIBROS & DETALLE
  // ──────────────────────────────────────────────

  // GET /api/detalle/:slug
  if (method === 'GET' && segments[0] === 'detalle' && segments[1]) {
    const data = store.getDetallePorSlug(segments[1]);
    return data ? ok(data) : notFound('Libro no encontrado');
  }

  if (segments[0] === 'libros') {
    // GET /api/libros
    if (method === 'GET' && segments.length === 1) {
      return ok(store.getLibros());
    }

    // POST /api/libros
    if (method === 'POST' && segments.length === 1) {
      return ok(store.crearLibro(req.body));
    }

    // GET /api/libros/editoriales
    if (method === 'GET' && segments[1] === 'editoriales') {
      return ok(store.getEditoriales());
    }

    // GET /api/libros/generos
    if (method === 'GET' && segments[1] === 'generos') {
      return ok(store.getGeneros());
    }

    // GET /api/libros/buscar?nombreLibro=...
    if (method === 'GET' && segments[1] === 'buscar') {
      const termino = req.params.get('nombreLibro') || '';
      return ok(store.buscarLibros(termino));
    }

    // GET /api/libros/filtrar?titulo=...&editorial=...&genero=...&orden=...
    if (method === 'GET' && segments[1] === 'filtrar') {
      const titulo = req.params.get('titulo') || '';
      const editorial = req.params.get('editorial') || '';
      const genero = req.params.get('genero') || '';
      const orden = req.params.get('orden') || 'asc';
      return ok(store.getLibrosFiltrados(titulo, editorial, genero, orden));
    }

    // GET /api/libros/:id/ejemplares/disponibles
    if (method === 'GET' && segments.length === 4 && segments[2] === 'ejemplares' && segments[3] === 'disponibles') {
      const libroId = Number(segments[1]);
      return ok(store.getEjemplaresDisponibles(libroId));
    }

    // GET /api/libros/:id
    if (method === 'GET' && segments.length === 2 && !isNaN(Number(segments[1]))) {
      const libro = store.getLibro(Number(segments[1]));
      return libro ? ok(libro) : notFound();
    }

    // PUT /api/libros/:id
    if (method === 'PUT' && segments.length === 2 && !isNaN(Number(segments[1]))) {
      return ok(store.actualizarLibro(req.body));
    }

    // DELETE /api/libros/:id
    if (method === 'DELETE' && segments.length === 2 && !isNaN(Number(segments[1]))) {
      store.eliminarLibro(Number(segments[1]));
      return ok(null);
    }
  }

  // ──────────────────────────────────────────────
  // RUTAS DE EJEMPLARES Y UBICACIONES
  // ──────────────────────────────────────────────

  // GET /api/ubicaciones
  if (method === 'GET' && segments[0] === 'ubicaciones') {
    return ok(store.getUbicaciones());
  }

  if (segments[0] === 'ejemplares') {
    // GET /api/ejemplares
    if (method === 'GET' && segments.length === 1) {
      return ok(store.getEjemplares());
    }

    // POST /api/ejemplares
    if (method === 'POST' && segments.length === 1) {
      return ok(store.crearEjemplar(req.body));
    }

    // GET /api/ejemplares/:id
    if (method === 'GET' && segments.length === 2 && !isNaN(Number(segments[1]))) {
      const ej = store.getEjemplar(Number(segments[1]));
      return ej ? ok(ej) : notFound();
    }

    // PUT /api/ejemplares/:id
    if (method === 'PUT' && segments.length === 2 && !isNaN(Number(segments[1]))) {
      return ok(store.actualizarEjemplar(req.body));
    }

    // DELETE /api/ejemplares/:id
    if (method === 'DELETE' && segments.length === 2 && !isNaN(Number(segments[1]))) {
      store.eliminarEjemplar(Number(segments[1]));
      return ok(null);
    }
  }

  // ──────────────────────────────────────────────
  // RUTAS DE RESERVAS
  // ──────────────────────────────────────────────

  if (segments[0] === 'reservas') {
    // GET /api/reservas
    if (method === 'GET' && segments.length === 1) {
      return ok(store.getReservas());
    }

    // GET /api/reservas/pendientes
    if (method === 'GET' && segments[1] === 'pendientes' && segments.length === 2) {
      return ok(store.getReservasPendientes());
    }

    // GET /api/reservas/atrasadas
    if (method === 'GET' && segments[1] === 'atrasadas') {
      return ok(store.getReservasAtrasadas());
    }

    // GET /api/reservas/recientes
    if (method === 'GET' && segments[1] === 'recientes') {
      return ok(store.getReservasRecientes());
    }

    // GET /api/reservas/pendientes/:codigo
    if (method === 'GET' && segments[1] === 'pendientes' && segments[2]) {
      const res = store.getReservaPendientePorCodigo(segments[2]);
      return res ? ok(res) : notFound('No se encontró reserva para este código');
    }

    // POST /api/reservas/crear
    if (method === 'POST' && segments[1] === 'crear') {
      const usuarioId = Number(req.params.get('usuarioId'));
      const ejemplarId = Number(req.params.get('ejemplarId'));
      const fechaRecojo = req.params.get('fechaRecojo') || '';
      return ok(store.crearReserva(usuarioId, ejemplarId, fechaRecojo));
    }

    // PUT /api/reservas/:id
    if (method === 'PUT' && segments.length === 2 && !isNaN(Number(segments[1]))) {
      return ok(store.actualizarReserva(req.body));
    }
  }

  // ──────────────────────────────────────────────
  // RUTAS DE USUARIOS Y REGISTRO
  // ──────────────────────────────────────────────

  // POST /api/auth/registrar
  if (method === 'POST' && segments[0] === 'auth' && segments[1] === 'registrar') {
    store.registrarUsuario(req.body);
    return of(new HttpResponse({ status: 200, body: 'Registro exitoso' })).pipe(delay(50));
  }

  if (segments[0] === 'usuarios') {
    // GET /api/usuarios
    if (method === 'GET' && segments.length === 1) {
      return ok(store.getUsuarios());
    }

    // GET /api/usuarios/buscar?q=...
    if (method === 'GET' && segments[1] === 'buscar') {
      const q = req.params.get('q') || '';
      return ok(store.buscarUsuarios(q));
    }

    // PUT /api/usuarios/:id/activar
    if (method === 'PUT' && segments[2] === 'activar') {
      store.activarUsuario(Number(segments[1]));
      return ok(null);
    }

    // PUT /api/usuarios/:id/desactivar
    if (method === 'PUT' && segments[2] === 'desactivar') {
      store.desactivarUsuario(Number(segments[1]));
      return ok(null);
    }

    // GET /api/usuarios/:id
    if (method === 'GET' && segments.length === 2 && !isNaN(Number(segments[1]))) {
      const u = store.getUsuario(Number(segments[1]));
      return u ? ok(u) : notFound('Usuario no encontrado');
    }
  }

  return next(req);
};
