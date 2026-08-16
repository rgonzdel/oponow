# Oponow — monorepo

MVP de backend para Oponow (temarios + tests de oposiciones). Este repo
contiene, por ahora, solo el backend (`apps/api`) y el paquete de base de
datos (`packages/db`) — el frontend y la app móvil llegan en una fase
posterior.

## Requisitos

- Node.js 20+
- pnpm (`corepack enable` si no lo tienes)
- Docker Desktop (Postgres local)

## Puesta en marcha

```bash
cp .env.example .env
# genera un JWT_ACCESS_SECRET real y pégalo en .env, p.ej.:
# node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"

pnpm install

docker compose -f docker/docker-compose.yml --env-file .env up -d

pnpm db:generate   # genera SQL de migración a partir del schema de Drizzle
pnpm db:migrate    # aplica las migraciones (rol admin)
pnpm db:rls        # aplica grants + políticas RLS (rol admin)

pnpm --filter @oponow/db build
pnpm --filter @oponow/api dev
```

La API queda en `http://localhost:3000`.

## Roles de Postgres

| Rol            | Usado por            | RLS                                   |
|----------------|-----------------------|----------------------------------------|
| `oponow_admin` | migraciones, seed      | dueño de las tablas, no sujeto a RLS  |
| `app_user`     | API, casi todo         | `NOBYPASSRLS`, sujeto a todas las políticas |
| `auth_service` | solo `AuthService`     | `BYPASSRLS`, pero con `GRANT` a nivel de columna en `usuarios`/`refresh_tokens` — necesario para resolver login/refresh antes de conocer la identidad del llamante |

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
