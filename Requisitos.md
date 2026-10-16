# Requisitos Funcionales (RF)

## Macroproceso 1: Gestión de Recursos Bibliográficos

### Proceso: Catalogación de libros
- **RF01:** El sistema debe permitir registrar nuevos títulos en el catálogo con su información bibliográfica.
- **RF02:** El sistema debe permitir actualizar la información de un título existente.
- **RF03:** El sistema debe permitir dar de baja un título del catálogo.
- **RF04:** El sistema debe permitir consultar y buscar títulos del catálogo por criterios como título, autor o género.

### Proceso: Control de ejemplares
- **RF05:** El sistema debe permitir registrar un nuevo ejemplar asociado a un título ya catalogado.
- **RF06:** El sistema debe permitir generar un código único para cada ejemplar.
- **RF07:** El sistema debe permitir actualizar y dar de baja ejemplares existentes.
- **RF08:** El sistema debe permitir asignar una ubicación a los ejemplares.
- **RF09:** El sistema debe permitir generar la etiqueta física para el ejemplar.
- **RF10:** El sistema debe permitir consultar la información por cada ejemplar.
- **RF11:** El sistema debe permitir consultar ejemplares por libro en el catálogo.

---

## Macroproceso 2: Circulación de Materiales

### Proceso: Reserva
- **RF12:** El sistema debe permitir visualizar la lista completa de libros catalogados.
- **RF13:** El sistema debe permitir diferenciar ejemplares disponibles y no disponibles.
- **RF14:** El sistema debe permitir a un usuario autenticado reservar un ejemplar disponible.
- **RF15:** El sistema debe permitir registrar una reserva con un usuario y ejemplar asociados.

### Proceso: Préstamo
- **RF16:** El sistema debe permitir identificar al usuario y su reserva al momento de la entrega del ejemplar.
- **RF17:** El sistema debe permitir registrar la entrega del ejemplar al usuario.

### Proceso: Devolución
- **RF18:** El sistema debe permitir registrar la devolución de un ejemplar previamente prestado.
- **RF19:** El sistema debe permitir registrar el estado de conservación del ejemplar al devolverse.
- **RF20:** El sistema debe permitir restringir nuevos préstamos a un usuario mientras existan sanciones no solucionadas.
- **RF21:** El sistema debe permitir buscar e identificar una reserva por el código del ejemplar prestado.

---

## Macroproceso 3 y 4

### Proceso: Padrón y registro de lectores
- **RF22:** El sistema debe permitir el registro de nuevos usuarios.
- **RF23:** El sistema debe permitir la autenticación de usuarios registrados.
- **RF24:** El sistema debe permitir al usuario ingresar y editar su información de identificación.

### Proceso: Trazabilidad
- **RF25:** El sistema debe permitir consultar el historial de préstamos y devoluciones pendientes.
- **RF26:** El sistema debe permitir seleccionar el rango de fechas para el historial.
- **RF27:** El sistema debe permitir consultar los datos de usuarios con devoluciones pendientes.

### Proceso: Elaboración de Reportes
- **RF28:** El sistema debe permitir generar reportes sobre el catálogo de libros.
- **RF29:** El sistema debe permitir generar reportes sobre los ejemplares físicos.