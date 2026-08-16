-- Privilegios de tabla para el rol de runtime (app_user). RLS decide QUÉ
-- filas ve, esto decide qué operaciones puede intentar en cada tabla.
-- Se ejecuta con el rol admin (dueño de las tablas) tras cada migración.

GRANT SELECT, INSERT, UPDATE, DELETE ON
  usuarios,
  refresh_tokens,
  intentos_test,
  respuestas_usuario,
  suscripciones_oposicion,
  sesiones_lectura
TO app_user;

-- Contenido y catálogo: solo lectura desde la API en este paso. La
-- autoría/alta de contenido se hace vía el rol admin (migraciones/seed),
-- que es dueño de las tablas y por tanto no está sujeto a RLS.
GRANT SELECT ON
  oposiciones,
  leyes,
  articulos,
  temas,
  bloques_contenido,
  preguntas
TO app_user;

-- Para que las migraciones futuras (nuevas tablas creadas por este mismo
-- rol admin) también concedan privilegios a app_user automáticamente.
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;
