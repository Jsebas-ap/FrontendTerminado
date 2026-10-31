/**
 * Verificador de integridad de los datos mock (public/mocks/*.json).
 *
 * Uso:  node scripts/verify-mock-data.mjs
 *
 * Comprueba:
 *  1. IDs únicos en cada colección.
 *  2. Integridad referencial (ejemplar→libro/ubicación, reserva→ejemplar/usuario, usuario→rol).
 *  3. Coherencia reserva activa ↔ estado del ejemplar (RESERVADO/PRESTADO).
 *  4. Que las reservas anidadas de cada usuario coincidan con reservas.json.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const mocksDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'mocks');
const load = (name) => JSON.parse(readFileSync(join(mocksDir, name), 'utf8'));

const libros = load('libros.json');
const ejemplares = load('ejemplares.json');
const reservas = load('reservas.json');
const usuarios = load('usuarios.json');
const ubicaciones = load('ubicaciones.json');
const roles = load('roles.json');

const errors = [];
const idsOf = (arr) => new Set(arr.map((x) => x.id));

// 1. IDs únicos
for (const [name, arr] of Object.entries({ libros, ejemplares, reservas, usuarios, ubicaciones, roles })) {
  const seen = new Set();
  for (const item of arr) {
    if (seen.has(item.id)) errors.push(`ID duplicado en ${name}: ${item.id}`);
    seen.add(item.id);
  }
}

// 2. Integridad referencial
const libroIds = idsOf(libros);
const ubicacionIds = idsOf(ubicaciones);
const usuarioIds = idsOf(usuarios);
const ejemplarIds = idsOf(ejemplares);
const roleIds = idsOf(roles);

for (const e of ejemplares) {
  if (!libroIds.has(e.libroId)) errors.push(`Ejemplar ${e.id}: libroId ${e.libroId} no existe`);
  if (!ubicacionIds.has(e.ubicacionId)) errors.push(`Ejemplar ${e.id}: ubicacionId ${e.ubicacionId} no existe`);
}
for (const r of reservas) {
  if (!ejemplarIds.has(r.ejemplar?.id)) errors.push(`Reserva ${r.id}: ejemplar ${r.ejemplar?.id} no existe`);
  if (!usuarioIds.has(r.user?.id)) errors.push(`Reserva ${r.id}: usuario ${r.user?.id} no existe`);
}
for (const u of usuarios) {
  for (const rol of u.roles || []) {
    if (!roleIds.has(rol.id)) errors.push(`Usuario ${u.id}: rol ${rol.id} no existe`);
  }
}

// 3. Coherencia reserva activa ↔ estado del ejemplar
const activas = reservas.filter((r) => r.fechaRealDevolucion === null);
for (const r of activas) {
  const e = ejemplares.find((x) => x.id === r.ejemplar.id);
  if (!['RESERVADO', 'PRESTADO'].includes(e.estado)) {
    errors.push(`Reserva activa ${r.id} pero ejemplar ${e.id} está ${e.estado}`);
  }
}
for (const e of ejemplares) {
  if (['DISPONIBLE', 'EN_REPARACION'].includes(e.estado)) {
    const act = activas.find((r) => r.ejemplar.id === e.id);
    if (act) errors.push(`Ejemplar ${e.id} está ${e.estado} pero tiene reserva activa ${act.id}`);
  }
}

// 4. Reservas anidadas de usuarios ↔ reservas.json
for (const u of usuarios) {
  const propias = reservas.filter((r) => r.user.id === u.id).map((r) => r.id).sort((a, b) => a - b);
  const anidadas = (u.reservas || []).map((r) => r.id).sort((a, b) => a - b);
  if (JSON.stringify(propias) !== JSON.stringify(anidadas)) {
    errors.push(`Usuario ${u.id} (${u.username}): reservas anidadas [${anidadas}] != reales [${propias}]`);
  }
}

if (errors.length > 0) {
  console.error(`✗ SE ENCONTRARON ${errors.length} ERROR(ES):`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

const hoy = new Date().toISOString().slice(0, 10);
const atrasadas = activas.filter((r) => r.fechaEstimadaDevolucion < hoy).length;
const porEstado = {};
for (const e of ejemplares) porEstado[e.estado] = (porEstado[e.estado] || 0) + 1;

console.log('✓ Datos mock consistentes:');
console.log(`  ${libros.length} libros · ${ejemplares.length} ejemplares · ${reservas.length} reservas · ${usuarios.length} usuarios · ${ubicaciones.length} ubicaciones · ${roles.length} roles`);
console.log(`  Reservas: ${activas.length} activas (${atrasadas} atrasadas) · ${reservas.length - activas.length} devueltas`);
console.log(`  Ejemplares por estado: ${Object.entries(porEstado).map(([k, v]) => `${k}=${v}`).join(', ')}`);
