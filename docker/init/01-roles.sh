#!/bin/bash
# Se ejecuta una sola vez, al crear el volumen de datos por primera vez.
# Crea dos roles de runtime, con dos propósitos distintos:
#
#   app_user      -- NOBYPASSRLS. Lo usa la API para (casi) todo. Sujeto
#                    íntegramente a las políticas RLS de packages/db/src/rls.
#   auth_service  -- BYPASSRLS, pero con privilegios de columna mínimos
#                    (solo usuarios y refresh_tokens). Resuelve el problema
#                    de "huevo y gallina" del login: para verificar un email
#                    + contraseña, o para rotar un refresh token, hace falta
#                    leer la fila ANTES de conocer la identidad del llamante,
#                    algo que una política "solo el dueño" no puede permitir
#                    sin dejar de ser "solo el dueño". Es el mismo patrón que
#                    usa Supabase internamente: GoTrue tiene su propia
#                    conexión privilegiada a auth.users, separada del rol
#                    anon/authenticated que usa el resto de la app.
#
# Las migraciones (drizzle-kit) corren con el rol admin ($POSTGRES_USER),
# que en este contenedor es superusuario.
set -euo pipefail

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
  CREATE EXTENSION IF NOT EXISTS pgcrypto;

  DO \$\$
  BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${APP_USER}') THEN
      CREATE ROLE ${APP_USER} WITH LOGIN PASSWORD '${APP_PASSWORD}' NOBYPASSRLS NOSUPERUSER NOCREATEDB NOCREATEROLE;
    END IF;
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${AUTH_SERVICE_USER}') THEN
      CREATE ROLE ${AUTH_SERVICE_USER} WITH LOGIN PASSWORD '${AUTH_SERVICE_PASSWORD}' BYPASSRLS NOSUPERUSER NOCREATEDB NOCREATEROLE;
    END IF;
  END
  \$\$;

  GRANT CONNECT ON DATABASE ${POSTGRES_DB} TO ${APP_USER};
  GRANT USAGE ON SCHEMA public TO ${APP_USER};

  GRANT CONNECT ON DATABASE ${POSTGRES_DB} TO ${AUTH_SERVICE_USER};
  GRANT USAGE ON SCHEMA public TO ${AUTH_SERVICE_USER};

  -- Privilegios de tabla se otorgan tras crear el esquema (ver
  -- packages/db/src/rls/grants.sql y auth-grants.sql, aplicados con
  -- "pnpm db:rls" después de cada migración) porque las tablas todavía no
  -- existen en este punto.
EOSQL
