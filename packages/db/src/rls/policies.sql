-- Políticas RLS. Se ejecutan con el rol admin (dueño de las tablas), que
-- por defecto NO está sujeto a sus propias políticas (solo app_user lo está,
-- porque es NOBYPASSRLS). current_setting(..., true) devuelve NULL si nunca
-- se llamó a set_config en la sesión -> las comparaciones son NULL -> deny
-- por defecto. Es decir, si el middleware de la API fallara en fijar el
-- contexto, RLS deniega en vez de exponer datos (fail closed).

-- ===== Tablas propiedad exclusiva del usuario =====
-- Una sola política por tabla (sin FOR) cubre SELECT/INSERT/UPDATE/DELETE.

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS usuarios_self ON usuarios;
CREATE POLICY usuarios_self ON usuarios
  USING (id = current_setting('app.current_user_id', true)::uuid)
  WITH CHECK (id = current_setting('app.current_user_id', true)::uuid);

-- auth_service necesita leer usuarios ANTES de conocer la identidad
-- (login/register comprueban el email antes de que exista un
-- app.current_user_id que comparar). En un Postgres propio esto se
-- resolvía con el atributo de rol BYPASSRLS; algunos proveedores
-- gestionados (p.ej. Render) no dejan que un admin no-superusuario
-- conceda BYPASSRLS, así que en su lugar usamos una política permisiva
-- explícita solo para ese rol. auth-grants.sql ya restringe qué COLUMNAS
-- puede ver — esta política solo abre qué FILAS. Combinadas dan el mismo
-- aislamiento que BYPASSRLS. Es redundante donde auth_service sí tiene
-- BYPASSRLS (docker/init/01-roles.sh en local), pero inofensiva.
DROP POLICY IF EXISTS usuarios_auth_service ON usuarios;
CREATE POLICY usuarios_auth_service ON usuarios
  FOR SELECT TO auth_service USING (true);

ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS refresh_tokens_self ON refresh_tokens;
CREATE POLICY refresh_tokens_self ON refresh_tokens
  USING (usuario_id = current_setting('app.current_user_id', true)::uuid)
  WITH CHECK (usuario_id = current_setting('app.current_user_id', true)::uuid);

-- Mismo motivo que usuarios_auth_service: refresh() busca el token por su
-- hash (SELECT) y lo revoca (UPDATE revoked_at) antes de saber de quién es.
DROP POLICY IF EXISTS refresh_tokens_auth_service_select ON refresh_tokens;
CREATE POLICY refresh_tokens_auth_service_select ON refresh_tokens
  FOR SELECT TO auth_service USING (true);

DROP POLICY IF EXISTS refresh_tokens_auth_service_update ON refresh_tokens;
CREATE POLICY refresh_tokens_auth_service_update ON refresh_tokens
  FOR UPDATE TO auth_service USING (true) WITH CHECK (true);

ALTER TABLE identidades_externas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS identidades_externas_self ON identidades_externas;
CREATE POLICY identidades_externas_self ON identidades_externas
  USING (usuario_id = current_setting('app.current_user_id', true)::uuid)
  WITH CHECK (usuario_id = current_setting('app.current_user_id', true)::uuid);

-- Login con Google/Facebook: hay que encontrar la identidad por
-- (proveedor, sujeto) antes de conocer al usuario. Mismo patrón que
-- usuarios_auth_service; auth-grants.sql limita las columnas.
DROP POLICY IF EXISTS identidades_externas_auth_service_select ON identidades_externas;
CREATE POLICY identidades_externas_auth_service_select ON identidades_externas
  FOR SELECT TO auth_service USING (true);

ALTER TABLE desafios_mfa ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS desafios_mfa_self ON desafios_mfa;
CREATE POLICY desafios_mfa_self ON desafios_mfa
  USING (usuario_id = current_setting('app.current_user_id', true)::uuid)
  WITH CHECK (usuario_id = current_setting('app.current_user_id', true)::uuid);

-- Verificar o reenviar un código: se busca el desafío por id antes de saber
-- de quién es (como refresh_tokens). auth-grants.sql limita las columnas.
DROP POLICY IF EXISTS desafios_mfa_auth_service_select ON desafios_mfa;
CREATE POLICY desafios_mfa_auth_service_select ON desafios_mfa
  FOR SELECT TO auth_service USING (true);

DROP POLICY IF EXISTS desafios_mfa_auth_service_update ON desafios_mfa;
CREATE POLICY desafios_mfa_auth_service_update ON desafios_mfa
  FOR UPDATE TO auth_service USING (true) WITH CHECK (true);

ALTER TABLE restablecimientos_contrasena ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS restablecimientos_contrasena_self ON restablecimientos_contrasena;
CREATE POLICY restablecimientos_contrasena_self ON restablecimientos_contrasena
  USING (usuario_id = current_setting('app.current_user_id', true)::uuid)
  WITH CHECK (usuario_id = current_setting('app.current_user_id', true)::uuid);

-- El enlace del correo solo trae el token: se busca por su hash antes de
-- saber de quién es. auth-grants.sql limita las columnas.
DROP POLICY IF EXISTS restablecimientos_contrasena_auth_service_select ON restablecimientos_contrasena;
CREATE POLICY restablecimientos_contrasena_auth_service_select ON restablecimientos_contrasena
  FOR SELECT TO auth_service USING (true);

ALTER TABLE dispositivos_confianza ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS dispositivos_confianza_self ON dispositivos_confianza;
CREATE POLICY dispositivos_confianza_self ON dispositivos_confianza
  USING (usuario_id = current_setting('app.current_user_id', true)::uuid)
  WITH CHECK (usuario_id = current_setting('app.current_user_id', true)::uuid);

ALTER TABLE intentos_test ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS intentos_test_self ON intentos_test;
CREATE POLICY intentos_test_self ON intentos_test
  USING (usuario_id = current_setting('app.current_user_id', true)::uuid)
  WITH CHECK (usuario_id = current_setting('app.current_user_id', true)::uuid);

ALTER TABLE respuestas_usuario ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS respuestas_usuario_self ON respuestas_usuario;
CREATE POLICY respuestas_usuario_self ON respuestas_usuario
  USING (
    EXISTS (
      SELECT 1 FROM intentos_test it
      WHERE it.id = respuestas_usuario.intento_id
        AND it.usuario_id = current_setting('app.current_user_id', true)::uuid
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM intentos_test it
      WHERE it.id = respuestas_usuario.intento_id
        AND it.usuario_id = current_setting('app.current_user_id', true)::uuid
    )
  );

ALTER TABLE examenes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS examenes_self ON examenes;
CREATE POLICY examenes_self ON examenes
  USING (usuario_id = current_setting('app.current_user_id', true)::uuid)
  WITH CHECK (usuario_id = current_setting('app.current_user_id', true)::uuid);

ALTER TABLE respuestas_examen ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS respuestas_examen_self ON respuestas_examen;
CREATE POLICY respuestas_examen_self ON respuestas_examen
  USING (
    EXISTS (
      SELECT 1 FROM examenes e
      WHERE e.id = respuestas_examen.examen_id
        AND e.usuario_id = current_setting('app.current_user_id', true)::uuid
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM examenes e
      WHERE e.id = respuestas_examen.examen_id
        AND e.usuario_id = current_setting('app.current_user_id', true)::uuid
    )
  );

ALTER TABLE suscripciones_oposicion ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS suscripciones_oposicion_self ON suscripciones_oposicion;
CREATE POLICY suscripciones_oposicion_self ON suscripciones_oposicion
  USING (usuario_id = current_setting('app.current_user_id', true)::uuid)
  WITH CHECK (usuario_id = current_setting('app.current_user_id', true)::uuid);

ALTER TABLE sesiones_lectura ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS sesiones_lectura_self ON sesiones_lectura;
CREATE POLICY sesiones_lectura_self ON sesiones_lectura
  USING (usuario_id = current_setting('app.current_user_id', true)::uuid)
  WITH CHECK (usuario_id = current_setting('app.current_user_id', true)::uuid);

ALTER TABLE tareas_agenda ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS tareas_agenda_self ON tareas_agenda;
CREATE POLICY tareas_agenda_self ON tareas_agenda
  USING (usuario_id = current_setting('app.current_user_id', true)::uuid)
  WITH CHECK (usuario_id = current_setting('app.current_user_id', true)::uuid);

ALTER TABLE google_calendar_conexiones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS google_calendar_conexiones_self ON google_calendar_conexiones;
CREATE POLICY google_calendar_conexiones_self ON google_calendar_conexiones
  USING (usuario_id = current_setting('app.current_user_id', true)::uuid)
  WITH CHECK (usuario_id = current_setting('app.current_user_id', true)::uuid);

-- ===== Panel de administración =====
-- app.is_admin lo fija RlsContextMiddleware a partir de usuarios.es_admin
-- (viaja en el JWT) — nunca se puede activar desde la API pública. Políticas
-- ADITIVAS junto a usuarios_self/suscripciones_oposicion_self (Postgres
-- combina varias políticas permisivas del mismo comando con OR), así que no
-- hace falta tocar las políticas de autopropiedad ya existentes.
DROP POLICY IF EXISTS usuarios_admin_read ON usuarios;
CREATE POLICY usuarios_admin_read ON usuarios
  FOR SELECT USING (current_setting('app.is_admin', true) = 'true');

DROP POLICY IF EXISTS usuarios_admin_update ON usuarios;
CREATE POLICY usuarios_admin_update ON usuarios
  FOR UPDATE
  USING (current_setting('app.is_admin', true) = 'true')
  WITH CHECK (current_setting('app.is_admin', true) = 'true');

DROP POLICY IF EXISTS usuarios_equipo_read ON usuarios;
CREATE POLICY usuarios_equipo_read ON usuarios
  FOR SELECT USING (current_setting('app.current_role', true) IN ('admin', 'soporte', 'lectura'));

DROP POLICY IF EXISTS usuarios_equipo_update ON usuarios;
CREATE POLICY usuarios_equipo_update ON usuarios
  FOR UPDATE
  USING (current_setting('app.current_role', true) IN ('admin', 'soporte'))
  WITH CHECK (current_setting('app.current_role', true) IN ('admin', 'soporte'));

DROP POLICY IF EXISTS suscripciones_oposicion_equipo_read ON suscripciones_oposicion;
CREATE POLICY suscripciones_oposicion_equipo_read ON suscripciones_oposicion
  FOR SELECT USING (current_setting('app.current_role', true) IN ('admin', 'soporte', 'lectura'));

DROP POLICY IF EXISTS suscripciones_oposicion_admin_read ON suscripciones_oposicion;
CREATE POLICY suscripciones_oposicion_admin_read ON suscripciones_oposicion
  FOR SELECT USING (current_setting('app.is_admin', true) = 'true');

-- Asignar o retirar una oposición a mano desde el panel (solo
-- administración; la API además exige el permiso asignar_oposiciones).
DROP POLICY IF EXISTS suscripciones_oposicion_admin_insert ON suscripciones_oposicion;
CREATE POLICY suscripciones_oposicion_admin_insert ON suscripciones_oposicion
  FOR INSERT WITH CHECK (current_setting('app.current_role', true) = 'admin');

DROP POLICY IF EXISTS suscripciones_oposicion_admin_update ON suscripciones_oposicion;
CREATE POLICY suscripciones_oposicion_admin_update ON suscripciones_oposicion
  FOR UPDATE
  USING (current_setting('app.current_role', true) = 'admin')
  WITH CHECK (current_setting('app.current_role', true) = 'admin');

-- ===== Catálogo público (leyes, artículos, oposiciones) =====
-- Sin dato de usuario; RLS explícita igualmente por higiene y para que
-- quede documentado que la decisión de "público" fue intencional.

ALTER TABLE oposiciones ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS oposiciones_publicas ON oposiciones;
CREATE POLICY oposiciones_publicas ON oposiciones
  FOR SELECT USING (activa);

ALTER TABLE leyes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS leyes_publicas ON leyes;
CREATE POLICY leyes_publicas ON leyes FOR SELECT USING (true);

ALTER TABLE articulos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS articulos_publicos ON articulos;
CREATE POLICY articulos_publicos ON articulos FOR SELECT USING (true);

-- ===== Temario gated por plan/suscripción =====
-- Free: solo temas es_gratuito (Tema 1 de cada oposición).
-- Lite: además, temas de oposiciones con suscripción activa.
-- Vip: todo.

ALTER TABLE temas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS temas_visibles ON temas;
CREATE POLICY temas_visibles ON temas
  FOR SELECT USING (
    es_gratuito
    OR current_setting('app.current_plan', true) = 'vip'
    OR current_setting('app.current_role', true) IN ('admin', 'editor')
    OR EXISTS (
      SELECT 1 FROM suscripciones_oposicion so
      WHERE so.oposicion_id = temas.oposicion_id
        AND so.usuario_id = current_setting('app.current_user_id', true)::uuid
        AND so.activa
    )
  );

ALTER TABLE bloques_contenido ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS bloques_contenido_visibles ON bloques_contenido;
CREATE POLICY bloques_contenido_visibles ON bloques_contenido
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM temas t
      WHERE t.id = bloques_contenido.tema_id
        AND (
          t.es_gratuito
          OR current_setting('app.current_plan', true) = 'vip'
          OR current_setting('app.current_role', true) IN ('admin', 'editor')
          OR EXISTS (
            SELECT 1 FROM suscripciones_oposicion so
            WHERE so.oposicion_id = t.oposicion_id
              AND so.usuario_id = current_setting('app.current_user_id', true)::uuid
              AND so.activa
          )
        )
    )
  );

ALTER TABLE preguntas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS preguntas_visibles ON preguntas;
CREATE POLICY preguntas_visibles ON preguntas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM temas t
      WHERE t.id = preguntas.tema_id
        AND (
          t.es_gratuito
          OR current_setting('app.current_plan', true) = 'vip'
          OR current_setting('app.current_role', true) IN ('admin', 'editor')
          OR EXISTS (
            SELECT 1 FROM suscripciones_oposicion so
            WHERE so.oposicion_id = t.oposicion_id
              AND so.usuario_id = current_setting('app.current_user_id', true)::uuid
              AND so.activa
          )
        )
    )
  );

-- Flashcards: visibles si pertenecen a algún tema visible para el usuario
-- (mismo criterio que temas/preguntas). Una tarjeta compartida por varios
-- temas se ve en cuanto uno de ellos lo sea.
ALTER TABLE flashcards_temas ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS flashcards_temas_visibles ON flashcards_temas;
CREATE POLICY flashcards_temas_visibles ON flashcards_temas
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM temas t
      WHERE t.id = flashcards_temas.tema_id
        AND (
          t.es_gratuito
          OR current_setting('app.current_plan', true) = 'vip'
          OR current_setting('app.current_role', true) IN ('admin', 'editor')
          OR EXISTS (
            SELECT 1 FROM suscripciones_oposicion so
            WHERE so.oposicion_id = t.oposicion_id
              AND so.usuario_id = current_setting('app.current_user_id', true)::uuid
              AND so.activa
          )
        )
    )
  );

ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS flashcards_visibles ON flashcards;
CREATE POLICY flashcards_visibles ON flashcards
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM flashcards_temas ft
      WHERE ft.flashcard_id = flashcards.id
        AND EXISTS (
          SELECT 1 FROM temas t
          WHERE t.id = ft.tema_id
            AND (
              t.es_gratuito
              OR current_setting('app.current_plan', true) = 'vip'
              OR current_setting('app.current_role', true) IN ('admin', 'editor')
              OR EXISTS (
                SELECT 1 FROM suscripciones_oposicion so
                WHERE so.oposicion_id = t.oposicion_id
                  AND so.usuario_id = current_setting('app.current_user_id', true)::uuid
                  AND so.activa
              )
            )
        )
    )
  );

ALTER TABLE flashcards_progreso ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS flashcards_progreso_self ON flashcards_progreso;
CREATE POLICY flashcards_progreso_self ON flashcards_progreso
  USING (usuario_id = current_setting('app.current_user_id', true)::uuid)
  WITH CHECK (usuario_id = current_setting('app.current_user_id', true)::uuid);

-- Nota: el límite de "1 test diario" en plan free NO es una política RLS
-- (RLS filtra filas, no cuenta filas). Se aplica en el servicio de NestJS
-- que crea intentos_test, consultando cuántos intentos ya existen hoy para
-- ese usuario+tema antes de insertar uno nuevo.
