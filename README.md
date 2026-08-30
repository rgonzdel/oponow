# Oponow — monorepo

MVP de Oponow (temarios + tests de oposiciones): backend (`apps/api`), web
(`apps/web`), app móvil (`apps/mobile`) y el paquete de base de datos
(`packages/db`).

## Stack de despliegue

| Pieza     | Dónde vive |
|-----------|------------|
| Web       | Vercel |
| API       | Render |
| Postgres  | Supabase |

## Requisitos

- Node.js 20+
- pnpm (`corepack enable` si no lo tienes)
- Un proyecto de Supabase (gratis vale para desarrollo) — no hace falta Docker

## Puesta en marcha

```bash
cp .env.example .env
# genera un JWT_ACCESS_SECRET real y pégalo en .env, p.ej.:
# node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"

pnpm install
```

Crea un proyecto en [supabase.com](https://supabase.com), copia su
**conexión directa** (Project Settings > Database > Connection string >
"Direct connection", puerto 5432 — no el pooler Supavisor en modo
"Transaction", ver el comentario en `.env.example`) y pégala como
`DATABASE_URL` en `.env` (rol admin `postgres`, la password la fijaste al
crear el proyecto). Genera también `POSTGRES_APP_PASSWORD` y
`POSTGRES_AUTH_SERVICE_PASSWORD`, y completa `DATABASE_APP_URL` /
`DATABASE_AUTH_URL` con el mismo host pero esos roles.

```bash
pnpm db:bootstrap-roles  # crea app_user y auth_service en el proyecto (una sola vez)
pnpm db:generate         # genera SQL de migración a partir del schema de Drizzle
pnpm db:migrate          # aplica las migraciones (rol admin)
pnpm db:rls              # aplica grants + políticas RLS (rol admin)

pnpm --filter @oponow/db build
pnpm --filter @oponow/api dev
```

La API queda en `http://localhost:3000`.

> Nota: `docker/` contiene un Postgres local equivalente (con roles
> autoprovisionados vía `docker/init/01-roles.sh`) por si prefieres no
> depender de un proyecto Supabase para desarrollo local, pero el flujo
> soportado en staging/producción es Supabase.

## Roles de Postgres

| Rol            | Usado por            | RLS                                   |
|----------------|-----------------------|----------------------------------------|
| `oponow_admin` | migraciones, seed      | dueño de las tablas, no sujeto a RLS  |
| `app_user`     | API, casi todo         | `NOBYPASSRLS`, sujeto a todas las políticas |
| `auth_service` | solo `AuthService`     | `NOBYPASSRLS`, con políticas RLS permisivas dedicadas + `GRANT` a nivel de columna en `usuarios`/`refresh_tokens` — necesario para resolver login/refresh antes de conocer la identidad del llamante (algunos proveedores gestionados, Supabase incluido, no dejan conceder `BYPASSRLS` a un admin no-superusuario) |

Cada request de la API fija `app.current_user_id` / `app.current_plan`
(vía `set_config`, ver `apps/api/src/database/rls-context.middleware.ts`)
sobre una conexión reservada del pool de `app_user` antes de tocar la base
de datos. Las políticas están en `packages/db/src/rls/policies.sql`.

## Estructura

```
apps/api        NestJS: auth (registro/login/refresh/logout) + contexto RLS
packages/db     Schema Drizzle, migraciones, políticas RLS
docker/         Postgres local + creación de roles
```
