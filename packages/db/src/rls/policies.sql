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

ALTER TABLE refresh_tokens ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS refresh_tokens_self ON refresh_tokens;
CREATE POLICY refresh_tokens_self ON refresh_tokens
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
          OR EXISTS (
            SELECT 1 FROM suscripciones_oposicion so
            WHERE so.oposicion_id = t.oposicion_id
              AND so.usuario_id = current_setting('app.current_user_id', true)::uuid
              AND so.activa
          )
        )
    )
  );

-- Nota: el límite de "1 test diario" en plan free NO es una política RLS
-- (RLS filtra filas, no cuenta filas). Se aplica en el servicio de NestJS
-- que crea intentos_test, consultando cuántos intentos ya existen hoy para
-- ese usuario+tema antes de insertar uno nuevo.
