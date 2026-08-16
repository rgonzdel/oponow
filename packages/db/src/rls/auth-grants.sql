-- Privilegios del rol auth_service (BYPASSRLS, pero de alcance mínimo por
-- columna). Solo lo usa AuthService, y solo para los pasos donde la
-- identidad del llamante todavía no se conoce:
--   - login: buscar el usuario por email para verificar la contraseña.
--   - register: comprobar si el email ya existe.
--   - refresh: buscar y revocar el refresh token presentado por hash.
-- Cualquier otra lectura/escritura de "usuarios" o "refresh_tokens" (p. ej.
-- ver el propio perfil) sigue pasando por app_user + RLS normal.

GRANT SELECT (id, email, password_hash, plan, plan_expira, email_verified, es_admin)
  ON usuarios TO auth_service;

GRANT SELECT (id, usuario_id, token_hash, expires_at, revoked_at)
  ON refresh_tokens TO auth_service;

GRANT UPDATE (revoked_at)
  ON refresh_tokens TO auth_service;
