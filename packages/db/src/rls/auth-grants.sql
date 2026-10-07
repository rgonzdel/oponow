-- Privilegios del rol auth_service (BYPASSRLS, pero de alcance mínimo por
-- columna). Solo lo usa AuthService, y solo para los pasos donde la
-- identidad del llamante todavía no se conoce:
--   - login: buscar el usuario por email para verificar la contraseña.
--   - register: comprobar si el email ya existe.
--   - refresh: buscar y revocar el refresh token presentado por hash.
-- Cualquier otra lectura/escritura de "usuarios" o "refresh_tokens" (p. ej.
-- ver el propio perfil) sigue pasando por app_user + RLS normal.

--   - login con Google/Facebook: buscar la identidad externa antes de
--     saber de qué usuario se trata.
--   - MFA por correo: localizar el desafío por id al verificar o reenviar
--     el código, y contar los intentos fallidos.
--   - restablecer la contraseña: localizar el enlace por el hash de su token
--     antes de saber de qué usuario es.
GRANT SELECT (id, email, password_hash, plan, plan_expira, email_verified, es_admin, rol)
  ON usuarios TO auth_service;

GRANT SELECT (id, usuario_id, codigo_hash, intentos, reenvios, expira_en, enviado_en, usado_en)
  ON desafios_mfa TO auth_service;

GRANT UPDATE (codigo_hash, intentos, reenvios, expira_en, enviado_en, usado_en)
  ON desafios_mfa TO auth_service;

GRANT SELECT (id, usuario_id, token_hash, expira_en, usado_en)
  ON restablecimientos_contrasena TO auth_service;

GRANT SELECT (id, usuario_id, proveedor, sujeto)
  ON identidades_externas TO auth_service;

GRANT SELECT (id, usuario_id, token_hash, expires_at, revoked_at)
  ON refresh_tokens TO auth_service;

GRANT UPDATE (revoked_at)
  ON refresh_tokens TO auth_service;
