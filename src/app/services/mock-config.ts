/**
 * Configuración central para alternar entre Datos Mock (JSONs basados en bd_v2.sql)
 * y la Base de Datos / Backend Real.
 *
 * - `true`: Utiliza los datos mock en memoria basados en bd_v2.sql sin tocar componentes.
 * - `false`: Realiza las llamadas HTTP reales al servidor backend (https://api.utpbiblio.dpdns.org).
 */
export const USE_MOCK_DATA = true;
