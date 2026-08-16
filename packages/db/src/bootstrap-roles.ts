import path from "node:path";
import { config } from "dotenv";
import postgres from "postgres";
import { sslModeFor } from "./ssl";

config({ path: path.resolve(__dirname, "../../../.env") });

/**
 * Equivalente a docker/init/01-roles.sh, pero para una base de datos
 * gestionada externa (Render, Supabase, etc.) que no ejecuta scripts de
 * inicialización propios — hay que crear los roles de runtime a mano, una
 * vez, contra el rol admin que el proveedor te da.
 *
 * Requiere: DATABASE_URL (rol admin), POSTGRES_APP_USER,
 * POSTGRES_APP_PASSWORD, POSTGRES_AUTH_SERVICE_USER,
 * POSTGRES_AUTH_SERVICE_PASSWORD. Los nombres de rol deben ser exactamente
 * "app_user" y "auth_service" salvo que también actualices
 * packages/db/src/rls/{grants,auth-grants,policies}.sql, que los tienen
 * escritos literalmente.
 *
 * auth_service se crea NOBYPASSRLS a propósito: muchos proveedores
 * gestionados (Render incluido) no dejan que un admin no-superusuario
 * conceda BYPASSRLS a otro rol. En su lugar, policies.sql define políticas
 * permisivas explícitas para auth_service — mismo resultado práctico, sin
 * necesitar ese privilegio. Corre `pnpm db:rls` después de este script.
 */
async function main() {
  const url = process.env.DATABASE_URL;
  const appUser = process.env.POSTGRES_APP_USER;
  const appPassword = process.env.POSTGRES_APP_PASSWORD;
  const authUser = process.env.POSTGRES_AUTH_SERVICE_USER;
  const authPassword = process.env.POSTGRES_AUTH_SERVICE_PASSWORD;

  if (!url || !appUser || !appPassword || !authUser || !authPassword) {
    throw new Error(
      "Faltan variables: DATABASE_URL, POSTGRES_APP_USER, POSTGRES_APP_PASSWORD, " +
        "POSTGRES_AUTH_SERVICE_USER, POSTGRES_AUTH_SERVICE_PASSWORD",
    );
  }

  const dbName = new URL(url).pathname.slice(1);
  if (!dbName) throw new Error("No se pudo extraer el nombre de la base de datos de DATABASE_URL");

  const sql = postgres(url, { max: 1, ssl: sslModeFor(url) });

  try {
    await sql.unsafe(`CREATE EXTENSION IF NOT EXISTS pgcrypto`);

    await sql.unsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${appUser}') THEN
          CREATE ROLE ${appUser} WITH LOGIN PASSWORD '${appPassword}' NOBYPASSRLS NOSUPERUSER NOCREATEDB NOCREATEROLE;
        ELSE
          ALTER ROLE ${appUser} WITH LOGIN PASSWORD '${appPassword}' NOBYPASSRLS NOSUPERUSER NOCREATEDB NOCREATEROLE;
        END IF;
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '${authUser}') THEN
          CREATE ROLE ${authUser} WITH LOGIN PASSWORD '${authPassword}' NOBYPASSRLS NOSUPERUSER NOCREATEDB NOCREATEROLE;
        ELSE
          ALTER ROLE ${authUser} WITH LOGIN PASSWORD '${authPassword}' NOBYPASSRLS NOSUPERUSER NOCREATEDB NOCREATEROLE;
        END IF;
      END
      $$;
    `);

    await sql.unsafe(`GRANT CONNECT ON DATABASE ${dbName} TO ${appUser}`);
    await sql.unsafe(`GRANT USAGE ON SCHEMA public TO ${appUser}`);
    await sql.unsafe(`GRANT CONNECT ON DATABASE ${dbName} TO ${authUser}`);
    await sql.unsafe(`GRANT USAGE ON SCHEMA public TO ${authUser}`);

    console.log(`Roles listos: ${appUser} y ${authUser} (ambos NOBYPASSRLS).`);
    console.log(
      "Aún faltan los privilegios de tabla — corre `pnpm db:rls` después de `pnpm db:migrate`.",
    );
  } finally {
    await sql.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
