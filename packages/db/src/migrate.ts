import path from "node:path";
import { config } from "dotenv";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { sslModeFor } from "./ssl";

config({ path: path.resolve(__dirname, "../../../.env") });

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL no está definida (revisa tu .env)");

  // Rol admin: única conexión, corre las migraciones DDL.
  const migrationClient = postgres(url, { max: 1, ssl: sslModeFor(url) });
  const db = drizzle(migrationClient);

  console.log("Aplicando migraciones...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migraciones aplicadas.");

  await migrationClient.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
